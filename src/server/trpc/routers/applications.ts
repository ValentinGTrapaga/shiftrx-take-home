import {
  createApplicationRepository,
  getAllApplicationsByUserIdRepository,
  getApplicationByIdRepository,
  getApplicationByShiftIdAndUserIdRepository,
  getTotalApplicationsByUserIdRepository,
  toggleApplicationStatusRepository,
  toggleManyApplicationStatusesRepository,
} from "@/lib/prisma/repositories/applications";
import {
  getShiftByIdRepository,
  updateShiftRepository,
} from "@/lib/prisma/repositories/shifts";
import {
  ApplicationSchema,
  ApplicationStatusSchema,
  NewApplicationSchema,
} from "@/server/models/applications";
import { CommonQueryOptionsSchema } from "@/server/models/common";
import { ApplicationStatus, ShiftStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const applicationsRouter = router({
  getAllWithPagination: publicProcedure
    .input(
      CommonQueryOptionsSchema.extend({
        userId: z.string(),
        status: ApplicationStatusSchema.optional(),
        title: z.string().optional(),
        startsAt: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { page, limit, sort, sortBy, status, title, startsAt } = input;
        const [applications, totalItems] = await Promise.all([
          getAllApplicationsByUserIdRepository({
            userId: input.userId,
            page,
            limit,
            sort,
            sortBy,
            status,
            title,
            startsAt,
          }),
          getTotalApplicationsByUserIdRepository(input.userId),
        ]);

        const currentPage = page || 1;
        const totalPages = Math.ceil(totalItems / (limit ?? 10));
        const nextPage = currentPage < totalPages ? currentPage + 1 : null;
        const previousPage = currentPage > 1 ? currentPage - 1 : null;

        return {
          data: applications,
          totalItems,
          currentPage,
          nextPage,
          previousPage,
          totalPages,
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get applications",
        });
      }
    }),
  getById: publicProcedure
    .input(ApplicationSchema.pick({ id: true }))
    .query(async ({ input }) => {
      try {
        const application = await getApplicationByIdRepository(input.id);
        if (!application) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Application not found",
          });
        }
        return application;
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get application",
        });
      }
    }),
  create: publicProcedure
    .input(NewApplicationSchema)
    .mutation(async ({ input }) => {
      try {
        const { shiftId, userId } = input;
        const shift = await getShiftByIdRepository(shiftId);

        if (!shift) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Shift not found",
          });
        }

        if (
          shift.status === ShiftStatus.HIRED ||
          shift.hiredProviderId !== null
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Shift is already taken",
          });
        }

        if (shift.status === ShiftStatus.CANCELLED) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Shift is cancelled",
          });
        }

        const application = await getApplicationByShiftIdAndUserIdRepository(
          shiftId,
          userId,
        );

        if (application && application.status === ApplicationStatus.APPLIED) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Application already exists",
          });
        }

        if (application && application.status === ApplicationStatus.REJECTED) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Application already rejected",
          });
        }

        if (application && application.status === ApplicationStatus.WITHDRAWN) {
          await toggleApplicationStatusRepository(
            shiftId,
            userId,
            ApplicationStatus.APPLIED,
          );
          return application;
        }

        const createdApplication = await createApplicationRepository({
          shiftId,
          userId,
          status: ApplicationStatus.APPLIED,
        });

        return createdApplication;
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create application",
        });
      }
    }),
  toggleStatus: publicProcedure
    .input(
      ApplicationSchema.pick({ shiftId: true, userId: true, status: true }),
    )
    .mutation(async ({ input }) => {
      try {
        const { shiftId, userId, status } = input;
        const application = await getApplicationByShiftIdAndUserIdRepository(
          shiftId,
          userId,
        );

        if (!application) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Application not found",
          });
        }
        if (application.status === status) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Application already has this status",
          });
        }

        if (status === ApplicationStatus.HIRED) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Shift is already taken",
          });
        }
        return await toggleApplicationStatusRepository(shiftId, userId, status);
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to toggle application status",
        });
      }
    }),
  withdraw: publicProcedure
    .input(ApplicationSchema.pick({ shiftId: true, userId: true }))
    .mutation(async ({ input }) => {
      try {
        const { shiftId, userId } = input;
        const application = await getApplicationByShiftIdAndUserIdRepository(
          shiftId,
          userId,
        );
        if (!application) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Application not found",
          });
        }
        return await toggleApplicationStatusRepository(
          shiftId,
          userId,
          ApplicationStatus.WITHDRAWN,
        );
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to withdraw application",
        });
      }
    }),
  cancel: publicProcedure
    .input(ApplicationSchema.pick({ shiftId: true, userId: true }))
    .mutation(async ({ input }) => {
      try {
        const { shiftId, userId } = input;
        const shift = await getShiftByIdRepository(shiftId);

        if (!shift) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Shift not found",
          });
        }
        const application = await getApplicationByShiftIdAndUserIdRepository(
          shiftId,
          userId,
        );

        if (!application) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Application not found",
          });
        }
        await Promise.all([
          toggleApplicationStatusRepository(
            shiftId,
            userId,
            ApplicationStatus.REJECTED,
          ),
          updateShiftRepository(shiftId, {
            status: ShiftStatus.OPEN,
            hiredProviderId: null,
          }),
        ]);
        const userNotHiredIds: string[] = [];
        shift.applications?.forEach((application) => {
          if (application.userId !== userId) {
            userNotHiredIds.push(application.userId);
          }
        });

        if (userNotHiredIds.length > 0) {
          await toggleManyApplicationStatusesRepository(
            userNotHiredIds,
            shiftId,
            ApplicationStatus.APPLIED,
          );
        }
        return application;
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to cancel application",
      });
    }),
});
