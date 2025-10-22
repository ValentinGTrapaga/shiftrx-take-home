"use client";

import { ApplicationStatusBadge } from "@/components/application-status-badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import { TextEllipsis } from "@/components/ui/text-ellipsis";
import { useTableConfig } from "@/hooks/use-table-config";
import { formatDate } from "@/lib/dates";
import { Application } from "@/server/models/common";
import type { ColumnDef } from "@tanstack/react-table";

export const useApplicationsTable = () => {
  const { handleSort, order, orderBy, page } = useTableConfig();

  const columns: ColumnDef<Application>[] = [
    {
      id: "shiftTitle",
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
        const application = row.original;
        const title = application.shift?.title ?? "-";
        return (
          <TextEllipsis
            text={title}
            length={75}
          />
        );
      },
    },
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
        const application = row.original;
        return <ApplicationStatusBadge status={application.status} />;
      },
    },
    {
      id: "shiftStartsAt",
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
        const application = row.original;

        if (!application.shift?.startsAt) {
          return "-";
        }

        return (
          <TextEllipsis
            text={formatDate(application.shift?.startsAt)}
            length={25}
          />
        );
      },
    },
  ];

  return { columns, order, orderBy, page };
};
