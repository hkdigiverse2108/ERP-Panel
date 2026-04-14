import { io, Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "../Constants";
import { ShowNotification } from "../Attribute";

let socket: Socket | null = null;

export const initSocket = (user: any) => {
  if (socket) return socket; // Prevent multiple connections

  socket = io(import.meta.env.VITE_API_BASE_URL);
  const branchId = user?.branchId?._id;
  //   console.log(user, branchId);
  socket.on("connect", () => {
    socket?.emit("joinRoom", { roomId: branchId });
    socket?.emit("joinAll");
    // console.log("Socket connected");
  });

  // Central Notification Listener
  const handleNotification = (payload: any) => {
    ShowNotification(payload.title, "info");
    console.log("Notification received", payload, payload.title);
  };

  // Register all events from Constants
  Object.values(SOCKET_EVENTS).forEach((event) => {
    socket?.on(event, handleNotification);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
