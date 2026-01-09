import type { Card } from "./card.ts";

export type Player = {
  uuid: string;
  id: number;
  username: string;
  host: boolean;
  hand: Card[];
};

export type GamePhase = "waiting" | "playing" | "finished";

export type Game = {
  players: Player[];
  deck: Card[];
  discardPile: Card[];
  rotation: 1 | -1;
  gamePhase: GamePhase;
  hostSocketId: string;
  drawCount: number;
  playerTurn: Player;
};
