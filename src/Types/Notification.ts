import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface NotificationBase extends CommonDataType {
  userId: string;
  title: string;
  message: string;
  eventType: string;
  meta: Record<string, unknown>;
  isRead: boolean;
}

export interface NotificationDataResponse extends PageStatus {
  notification_data: NotificationBase[];
  unreadCount: number;
}

export interface NotificationApiResponse extends MessageStatus {
  data: NotificationDataResponse;
}

export interface NotificationDropdownApiResponse extends MessageStatus {
  data: NotificationBase[];
}
