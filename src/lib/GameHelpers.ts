import type { Card } from "../types/card";
import type { Game, Player } from "../types/game.types";
import { fisherYatesShuffle } from "./fisherYatesShuffle";

export const createPlayer = (
  playersLength: number,
  username: string,
  socketId: string,
  isHost: boolean
): Player => {
  return {
    id: playersLength + 1,
    uuid: socketId,
    username,
    hand: [],
    host: isHost,
  };
};

export const dealCard = (
  game: Game,
  shuffledDeck: Card[],
  cardPerPlayer: number
) => {
  game.players.forEach(
    (player) => (player.hand = shuffledDeck.splice(0, cardPerPlayer))
  );
};

export const getPlayerWithUsername = (game: Game, username: string): Player => {
  return game.players.find((player) => player.username === username)!;
};

export const getCardWithCardId = (player: Player, card: Card): number => {
  return player.hand.findIndex((c) => c.id === card.id);
};

export const getTopCard = (game: Game): Card => {
  return game.discardPile[0]!;
};

export const getNextPlayer = (game: Game): Player => {
  const currentPlayer = getPlayerWithUsername(game, game.playerTurn.username);
  const currentPlayerIndex = game.players.findIndex(
    (player) => player.id === currentPlayer.id
  );

  // Calculate next index with wrapping
  const nextPlayerIndex =
    (currentPlayerIndex + game.rotation + game.players.length) %
    game.players.length;

  const nextPlayer = game.players[nextPlayerIndex]!;

  return nextPlayer;
};

export const skipPlayers = (game: Game, playersToSkip: number = 1): Player => {
  const currentPlayer = getPlayerWithUsername(game, game.playerTurn.username);
  const currentPlayerIndex = currentPlayer.id;

  // Move (playersToSkip + 1) positions to skip the specified number of players
  const nextPlayerIndex =
    (currentPlayerIndex +
      (playersToSkip + 1) * game.rotation +
      game.players.length) %
    game.players.length;

  const nextPlayer = game.players[nextPlayerIndex]!;

  return nextPlayer;
};

export const reshuffle = (game: Game) => {
  const topCard = game.discardPile.shift()!;
  game.deck = fisherYatesShuffle(game.discardPile);
  game.discardPile = [topCard];
};

export const updatePlayerTurn = (game: Game) => {
  game.playerTurn = getNextPlayer(game);
};
