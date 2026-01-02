import type { Card } from "../types/card";

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
export function handleCardEffect(game: any, card: Card, username: string) {
  switch (card.type) {
    case "Action":
      switch (card.name) {
        case "Reverse":
          game.rotation *= -1;
          break;
        case "Skip":
          // TODO: Implement turn skipping logic
          break;
        case "Skip All":
          // TODO: Implement skip all logic
          break;
        case "Draw 2":
          // TODO: Implement draw 2 logic
          break;
        case "Draw 4":
          // TODO: Implement draw 4 logic
          break;
        case "Discard All":
          // TODO: Implement discard all logic
          break;
      }
      break;
    case "Wild":
      // TODO: Implement wild card color selection
      break;
  }
}
