import type { Server, Socket } from "socket.io";
import type { Card } from "../types/card";
import { games } from "../game";
import { isValidPlay, playCard } from "../lib/CardHelpers";
import {
  getCardWithCardId,
  getNextPlayer,
  getPlayerWithUsername,
  getTopCard,
} from "../lib/GameHelpers";

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

      const player = getPlayerWithUsername(game, username);
      if (!player) {
        console.log(`Player ${username} not found`);
        return;
      }

      if (game.playerTurn !== player) {
        console.log(`Not your turn Player with username ${username}`);
        return;
      }

      const cardIndex = getCardWithCardId(player, card);
      if (cardIndex === -1) {
        console.log("Card not found in player's hand");
        return;
      }

      const topCard = getTopCard(game);
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

      playCard(game, player, cardIndex);
      game.playerTurn = getNextPlayer(game);

      // Emit updated game state
      io.to(roomId).emit("gameUpdate", game);
    }
  );
};
