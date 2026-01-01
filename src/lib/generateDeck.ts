import { nanoid } from "nanoid";
import type { Card, CardColor, NormalCard } from "../types/card.ts";

export const generateDeck = (): Card[] => {
  const Deck: Card[] = [];
  const CardColor: CardColor[] = ["Red", "Blue", "Green", "Yellow"] as const;

  CardColor.forEach((color) => {
    //Normal Card
    for (let i = 0; i <= 9; i++) {
      Deck.push({
        id: nanoid(),
        type: "Normal",
        color,
        name: i as NormalCard["name"],
        image: `/Cards/${color} ${i}.svg`,
      });
      Deck.push({
        id: nanoid(),
        type: "Normal",
        color,
        name: i as NormalCard["name"],
        image: `/Cards/${color} ${i}.svg`,
      });
    }

    //Action Card
    for (let i = 0; i < 3; i++) {
      Deck.push({
        id: nanoid(),
        type: "Action",
        color,
        name: "Reverse",
        image: `/Cards/${color} Reverse.svg`,
      });
      Deck.push({
        id: nanoid(),
        type: "Action",
        color,
        name: "Skip",
        image: `/Cards/${color} Skip.svg`,
      });
      Deck.push({
        id: nanoid(),
        type: "Action",
        color,
        name: "Skip All",
        image: `/Cards/${color} Skip All.svg`,
      });
      Deck.push({
        id: nanoid(),
        type: "Action",
        color,
        name: "Draw 2",
        image: `/Cards/${color} Draw 2.svg`,
      });
      Deck.push({
        id: nanoid(),
        type: "Action",
        color,
        name: "Draw 4",
        image: `/Cards/${color} Draw 4.svg`,
      });
      Deck.push({
        id: nanoid(),
        type: "Action",
        color,
        name: "Discard All",
        image: `/Cards/${color} Discard All.svg`,
      });
    }
  });

  // Wild Card
  for (let i = 0; i < 8; i++) {
    Deck.push({
      id: nanoid(),
      type: "Wild",
      name: "Color Roulette",
      image: `/Cards/Wild Color Roulette.svg`,
    });
    Deck.push({
      id: nanoid(),
      type: "Wild",
      name: "Reverse Draw 4",
      image: `/Cards/Wild Reverse Draw 4.svg`,
    });
  }

  for (let i = 0; i < 4; i++) {
    Deck.push({
      id: nanoid(),
      type: "Wild",
      name: "Draw 6",
      image: `/Cards/Wild Draw 6.svg`,
    });
    Deck.push({
      id: nanoid(),
      type: "Wild",
      name: "Draw 10",
      image: `/Cards/Wild Draw 10.svg`,
    });
  }

  return Deck;
};
