import { ShiftStatusBadge } from "@/components/shift-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TextEllipsis } from "@/components/ui/text-ellipsis";
import { formatCurrency } from "@/lib/currency";
import { useAuth } from "@/providers/auth/context";
import { Shift } from "@/server/models/common";
import { trpc } from "@/server/trpc/react";
import { ApplicationStatus, ShiftStatus } from "@prisma/client";
import { ShiftActionButtons } from "./shift-action-buttons";
import { ShiftCardDate } from "./shift-card-date";
import { ShiftCardLocation } from "./shift-card-location";
import { ShiftCardTime } from "./shift-card-time";

export function ShiftCard({ shift }: { shift: Shift }) {
  const { user } = useAuth();

  if (!user?.id) {
    return null;
  }

  const { data: applications } =
    trpc.applications.getAllWithPagination.useQuery({
      userId: user?.id,
    });

  const isUserHired = user?.id === shift.hiredProviderId;
  const isApplied =
    applications?.data?.find((application) => application.shiftId === shift.id)
      ?.status === ApplicationStatus.APPLIED || false;
  const isShiftHired = shift.status === ShiftStatus.HIRED || false;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          <div className="grid grid-cols-[1fr_auto] gap-2 items-center justify-between">
            <TextEllipsis
              text={shift.title}
              length={24}
            />
            {isUserHired ? (
              <ShiftStatusBadge status={shift.status} />
            ) : (
              <span className="text-sm font-medium text-white bg-primary/80 rounded-full px-2 py-1">
                {formatCurrency(shift.hourlyRateCents)}/hr
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <ShiftCardLocation
            location={shift.location ?? "-"}
            facilityName={shift.facilityName}
          />
          <ShiftCardDate
            startsAt={shift.startsAt}
            endsAt={shift.endsAt}
          />
          <ShiftCardTime
            startsAt={shift.startsAt}
            endsAt={shift.endsAt}
          />
        </div>

        <Separator />
        <div className="flex flex-row gap-2 items-center justify-end">
          {user?.id && (
            <ShiftActionButtons
              shiftId={shift.id}
              userId={user?.id}
              isUserHired={isUserHired}
              isShiftHired={isShiftHired}
              isApplied={isApplied}
              showDetailsButton={true}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
