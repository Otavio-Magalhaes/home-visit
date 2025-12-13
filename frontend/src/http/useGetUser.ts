import { api } from "@/libs/api.js";

export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  role: {
    name: string;
  };
}
export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>('/users/');
  return data;
};