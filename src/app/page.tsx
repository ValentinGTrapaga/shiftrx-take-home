"use client";

import { useAuth } from "@/providers/auth/context";
import { trpc } from "@/server/trpc/react";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { ShiftCard } from "./_components/shift-card";
import { ShiftStatus } from "@prisma/client";
import { ShiftCardSkeleton } from "./_components/shift-card-skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const { user } = useAuth();
  const { isDesktop } = useIsMobile();
  const limit = isDesktop ? 3 : 2;

  const { data: upcomingShifts, isLoading: isLoadingUpcomingShifts } =
    trpc.shifts.getAllWithPagination.useQuery({
      page: 1,
      limit,
      sort: "asc",
      sortBy: "createdAt",
      userId: user?.id,
      status: ShiftStatus.HIRED,
    });

  const { data: availableShifts, isLoading: isLoadingAvailableShifts } =
    trpc.shifts.getAllWithPagination.useQuery({
      page: 1,
      limit,
      sort: "asc",
      sortBy: "createdAt",
      status: ShiftStatus.OPEN,
    });

  return (
    <main className="flex flex-col row-start-2 items-start w-full p-4 gap-8 overflow-auto">
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <div className="flex flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Upcoming Shifts</h1>
          <Link
            href="/my-shifts"
            className="text-blue-500 hover:text-blue-700 flex flex-row items-center gap-2 font-medium">
            View All
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
          {isLoadingUpcomingShifts
            ? Array.from({ length: limit }).map((_, index) => (
                <ShiftCardSkeleton key={index} />
              ))
            : upcomingShifts?.data.map((shift) => (
                <ShiftCard
                  key={shift.id}
                  shift={shift}
                />
              ))}
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Available Shifts</h1>
          <Link
            href="/shifts"
            className="text-blue-500 hover:text-blue-700 flex flex-row items-center gap-2 font-medium">
            View All
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoadingAvailableShifts
            ? Array.from({ length: limit }).map((_, index) => (
                <ShiftCardSkeleton key={index} />
              ))
            : availableShifts?.data.map((shift) => (
                <ShiftCard
                  key={shift.id}
                  shift={shift}
                />
              ))}
        </div>
      </div>
    </main>
  );
}
