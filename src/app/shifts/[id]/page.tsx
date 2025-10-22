"use client";

import { ShiftActionButtons } from "@/app/_components/shift-action-buttons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShiftStatusBadge } from "@/components/shift-status-badge";
import { formatCurrency } from "@/lib/currency";
import { formatDate, formatTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth/context";
import { trpc } from "@/server/trpc/react";
import { ApplicationStatus, ShiftStatus } from "@prisma/client";
import { ArrowLeftIcon, Calendar, ClockIcon, MapPin, User } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ShiftPageSkeleton } from "./_components/shift-page-skeleton";

export default function ShiftDetailPage() {
  const params = useParams();
  const shiftId = params.id as string;
  const { user } = useAuth();
  const router = useRouter();

  const { data: shift, isLoading: isLoadingShift } =
    trpc.shifts.getById.useQuery({ id: shiftId }, { enabled: !!shiftId });

  if (isLoadingShift) {
    return <ShiftPageSkeleton />;
  }

  if (!shift) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Shift not found</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to home
          </Button>
        </div>
      </main>
    );
  }

  const isUserHired = user?.id === shift.hiredProviderId;
  const isApplied =
    shift.applications?.find((application) => application.userId === user?.id)
      ?.status === ApplicationStatus.APPLIED;
  const isShiftHired =
    shift.status === ShiftStatus.HIRED || shift.hiredProviderId !== null;

  return (
    <main className="flex flex-col w-full p-4 gap-6 overflow-auto">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button
            variant="outline"
            size="sm">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Shift Details</h1>
      </div>
      <div>
        <div className="p-6 border-b border-gray-200">
          <div className="text-2xl font-bold flex flex-col gap-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <span>{shift.title}</span>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <p
                  className={cn(
                    "text-lg font-medium",
                    isUserHired
                      ? "text-green-600"
                      : isShiftHired
                      ? "text-red-600"
                      : "text-primary",
                  )}>
                  {isUserHired
                    ? "Confirmed"
                    : isShiftHired
                    ? "Taken"
                    : `${formatCurrency(shift.hourlyRateCents)}/hr`}
                </p>
                {isShiftHired && !isUserHired && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Taken</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {shift.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {shift.description}
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-row gap-3 items-start">
              <MapPin className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div className="flex flex-col flex-1">
                <p className="text-sm font-medium text-gray-900">Facility</p>
                <p className="text-base font-semibold">{shift.facilityName}</p>
                {shift.location && (
                  <p className="text-sm text-gray-600">{shift.location}</p>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-row gap-3 items-start">
              <Calendar className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div className="flex flex-col flex-1">
                <p className="text-sm font-medium text-gray-900">Date</p>
                <p className="text-base font-semibold">
                  {formatDate(shift.startsAt)}
                </p>
                <p className="text-sm text-gray-600">
                  until {formatDate(shift.endsAt)}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-3 items-start">
              <ClockIcon className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div className="flex flex-col flex-1">
                <p className="text-sm font-medium text-gray-900">Time</p>
                <p className="text-base font-semibold">
                  {formatTime(shift.startsAt)}
                </p>
                <p className="text-sm text-gray-600">
                  until {formatTime(shift.endsAt)}
                </p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-900">
                  Shift Status
                </p>
                <ShiftStatusBadge status={shift.status} />
              </div>
              {user?.id && (
                <ShiftActionButtons
                  shiftId={shift.id}
                  userId={user?.id}
                  isUserHired={isUserHired}
                  isShiftHired={isShiftHired}
                  isApplied={isApplied}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
