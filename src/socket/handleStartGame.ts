import type { Server, Socket } from "socket.io";
import { games } from "../game.ts";
import { generateDeck } from "../lib/generateDeck.ts";
import { fisherYatesShuffle } from "../lib/fisherYatesShuffle.ts";
import { dealCard } from "../lib/GameHelpers.ts";

export const handleStartGame = (socket: Socket, io: Server) => {
  socket.on("startGame", ({ roomId }: { roomId: string }) => {
    const game = games.get(roomId);
    if (!game) return;

    if (socket.id !== game.hostSocketId) {
      console.log("Non-host tried to start the game");
      return;
    }

    if (game.players.length < 2) return;

    const deck = generateDeck();
    const shuffledDeck = fisherYatesShuffle(deck);

    game.gamePhase = "playing";
    dealCard(game, shuffledDeck, 7);

    const topCard = shuffledDeck.pop()!;
    game.discardPile = [topCard];
    game.deck = shuffledDeck;

    io.to(roomId).emit("gameUpdate", game);
  });
};
