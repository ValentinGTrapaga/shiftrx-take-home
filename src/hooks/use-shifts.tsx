import { trpc } from "@/server/trpc/react";
import { toast } from "sonner";
import { TRPCError } from "@trpc/server";
import { Application, ApplicationStatus } from "@prisma/client";

export const useShiftCard = (shiftId: string, userId: string) => {
  const utils = trpc.useUtils();
  const { mutateAsync: createApplication, isPending: isCreatingApplication } =
    trpc.applications.create.useMutation({
      onSettled: () => {
        utils.applications.getAllWithPagination.invalidate();
        utils.shifts.getAllWithPagination.invalidate();
        utils.shifts.getById.invalidate({ id: shiftId });
      },
      onSuccess: () => {
        toast.success("Applied to shift");
      },
      onError: (error, variables, context) => {
        toast.error("Failed to apply to shift: " + error.message);
        if (context?.previousApplications) {
          utils.applications.getAllWithPagination.setData(
            { userId },
            context.previousApplications,
          );
        }
      },
      onMutate: () => {
        utils.applications.getAllWithPagination.cancel();
        const shift = utils.shifts.getById.getData({ id: shiftId });
        const previousApplications =
          utils.applications.getAllWithPagination.getData({ userId });

        if (!shift) {
          return;
        }

        const newApplication = {
          id: `new-application-${Date.now()}`,
          shiftId,
          userId,
          status: ApplicationStatus.APPLIED,
          createdAt: new Date(),
          shift,
        };

        utils.applications.getAllWithPagination.setData(
          { userId },
          (oldData) => {
            return {
              data: [newApplication, ...(oldData?.data ?? [])],
              totalItems: (oldData?.totalItems ?? 0) + 1,
              currentPage: oldData?.currentPage ?? 1,
              nextPage: oldData?.nextPage ?? 1,
              previousPage: oldData?.previousPage ?? 1,
              totalPages: oldData?.totalPages ?? 1,
            };
          },
        );

        return { previousApplications };
      },
    });

  const {
    mutateAsync: withdrawApplication,
    isPending: isWithdrawingApplication,
  } = trpc.applications.withdraw.useMutation({
    onSettled: () => {
      utils.applications.getAllWithPagination.invalidate();
      utils.shifts.getAllWithPagination.invalidate();
      utils.shifts.getById.invalidate({ id: shiftId });
    },
    onSuccess: () => {
      toast.success("Withdrawn from shift");
    },
    onError: (error, variables, context) => {
      toast.error("Failed to withdraw from shift: " + error.message);
      if (context?.previousApplications) {
        utils.applications.getAllWithPagination.setData(
          { userId },
          context.previousApplications,
        );
      }
    },
    onMutate: () => {
      utils.applications.getAllWithPagination.cancel();
      utils.shifts.getAllWithPagination.invalidate();
      utils.shifts.getById.invalidate({ id: shiftId });
      const previousApplications =
        utils.applications.getAllWithPagination.getData({ userId });

      if (!previousApplications) {
        return;
      }

      utils.applications.getAllWithPagination.setData({ userId }, (oldData) => {
        if (!oldData) {
          return;
        }

        return {
          ...oldData,
          data: oldData?.data.map((application) => {
            if (application.shiftId === shiftId) {
              return { ...application, status: ApplicationStatus.WITHDRAWN };
            }
            return application;
          }),
        };
      });
      return { previousApplications };
    },
  });

  const { mutateAsync: cancelApplication, isPending: isCancellingApplication } =
    trpc.applications.cancel.useMutation({
      onSettled: () => {
        utils.applications.getAllWithPagination.invalidate();
        utils.shifts.getAllWithPagination.invalidate();
        utils.shifts.getById.invalidate({ id: shiftId });
      },
      onSuccess: () => {
        toast.success("Shift cancelled");
      },
      onError: (error) => {
        toast.error("Failed to cancel shift: " + error.message);
      },
    });

  const handleCancel = async () => {
    try {
      if (!userId) {
        return;
      }
      await cancelApplication({ shiftId, userId });
    } catch (error) {
      if (error instanceof TRPCError) {
        toast.error(error.message);
        return;
      }
      return;
    }
  };

  const handleApply = async (status: ApplicationStatus) => {
    try {
      if (!userId) {
        return;
      }

      await createApplication({
        shiftId,
        userId,
        status,
      });
    } catch (error) {
      if (error instanceof TRPCError) {
        toast.error(error.message);
        return;
      }
      return;
    }
  };

  const handleWithdraw = async () => {
    try {
      if (!userId) {
        return;
      }
      await withdrawApplication({ shiftId, userId });
    } catch (error) {
      if (error instanceof TRPCError) {
        toast.error(error.message);
        return;
      }
      return;
    }
  };

  return {
    handleCancel,
    handleApply,
    handleWithdraw,
    isCancellingApplication,
    isCreatingApplication,
    isWithdrawingApplication,
  };
};
