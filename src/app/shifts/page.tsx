"use client";

import { trpc } from "@/server/trpc/react";
import { useShiftsTable } from "@/components/shifts/use-shifts-table";
import { useAuth } from "@/providers/auth/context";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ShiftStatus } from "@prisma/client";
import { shiftsFilterItems } from "./_components/const";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FiltersSheet } from "@/components/ui/filter";

export default function ShiftsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const defaultValues = useMemo(
    () =>
      shiftsFilterItems.reduce((acc, item) => {
        acc[item.value] = searchParams.get(item.value) ?? undefined;
        return acc;
      }, {} as Record<string, string | undefined>),
    [searchParams],
  );
  if (!user?.id) {
    return <div>You are not authorized to access this page</div>;
  }

  const { columns, order, orderBy, page } = useShiftsTable();

  const { data: shifts, isLoading: isLoadingShifts } =
    trpc.shifts.getAllWithPagination.useQuery({
      page: page.value.pageIndex + 1,
      limit: page.value.pageSize,
      sort: order.value as "asc" | "desc",
      sortBy: orderBy.value,
      status: defaultValues.status as ShiftStatus | undefined,
      title: defaultValues.title,
      startsAt: defaultValues.startsAt,
      facilityName: defaultValues.facilityName,
      hourlyRate: defaultValues.hourlyRate
        ? Number(defaultValues.hourlyRate)
        : undefined,
      location: defaultValues.location,
    });

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Shifts</h1>
        <FiltersSheet
          items={shiftsFilterItems}
          defaultValues={defaultValues}
        />
      </div>
      <DataTable
        columns={columns}
        data={shifts?.data ?? []}
        pagination={page.value}
        setPagination={page.setValue}
        isLoading={isLoadingShifts}
      />
    </div>
  );
}
