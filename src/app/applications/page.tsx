"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import { FiltersSheet } from "@/components/ui/filter";
import { useAuth } from "@/providers/auth/context";
import { trpc } from "@/server/trpc/react";
import { applicationsFilterItems } from "./_components/const";
import { useApplicationsTable } from "./_components/use-applications-table";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ApplicationStatus } from "@prisma/client";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const defaultValues = useMemo(
    () =>
      applicationsFilterItems.reduce((acc, item) => {
        acc[item.value] = searchParams.get(item.value) ?? undefined;
        return acc;
      }, {} as Record<string, string | undefined>),
    [searchParams],
  );

  if (!user?.id) {
    return <div>You are not authorized to access this page</div>;
  }

  const { columns, order, orderBy, page } = useApplicationsTable();

  const { data: applications, isLoading: isLoadingApplications } =
    trpc.applications.getAllWithPagination.useQuery({
      page: page.value.pageIndex + 1,
      limit: page.value.pageSize,
      sort: order.value as "asc" | "desc",
      sortBy: orderBy.value,
      userId: user?.id,
      status: defaultValues.status as ApplicationStatus | undefined,
      title: defaultValues.title,
      startsAt: defaultValues.startsAt,
    });

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Applications</h1>
        <FiltersSheet
          items={applicationsFilterItems}
          defaultValues={defaultValues}
        />
      </div>
      <DataTable
        columns={columns}
        data={applications?.data ?? []}
        pagination={page.value}
        setPagination={page.setValue}
        isLoading={isLoadingApplications}
      />
    </div>
  );
}
