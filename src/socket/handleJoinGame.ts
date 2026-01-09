import type { Socket } from "socket.io";
import { games } from "../game.ts";
import { createPlayer } from "../lib/GameHelpers.ts";

export const handleJoinGame = (socket: Socket) => {
  socket.on(
    "joinGame",
    ({ username, roomId }: { username: string; roomId: string }) => {
      console.log(`${username} with ${socket.id} joined the room ${roomId}`);

      const game = games.get(roomId);
      if (!game) return console.log(`${roomId} not found in games`);

      const isHost = false;
      const playersLength = game.players.length;
      const player = createPlayer(playersLength, username, socket.id, isHost);

      socket.join(roomId);
      game.players.push(player);

      socket.emit("gameJoined", { roomId });
    }
  );
};
