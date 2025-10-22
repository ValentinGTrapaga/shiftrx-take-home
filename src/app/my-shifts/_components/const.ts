import { FilterItem } from "@/components/ui/filter";

export const myShiftsFilterItems: FilterItem[] = [
  {
    label: "Start date",
    value: "startsAt",
    type: "date",
  },
  {
    label: "Shift title",
    value: "title",
    type: "text",
  },
  {
    label: "Facility name",
    value: "facilityName",
    type: "text",
  },
  {
    label: "Min hourly rate",
    value: "hourlyRate",
    type: "range",
    min: 0,
    max: 100,
  },
  {
    label: "Location",
    value: "location",
    type: "text",
  },
];
