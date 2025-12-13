import { api } from "@/libs/api.js";
import type { User } from "./useGetUser.js";


export const toggleUserStatus = async (userId: number, isActive: boolean): Promise<User> => {
  const { data } = await api.patch<User>(`/users/${userId}/status?is_active=${isActive}`);
  return data;
};