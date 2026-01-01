import type { Socket } from "socket.io";
import { games } from "../game.ts";
import type { Player } from "../types/game.types.ts";

export const handleJoinGame = (socket: Socket) => {
  socket.on(
    "joinGame",
    ({ username, roomId }: { username: string; roomId: string }) => {
      console.log(`${username} with ${socket.id} joined the room ${roomId}`);

      const game = games.get(roomId);
      if (!game) return console.log(`${roomId} not found in games`);

      const player: Player = {
        username,
        host: false,
        hand: [],
      };

      socket.join(roomId);
      game.players.push(player);

      socket.emit("gameJoined", { roomId });
    }
  );
};
