import { MapPin } from "lucide-react";

export const ShiftCardLocation = ({
  location,
  facilityName,
}: {
  location: string;
  facilityName: string;
}) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      <MapPin className="w-8 text-primary" />
      <div className="flex flex-col flex-1">
        <p className="text-sm font-medium">{facilityName}</p>
        <p className="text-sm text-gray-500">{location}</p>
      </div>
    </div>
  );
};
