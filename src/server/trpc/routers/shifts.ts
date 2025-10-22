import { CommonQueryOptionsSchema } from "@/server/models/common";
import { publicProcedure, router } from "../trpc";
import {
  getAllShiftsRepository,
  getShiftByIdRepository,
  getTotalShiftsRepository,
  updateShiftRepository,
} from "@/lib/prisma/repositories/shifts";
import { TRPCError } from "@trpc/server";
import {
  HireProviderForShiftSchema,
  ShiftSchema,
  ShiftStatusSchema,
} from "@/server/models/shifts";
import {
  toggleApplicationStatusRepository,
  toggleManyApplicationStatusesRepository,
} from "@/lib/prisma/repositories/applications";
import { ApplicationStatus, ShiftStatus } from "@prisma/client";
import { z } from "zod";

export const shiftsRouter = router({
  getAllWithPagination: publicProcedure
    .input(
      CommonQueryOptionsSchema.extend({
        userId: z.string().optional(),
        status: ShiftStatusSchema.optional(),
        title: z.string().optional(),
        startsAt: z.string().optional(),
        facilityName: z.string().optional(),
        hourlyRate: z.number().optional(),
        location: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const {
          page,
          limit,
          sort,
          sortBy,
          userId,
          status,
          title,
          startsAt,
          facilityName,
          hourlyRate,
          location,
        } = input;
        const [shifts, totalItems] = await Promise.all([
          getAllShiftsRepository({
            page,
            limit,
            sort,
            sortBy,
            userId,
            status,
            title,
            startsAt,
            facilityName,
            hourlyRate,
            location,
          }),
          getTotalShiftsRepository(userId),
        ]);

        const currentPage = page || 1;
        const totalPages = Math.ceil(totalItems / (limit ?? 10));
        const nextPage = currentPage < totalPages ? currentPage + 1 : null;
        const previousPage = currentPage > 1 ? currentPage - 1 : null;

        return {
          data: shifts,
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
          message: "Failed to get shifts",
        });
      }
    }),
  getById: publicProcedure
    .input(ShiftSchema.pick({ id: true }))
    .query(async ({ input }) => {
      try {
        const shift = await getShiftByIdRepository(input.id);
        if (!shift) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Shift not found",
          });
        }
        return shift;
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get shift",
        });
      }
    }),
  hireProvider: publicProcedure
    .input(HireProviderForShiftSchema)
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

        const [updatedShift, updatedApplication] = await Promise.all([
          updateShiftRepository(shiftId, {
            status: ShiftStatus.HIRED,
            hiredProviderId: userId,
          }),
          toggleApplicationStatusRepository(
            shiftId,
            userId,
            ApplicationStatus.HIRED,
          ),
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
            ApplicationStatus.REJECTED,
          );
        }
        return updatedShift;
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to hire provider for shift",
        });
      }
    }),
});
