import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "@prisma/client";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

export function ApplicationStatusBadge({
  status,
}: ApplicationStatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case ApplicationStatus.APPLIED:
        return "success";
      case ApplicationStatus.HIRED:
        return "info";
      case ApplicationStatus.WITHDRAWN:
        return "warning";
      case ApplicationStatus.REJECTED:
        return "destructive";
      default:
        return "warning";
    }
  };

  const getText = () => {
    switch (status) {
      case ApplicationStatus.APPLIED:
        return "Applied";
      case ApplicationStatus.HIRED:
        return "Hired";
      case ApplicationStatus.WITHDRAWN:
        return "Withdrawn";
      case ApplicationStatus.REJECTED:
        return "Rejected";
      default:
        return "Cancelled";
    }
  };

  return <Badge variant={getVariant()}>{getText()}</Badge>;
}
