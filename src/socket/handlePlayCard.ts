import type { Server, Socket } from "socket.io";
import type { Card } from "../types/card";
import { games } from "../game";

export const handlePlayCard = (socket: Socket, io: Server) => {
  socket.on(
    "playCard",
    ({
      card,
      roomId,
      username,
    }: {
      card: Card;
      roomId: string;
      username: string;
    }) => {
      const game = games.get(roomId);
      if (!game) {
        console.log(`No Game with roomId ${roomId}`);
        return;
      }

      const player = game.players.find(
        (player) => player.username === username
      );
      if (!player) {
        console.log(`Player ${username} not found`);
        return;
      }

      const cardIndex = player.hand.findIndex((c) => c.id === card.id);

      if (cardIndex === -1) {
        console.log("Card not found in player's hand");
        return;
      }

      const [playedCard] = player.hand.splice(cardIndex, 1);

      if (!playedCard)
        return console.log("Played Card Not found in the User Hand");

      game.discardPile = [playedCard, ...game.discardPile];

      io.to(roomId).emit("gameUpdate", game);
    }
  );
};
