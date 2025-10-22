import { User } from "@/server/models/users";

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  changeUser: (userId: string) => void;
  isLoading: boolean;
};
