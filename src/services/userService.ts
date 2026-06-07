import { UserProfile, MOCK_USER } from "../mocks/user";

export async function getUserProfile(): Promise<UserProfile> {
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_USER;
}

export async function markAllNotificationsRead(): Promise<void> {
  await new Promise((r) => setTimeout(r, 100));
}
