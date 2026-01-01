import { configDotenv } from "dotenv";
import { Server } from "socket.io";
import { handleCreateGame } from "./socket/handleCreateGame.ts";
import { handleJoinGame } from "./socket/handleJoinGame.ts";
import { handleUpdateGame } from "./socket/handleUpdateGame.ts";
import { handleStartGame } from "./socket/handleStartGame.ts";
import { handleGameChat } from "./socket/handleGameChat.ts";
import { handlePlayCard } from "./socket/handlePlayCard.ts";
import { handleGetCard } from "./socket/handleGetCard.ts";

configDotenv();
const PORT = Number(process.env.PORT);
const ORIGIN = process.env.CLIENT_URL;

const io = new Server(PORT, {
  cors: {
    origin: ORIGIN,
  },
});

io.on("connection", (socket) => {
  console.log(`User with socket Id ${socket.id} connected`);

  handleCreateGame(socket);
  handleJoinGame(socket);
  handleUpdateGame(socket, io);
  handleStartGame(socket, io);
  handleGameChat(socket, io);
  handlePlayCard(socket, io);
  handleGetCard(socket, io);
});

console.log("Socket.IO server listening on port ", PORT);
