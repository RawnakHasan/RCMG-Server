import type { Server, Socket } from "socket.io";
import { games } from "../game.ts";
import { generateDeck } from "../lib/generateDeck.ts";
import { fisherYatesShuffle } from "../lib/fisherYatesShuffle.ts";

export const handleStartGame = (socket: Socket, io: Server) => {
  socket.on("startGame", ({ roomId }: { roomId: string }) => {
    const game = games.get(roomId);

    if (!game) return console.log(`Game with ${roomId} not found`);

    const deck = generateDeck();
    const shuffledDeck = fisherYatesShuffle(deck);

    game.gamePhase = "playing";
    game.players.forEach(
      (player) => (player.hand = shuffledDeck.splice(0, 26))
    );
    const topCard = shuffledDeck.pop()!;
    game.discardPile = [topCard];
    game.deck = shuffledDeck;

    io.to(roomId).emit("gameUpdate", game);
  });
};
