import type { Card } from "./card.ts";

export type Player = {
  username: string;
  host: boolean;
  hand: Card[];
};

export type Game = {
  players: Player[];
  deck: Card[];
  discardPile: Card[];
  rotation: 1 | -1;
  gamePhase: "waiting" | "playing" | "finished";
  hostUsername: string;
};
