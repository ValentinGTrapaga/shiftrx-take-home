import { useSetSearchParams } from "@/hooks/use-filter-params";
import { FilterIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

export interface FilterItem {
  label: string;
  value: string;
  type: "date" | "text" | "select" | "range";
  min?: number;
  max?: number;
  options?: {
    label: string;
    value: string;
  }[];
}

export const FiltersSheet = ({
  items,
  defaultValues,
}: {
  items: FilterItem[];
  defaultValues: Record<string, string | undefined>;
}) => {
  const [values, setValues] = useState<Record<string, string | undefined>>(
    () => {
      return items.reduce((acc, item) => {
        acc[item.value] = defaultValues[item.value] ?? undefined;
        return acc;
      }, {} as Record<string, string | undefined>);
    },
  );
  const { addFilterParam, clearFilters: clearFiltersSearchParams } =
    useSetSearchParams();

  const handleChange = (value: string, key: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addFilterParam(
      Object.entries(values).map(([key, value]) => ({
        value,
        searchParamName: key,
      })),
    );
  };

  const clearFilters = () => {
    setValues(() => {
      return items.reduce((acc, item) => {
        acc[item.value] = "";
        return acc;
      }, {} as Record<string, string>);
    });
    clearFiltersSearchParams();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <FilterIcon className="w-4 h-4" />
          Filter
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-2xl flex flex-col gap-4 px-6 justify-between">
        <SheetHeader>
          <SheetTitle>Filter Applications</SheetTitle>
        </SheetHeader>
        <form
          className="flex flex-col flex-1 justify-between"
          onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 flex-1">
            {items.map((item) => (
              <div
                key={item.value}
                className="flex flex-col gap-2">
                <div className="grid grid-cols-3 justify-between items-center gap-2">
                  <Label>{item.label}</Label>
                  {item.type === "text" && (
                    <Input
                      className="col-span-2"
                      value={values[item.value]}
                      onChange={(e) => handleChange(e.target.value, item.value)}
                    />
                  )}
                  {item.type === "date" && (
                    <Input
                      type="date"
                      className="col-span-2"
                      value={values[item.value]}
                      onChange={(e) => handleChange(e.target.value, item.value)}
                    />
                  )}
                  {item.type === "range" && (
                    <div className="col-span-2 flex flex-row justify-between items-center gap-2">
                      <Input
                        type="range"
                        className="w-full bg-transparent border-none outline-none cursor-pointer "
                        value={values[item.value]}
                        min={item.min}
                        max={item.max}
                        onChange={(e) =>
                          handleChange(e.target.value, item.value)
                        }
                      />
                      <span>{values[item.value]}</span>
                    </div>
                  )}
                  {item.type === "select" && (
                    <Select
                      value={values[item.value]}
                      onValueChange={(value) =>
                        handleChange(value, item.value)
                      }>
                      <SelectTrigger className="col-span-2 w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent className="col-span-2">
                        {item.options?.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-end items-center gap-2 justify-self-end pb-4">
            <Button
              variant="outline"
              onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button type="submit">Apply Filters</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
