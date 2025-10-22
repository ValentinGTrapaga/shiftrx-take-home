import { formatTime } from "@/lib/dates";
import { ClockIcon } from "lucide-react";

export const ShiftCardTime = ({
  startsAt,
  endsAt,
}: {
  startsAt: Date;
  endsAt: Date;
}) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      <ClockIcon className="w-8 text-primary" />
      <div className="flex flex-col flex-1">
        <p className="text-sm font-medium">{formatTime(startsAt)}</p>
        <p className="text-sm text-gray-500">{formatTime(endsAt)}</p>
      </div>
    </div>
  );
};
