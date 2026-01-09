import { customAlphabet, nanoid } from "nanoid";
import type { Socket } from "socket.io";
import { games } from "../game.ts";
import { createPlayer } from "../lib/GameHelpers.ts";

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

    const isHost = true;
    const player = createPlayer(0, username, socket.id, isHost);

    socket.join(roomId);
    games.set(roomId, {
      players: [player],
      gamePhase: "waiting",
      hostSocketId: socket.id,
      discardPile: [],
      deck: [],
      rotation: 1,
      drawCount: 0,
      playerTurn: player,
    });
    console.log(`${username} with ${socket.id} created a room with ${roomId}`);
    const game = games.get(roomId);

    if (!game) return console.log(`${roomId} not found somehow`);

    socket.emit("gameCreated", { roomId });
  });
};
