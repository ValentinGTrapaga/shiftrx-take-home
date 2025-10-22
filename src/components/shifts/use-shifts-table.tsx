"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import { TextEllipsis } from "@/components/ui/text-ellipsis";
import { useTableConfig } from "@/hooks/use-table-config";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/dates";
import { Shift } from "@/server/models/common";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";
import { ShiftStatusBadge } from "../shift-status-badge";

export const useShiftsTable = () => {
  const { handleSort, order, orderBy, page } = useTableConfig();

  const columns: ColumnDef<Shift>[] = [
    {
      id: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
          handleSort={handleSort}
          order={order.value}
          orderBy={orderBy.value}
        />
      ),
      cell: ({ row }) => {
        const shift = row.original;
        return <ShiftStatusBadge status={shift.status} />;
      },
    },
    {
      id: "title",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Shift"
          handleSort={handleSort}
          order={order.value}
          orderBy={orderBy.value}
        />
      ),
      cell: ({ row }) => {
        const shift = row.original;
        const title = shift.title ?? "-";
        return (
          <TextEllipsis
            text={title}
            length={75}
          />
        );
      },
    },
    {
      id: "facilityName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Facility Name"
          handleSort={handleSort}
          order={order.value}
          orderBy={orderBy.value}
        />
      ),
      cell: ({ row }) => {
        const shift = row.original;

        if (!shift.facilityName) {
          return "-";
        }

        return (
          <TextEllipsis
            text={shift.facilityName}
            length={25}
          />
        );
      },
    },
    {
      id: "hourlyRateCents",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Hourly Rate"
          handleSort={handleSort}
          order={order.value}
          orderBy={orderBy.value}
        />
      ),
      cell: ({ row }) => {
        const shift = row.original;
        return (
          <span className="text-sm font-medium">
            {formatCurrency(shift.hourlyRateCents)}
          </span>
        );
      },
    },
    {
      id: "location",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Location"
          handleSort={handleSort}
          order={order.value}
          orderBy={orderBy.value}
        />
      ),
      cell: ({ row }) => {
        const shift = row.original;
        return (
          <TextEllipsis
            text={shift.location ?? "-"}
            length={25}
          />
        );
      },
    },
    {
      id: "startsAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Starts At"
          handleSort={handleSort}
          order={order.value}
          orderBy={orderBy.value}
        />
      ),
      cell: ({ row }) => {
        const shift = row.original;
        return (
          <TextEllipsis
            text={formatDate(shift.startsAt)}
            length={25}
          />
        );
      },
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Actions"
        />
      ),
      cell: ({ row }) => {
        const shift = row.original;
        return (
          <div className="flex flex-row gap-2 items-center justify-center">
            <Link
              href={`/shifts/${shift.id}`}
              className="hover:text-primary/80">
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        );
      },
    },
  ];

  return { columns, order, orderBy, page };
};
