import { Notification, MOCK_NOTIFICATIONS } from "../mocks/notifications";

export async function getNotifications(): Promise<Notification[]> {
  await new Promise((r) => setTimeout(r, 250));
  return MOCK_NOTIFICATIONS;
}

export async function markAllAsRead(): Promise<void> {
  await new Promise((r) => setTimeout(r, 100));
  MOCK_NOTIFICATIONS.forEach((n) => (n.read = true));
}
