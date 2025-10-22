import { Badge } from "@/components/ui/badge";
import { ShiftStatus } from "@prisma/client";

interface ShiftStatusBadgeProps {
  status: ShiftStatus;
}

export function ShiftStatusBadge({ status }: ShiftStatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case ShiftStatus.OPEN:
        return "success";
      case ShiftStatus.HIRED:
        return "info";
      default:
        return "warning";
    }
  };

  const getText = () => {
    switch (status) {
      case ShiftStatus.OPEN:
        return "Open";
      case ShiftStatus.HIRED:
        return "Hired";
      default:
        return "Cancelled";
    }
  };

  return <Badge variant={getVariant()}>{getText()}</Badge>;
}
