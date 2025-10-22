"use client";

import { User } from "@/server/models/users";
import { trpc } from "@/server/trpc/react";
import { useEffect, useState } from "react";
import AuthContext from "./context";
import { constants } from "buffer";

const USER_LOCAL_STORAGE_KEY = "user";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const usersData = trpc.users.getAllUsers.useQuery();

  useEffect(() => {
    setIsLoading(true);
    const grabUserFromLocalStorage = () => {
      const user = localStorage.getItem(USER_LOCAL_STORAGE_KEY);
      if (user) {
        setUser(JSON.parse(user));
      } else if (!user) {
        const user = usersData.data?.[0];
        if (user) {
          setUser(user);
          localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
        } else {
          setUser(null);
          localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
        }
      }
    };
    if (usersData.isLoading) {
      grabUserFromLocalStorage();
    }
    setIsLoading(false);
  }, [usersData.data]);

  const changeUser = (id: string) => {
    const user = usersData.data?.find((user) => user.id === id);
    if (user) {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        changeUser,
        isLoading: isLoading || usersData.isFetching,
      }}>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          Loading user...
        </div>
      ) : (
        <>{children}</>
      )}
    </AuthContext.Provider>
  );
}
