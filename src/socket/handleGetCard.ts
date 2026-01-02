import type { Server, Socket } from "socket.io";
import { games } from "../game";
import { fisherYatesShuffle } from "../lib/fisherYatesShuffle";

export const handleGetCard = (socket: Socket, io: Server) => {
  socket.on("getCard", ({ roomId, username }) => {
    const game = games.get(roomId);

    if (!game) return console.log(`No game found with ${roomId} room Id`);

    const player = game.players.find((player) => player.username === username);

    if (!player) return console.log(`No player with ${username} found`);

    // Check if deck has cards
    if (game.deck.length === 0) {
      console.log("Deck is empty");
      if (game.discardPile.length <= 1) {
        console.log("Not enough cards in discard pile to reshuffle");
        return;
      }
      const topCard = game.discardPile.shift()!;
      game.deck = fisherYatesShuffle(game.discardPile);
      game.discardPile = [topCard];
    }

    const newCard = game.deck.pop()!;

    player.hand.push(newCard);

    io.to(roomId).emit("gameUpdate", game);
  });
};
