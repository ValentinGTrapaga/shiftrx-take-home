import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  orderBy?: string;
  order?: string;
  handleSort?: (orderBy: string) => void;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  orderBy,
  order,
  handleSort,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!handleSort) {
    return (
      <div className={cn("space-x-2", className)}>
        <Button
          variant="link"
          size="sm"
          className="h-8 text-foreground flex gap-1 cursor-default ml-0 pl-0">
          <span>{title}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-x-2", className)}>
      <Button
        variant="link"
        size="sm"
        className="h-8 text-foreground flex gap-1 ml-0 pl-0"
        onClick={() => handleSort(column.id)}>
        <span>{title}</span>
        {orderBy === column.id && order === "desc" ? (
          <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
        ) : orderBy === column.id && order === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
        ) : (
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/70" />
        )}
      </Button>
    </div>
  );
}
