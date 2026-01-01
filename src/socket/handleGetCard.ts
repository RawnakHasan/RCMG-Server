import type { Server, Socket } from "socket.io";
import { games } from "../game";

export const handleGetCard = (socket: Socket, io: Server) => {
  socket.on("getCard", ({ roomId, username }) => {
    const game = games.get(roomId);

    if (!game) return console.log(`No game found with ${roomId} room Id`);

    const player = game.players.find((player) => player.username === username);

    if (!player) return console.log(`No player with ${username} found`);

    // Check if deck has cards
    if (game.deck.length === 0) {
      console.log("Deck is empty");
      return;
    }

    const newCard = game.deck.pop()!;

    player.hand.push(newCard);

    io.to(roomId).emit("gameUpdate", game);
  });
};
