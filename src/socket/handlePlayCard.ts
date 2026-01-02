import type { Server, Socket } from "socket.io";
import type { Card } from "../types/card";
import { games } from "../game";
import { handleCardEffect, isValidPlay } from "../lib/helpers";

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

      const topCard = game.discardPile[0];
      if (!topCard) {
        console.log("No top card in discard pile");
        return;
      }
      console.log(topCard); // DEBUG

      // Check if the card can be played
      const canPlay = isValidPlay(card, topCard);

      if (!canPlay) {
        console.log(`Invalid play: ${card.name} on ${topCard.name}`);
        return; // Don't remove card from hand, don't update game
      }

      // Remove card from player's hand
      const [playedCard] = player.hand.splice(cardIndex, 1);
      if (!playedCard) {
        console.log("Played Card Not found in the User Hand");
        return;
      }

      // Add card to discard pile
      game.discardPile.unshift(playedCard);

      // Handle card effects (Draw 2, Reverse, Skip, etc.)
      handleCardEffect(game, playedCard, username);

      // Emit updated game state
      io.to(roomId).emit("gameUpdate", game);
    }
  );
};
