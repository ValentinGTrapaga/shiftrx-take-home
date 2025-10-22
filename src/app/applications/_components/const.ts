import { FilterItem } from "@/components/ui/filter";
import { ApplicationStatus } from "@prisma/client";

export const applicationsFilterItems: FilterItem[] = [
  {
    label: "Status",
    value: "status",
    type: "select",
    options: [
      { label: "Applied", value: ApplicationStatus.APPLIED },
      { label: "Hired", value: ApplicationStatus.HIRED },
      { label: "Withdrawn", value: ApplicationStatus.WITHDRAWN },
      { label: "Rejected", value: ApplicationStatus.REJECTED },
    ],
  },
  {
    label: "Title",
    value: "title",
    type: "text",
  },
  {
    label: "Start date",
    value: "startsAt",
    type: "date",
  },
];
