import { FilterItem } from "@/components/ui/filter";
import { ShiftStatus } from "@prisma/client";

export const shiftsFilterItems: FilterItem[] = [
  {
    label: "Status",
    value: "status",
    type: "select",
    options: [
      { label: "Open", value: ShiftStatus.OPEN },
      { label: "Hired", value: ShiftStatus.HIRED },
      { label: "Cancelled", value: ShiftStatus.CANCELLED },
    ],
  },
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
    label: "Hourly rate",
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
