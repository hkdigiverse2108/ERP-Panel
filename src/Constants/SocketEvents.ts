export const SOCKET_EVENTS = {
  NOTIFICATION_NEW: "notification:new",
  STOCK_TRANSFER: "stock:transfer",
  STOCK_EXPIRED: "stock:expired",
} as const;

export type SocketEventKey = keyof typeof SOCKET_EVENTS;
export type SocketEventValue = (typeof SOCKET_EVENTS)[SocketEventKey];
