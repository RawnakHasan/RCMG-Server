import type { Card } from "../types/card";
import type { Game, Player } from "../types/game.types";
import { reshuffle, skipPlayers, updatePlayerTurn } from "./GameHelpers";

export function playCard(game: Game, player: Player, cardIndex: number) {
  const [playedCard] = player.hand.splice(cardIndex, 1);
  if (!playedCard) {
    console.log("Played Card Not found in the User Hand");
    return;
  }

  // Handles Card Effects
  handleCardEffect(game, playedCard);
  // Add card to discard pile
  game.discardPile.unshift(playedCard);
}

export function isValidPlay(playedCard: Card, topCard: Card): boolean {
  // Wild cards can always be played
  if (playedCard.type === "Wild") {
    return true;
  }

  // Check color match (works for both Normal and Action cards)
  if (
    (topCard.type === "Wild" && playedCard.color === topCard.chosenColor) ||
    (topCard.type !== "Wild" && playedCard.color === topCard.color)
  ) {
    return true;
  }

  // Check if it's a Wild card on top (with chosen color)
  if (topCard.type === "Wild" && topCard.chosenColor) {
    if (playedCard.color === topCard.chosenColor) {
      return true;
    }
  }

  // Check name/number match for Normal cards
  if (
    playedCard.type === "Normal" &&
    topCard.type === "Normal" &&
    playedCard.name === topCard.name
  ) {
    return true;
  }

  // Check name match for Action cards
  if (
    playedCard.type === "Action" &&
    topCard.type === "Action" &&
    playedCard.name === topCard.name
  ) {
    return true;
  }

  return false;
}

// Helper function to handle card effects
export function handleCardEffect(game: Game, card: Card) {
  switch (card.type) {
    case "Action":
      switch (card.name) {
        case "Reverse":
          handleReverseCardEffect(game);
          break;
        case "Skip":
          handleSkipCardEffect(game);
          break;
        case "Skip All":
          handleSkipAllCardEffect(game);
          break;
        case "Draw 2":
          handleDrawCardEffect(game, 2);
          break;
        case "Draw 4":
          handleDrawCardEffect(game, 4);
          break;
        case "Discard All":
          handleDiscardAllEffect(game, card);
          break;
      }
      break;
    case "Wild":
      switch (card.name) {
        case "Reverse Draw 4":
          rotateGame(game);
          handleDrawCardEffect(game, 4);
          break;
        case "Color Roulette":
          handleColorRouletteEffect(game, card);
          break;
        case "Draw 6":
          handleDrawCardEffect(game, 6);
          break;
        case "Draw 10":
          handleDrawCardEffect(game, 10);
          break;
      }
      break;
  }
}

const rotateGame = (game: Game) => {
  game.rotation *= -1;
};

const handleReverseCardEffect = (game: Game) => {
  rotateGame(game);
  updatePlayerTurn(game);
};

const handleSkipCardEffect = (game: Game) => {
  game.playerTurn = skipPlayers(game);
};

const handleSkipAllCardEffect = (game: Game) => {
  // This is even not needed actually as you need to play another card but whatever
  game.playerTurn = skipPlayers(game, game.players.length - 1);
};

const handleDrawCardEffect = (game: Game, drawCount: number) => {
  game.drawCount += drawCount;
  updatePlayerTurn(game);
};

const handleDiscardAllEffect = (game: Game, card: Card) => {
  if (card.name === "Discard All") {
    const discardAllCardColor = card.color;
    const player = game.playerTurn;

    const sameCards = player.hand.filter(
      (handCard) =>
        handCard.type !== "Wild" && handCard.color === discardAllCardColor
    );

    player.hand = player.hand.filter(
      (handCard) =>
        handCard.type === "Wild" || handCard.color !== discardAllCardColor
    );

    game.discardPile.unshift(...sameCards);
    updatePlayerTurn(game);
  }
};

const handleColorRouletteEffect = (game: Game, card: Card) => {
  // The color should already be chosen by the player who played the card
  // (This would be set via UI before calling playCard)

  if (card.type === "Wild" && !card.chosenColor) {
    console.error("Color Roulette card played without choosing a color");
    return;
  }

  const nextPlayer = skipPlayers(game, 0); // Get the next player in rotation

  // Draw cards until the next player gets a card matching the chosen color
  while (true) {
    if (game.deck.length === 1) {
      console.log("Deck empty - need to reshuffle");
      reshuffle(game);
    }

    const drawnCard = game.deck.pop()!;
    nextPlayer.hand.push(drawnCard);

    // Check if the drawn card matches the chosen color (or is a Wild card)
    if (
      drawnCard.type !== "Wild" &&
      card.type !== "Wild" &&
      drawnCard.color === card.color
    ) {
      // Found a matching card - stop drawing
      break;
    }
  }

  // Skip the next player since they cannot play
  game.playerTurn = skipPlayers(game, 1);
};
