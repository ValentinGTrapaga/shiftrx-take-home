"use client";

import { useEffect, useState } from "react";

export const useDebounceSearch = (timeoutValue?: number) => {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const timeoutNumber = timeoutValue ?? 350;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(search);
    }, timeoutNumber);
    return () => clearTimeout(timeout);
  }, [search, timeoutNumber]);

  return { search, setSearch, searchQuery };
};
