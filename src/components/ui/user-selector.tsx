"use client";

import { Check, ChevronsUpDown, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/auth/useAuth";
import { trpc } from "@/server/trpc/react";

export function UserSelector() {
  const { user, changeUser } = useAuth();
  const usersData = trpc.users.getAllUsers.useQuery();

  if (usersData.isLoading || !usersData.data) {
    return (
      <div className="text-sm text-muted-foreground">Loading users...</div>
    );
  }

  const users = usersData.data;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[200px] justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {user ? user.name : "Seleccionar usuario"}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuLabel>Select User</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {users.map((u) => (
          <DropdownMenuItem
            key={u.id}
            onClick={() => changeUser(u.id)}
            className="flex items-center justify-between">
            <div className="flex flex-col">
              <span>{u.name}</span>
              <span className="text-xs text-muted-foreground">{u.email}</span>
            </div>
            {user?.id === u.id && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
