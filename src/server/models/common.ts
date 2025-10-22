import { ApplicationStatus, ShiftStatus } from "@prisma/client";
import { z } from "zod";

export const CommonQueryOptionsSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  sort: z.enum(["asc", "desc"]).default("asc"),
  sortBy: z.string().default("createdAt"),
});

export type CommonQueryOptions = z.infer<typeof CommonQueryOptionsSchema>;

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
  totalPages: number;
}

export interface Shift {
  id: string;
  title: string;
  description: string | null;
  facilityName: string;
  location: string | null;
  startsAt: Date;
  endsAt: Date;
  hourlyRateCents: number;
  status: ShiftStatus;
  hiredProviderId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShiftWithApplications extends Shift {
  applications: Application[];
}

export interface Application {
  id: string;
  shiftId: string;
  userId: string;
  status: ApplicationStatus;
  createdAt: Date;
  shift?: Shift;
}

export interface PrismaApplicationCreateInput {
  shiftId: string;
  userId: string;
  status: ApplicationStatus;
}
