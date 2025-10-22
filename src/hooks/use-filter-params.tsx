import { useRouter, useSearchParams } from "next/navigation";

export const useSetSearchParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryString = ({
    value,
    searchParamName,
  }: {
    value: string;
    searchParamName: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(searchParamName, value);

    return params.toString();
  };

  const pushSearchParam = (searchParam: string) =>
    router.push(`?${searchParam}`);

  const isChecked = (paramName: string, value: string) => {
    const param = searchParams.get(paramName);
    return param === value;
  };

  const clearFilters = () => {
    const searchParamsArray = Array.from(searchParams.entries());
    const newSearchParams = searchParamsArray.filter(([key]) => key === "page");
    const newUrl = new URLSearchParams(newSearchParams);
    pushSearchParam(newUrl.toString());
  };

  const setFilterParams = (
    value: string | null | undefined,
    searchParamName: string,
  ) => {
    const searchParamsArray = Array.from(searchParams.entries());

    const newValue = value?.trim() === "" ? null : value;

    if (!newValue) {
      const newSearchParams = searchParamsArray.filter(
        ([key]) => key !== searchParamName,
      );
      const newUrl = new URLSearchParams(newSearchParams);
      pushSearchParam(newUrl.toString());
      return;
    }
    const searchParam = queryString({ value: newValue, searchParamName });
    pushSearchParam(searchParam);
  };

  const addFilterParam = (
    filters:
      | {
          value: string | null | undefined;
          searchParamName: string;
        }
      | {
          value: string | null | undefined;
          searchParamName: string;
        }[],
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    const filtersArray = Array.isArray(filters) ? filters : [filters];

    filtersArray.forEach((filter) => {
      if (
        filter.value === null ||
        filter.value === undefined ||
        filter.value === ""
      ) {
        params.delete(filter.searchParamName);
      } else {
        params.set(filter.searchParamName, filter.value);
      }
    });

    pushSearchParam(params.toString());
  };

  return {
    queryString,
    pushSearchParam,
    isChecked,
    clearFilters,
    setFilterParams,
    addFilterParam,
  };
};
