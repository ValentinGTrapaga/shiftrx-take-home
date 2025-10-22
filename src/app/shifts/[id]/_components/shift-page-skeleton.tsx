import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon, Calendar, ClockIcon, MapPin, User } from "lucide-react";

export function ShiftPageSkeleton() {
  return (
    <main className="flex flex-col w-full p-4 gap-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-8 w-48" />
      </div>

      <div>
        {/* Title and hourly rate section */}
        <div className="p-6 border-b border-gray-200">
          <div className="text-2xl font-bold flex flex-col gap-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <Skeleton className="h-8 w-64" />
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Facility and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-row gap-3 items-start">
              <MapPin className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div className="flex flex-col flex-1">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-48 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-row gap-3 items-start">
              <Calendar className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div className="flex flex-col flex-1">
                <Skeleton className="h-4 w-12 mb-1" />
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>

            <div className="flex flex-row gap-3 items-start">
              <ClockIcon className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div className="flex flex-col flex-1">
                <Skeleton className="h-4 w-8 mb-1" />
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
