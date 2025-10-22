import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useShiftCard } from "@/hooks/use-shifts";
import { useAuth } from "@/providers/auth/context";
import { ApplicationStatus } from "@prisma/client";
import { EyeIcon } from "lucide-react";
import Link from "next/link";

export function ShiftActionButtons({
  shiftId,
  isUserHired,
  isShiftHired,
  isApplied,
  showDetailsButton = false,
}: {
  shiftId: string;
  userId: string;
  isUserHired: boolean;
  isShiftHired: boolean;
  isApplied: boolean;
  showDetailsButton?: boolean;
}) {
  const { user } = useAuth();

  const { handleCancel, handleApply, handleWithdraw, isCancellingApplication } =
    useShiftCard(shiftId, user?.id || "");

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {showDetailsButton && (
        <Button
          variant="link"
          asChild>
          <Link href={`/shifts/${shiftId}`}>
            <EyeIcon className="w-4 h-4" />
            Details
          </Link>
        </Button>
      )}
      {isUserHired ? (
        <>
          <Button
            variant="destructive"
            disabled={isCancellingApplication}
            onClick={handleCancel}
            className="min-w-[140px]">
            {isCancellingApplication ? (
              <span className="flex flex-row gap-2 items-center">
                <Spinner className="w-4 h-4" />
                Cancelling...
              </span>
            ) : (
              "Cancel Shift"
            )}
          </Button>
          <Button
            variant="outline"
            disabled>
            Hired
          </Button>
        </>
      ) : isShiftHired ? (
        <Button
          variant="outline"
          disabled>
          Shift taken
        </Button>
      ) : (
        <Button
          variant={isApplied ? "outline" : "default"}
          onClick={
            isApplied
              ? handleWithdraw
              : () => handleApply(ApplicationStatus.APPLIED)
          }
          className="min-w-[120px]">
          {isApplied ? "Withdraw application" : "Apply"}
        </Button>
      )}
    </div>
  );
}
