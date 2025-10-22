import { formatDate } from "@/lib/dates";
import { Calendar } from "lucide-react";

export const ShiftCardDate = ({
  startsAt,
  endsAt,
}: {
  startsAt: Date;
  endsAt: Date;
}) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      <Calendar className="w-8 text-primary" />
      <div className="flex flex-col flex-1">
        <p className="text-sm font-medium">{formatDate(startsAt)}</p>
        <p className="text-sm text-gray-500">{formatDate(endsAt)}</p>
      </div>
    </div>
  );
};
