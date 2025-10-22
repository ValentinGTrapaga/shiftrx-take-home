"use client";

import { Calendar, Heart, Home, Inbox } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserSelector } from "./user-selector";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Shifts",
    url: "/shifts",
    icon: Calendar,
  },
  {
    title: "My Shifts",
    url: "/my-shifts",
    icon: Heart,
  },
  {
    title: "Applications",
    url: "/applications",
    icon: Inbox,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="text-2xl font-bold text-center mb-4">
        <div className="flex items-center justify-center gap-2 text-blue-700">
          <Heart className="w-8 " />
          <span className="text-2xl font-black">ShiftRX</span>
        </div>
        <div className="mt-4">
          <UserSelector />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
