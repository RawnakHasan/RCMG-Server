export type CardColor = "Red" | "Blue" | "Green" | "Yellow";

export type NormalCard = {
  id: string;
  type: "Normal";
  name: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  color: CardColor;
  image: string;
};

export type ActionCard = {
  id: string;
  type: "Action";
  name: "Draw 2" | "Draw 4" | "Reverse" | "Skip" | "Skip All" | "Discard All";
  color: CardColor;
  image: string;
};

export type WildCard = {
  id: string;
  type: "Wild";
  name: "Draw 6" | "Draw 10" | "Color Roulette" | "Reverse Draw 4";
  chosenColor?: CardColor;
  image: string;
};

export type Card = NormalCard | ActionCard | WildCard;
