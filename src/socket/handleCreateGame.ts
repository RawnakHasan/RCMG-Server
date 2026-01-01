import { customAlphabet, nanoid } from "nanoid";
import type { Socket } from "socket.io";
import { games } from "../game.ts";
import type { Player } from "../types/game.types.ts";

export const generateRoomId = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789",
  6
);

export const handleCreateGame = (socket: Socket) => {
  socket.on("createGame", ({ username }: { username: string }) => {
    let roomId: string;
    do {
      roomId = generateRoomId();
    } while (games.has(roomId));

    const player: Player = {
      username,
      host: true,
      hand: [],
    };

    socket.join(roomId);
    games.set(roomId, {
      players: [player],
      gamePhase: "waiting",
      hostUsername: username,
      discardPile: [],
      deck: [],
      rotation: 1,
    });
    console.log(`${username} with ${socket.id} created a room with ${roomId}`);
    const game = games.get(roomId);

    if (!game) return console.log(`${roomId} not found somehow`);

    socket.emit("gameCreated", { roomId });
  });
};
