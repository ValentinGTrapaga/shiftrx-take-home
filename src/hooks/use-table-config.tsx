import type { PaginationState } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { useDebounceSearch } from "./use-debounce-search";

export const useTableConfig = ({
  defaultOrderBy = "createdAt",
}: {
  defaultOrderBy?: string;
} = {}) => {
  const [page, setPage] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const { search, setSearch, searchQuery } = useDebounceSearch();

  const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);
  const [order, setOrder] = useState<string>("desc");

  const handleSort = useCallback(
    (id: string) => {
      if (orderBy === id) {
        setOrder(order === "asc" ? "desc" : "asc");
      } else {
        setOrderBy(id);
        setOrder("asc");
      }
    },
    [orderBy, order, setOrderBy, setOrder],
  );

  return {
    page: {
      value: page,
      setValue: setPage,
    },
    search: {
      value: search,
      setValue: setSearch,
      query: searchQuery,
    },
    order: {
      value: order,
      setValue: setOrder,
    },
    orderBy: {
      value: orderBy,
      setValue: setOrderBy,
    },
    handleSort,
  };
};
