import { prisma } from "@/lib/prisma/client";
import { CommonQueryOptions, Shift } from "@/server/models/common";
import { Prisma, ShiftStatus } from "@prisma/client";

interface GetAllShiftsOptions extends CommonQueryOptions {
  userId?: string;
  status?: ShiftStatus;
  title?: string;
  startsAt?: string;
  facilityName?: string;
  hourlyRate?: number;
  location?: string;
}

export const getAllShiftsRepository = async (
  options: GetAllShiftsOptions,
): Promise<Shift[]> => {
  const {
    page = 1,
    limit = 10,
    sort = "asc",
    sortBy = "createdAt",
    userId,
    status,
    title,
    startsAt,
    facilityName,
    hourlyRate,
    location,
  } = options;

  const where: Prisma.ShiftWhereInput = {
    ...(userId ? { hiredProviderId: userId } : { hiredProviderId: null }),
    ...(status ? { status } : {}),
    ...(title ? { title: { contains: title } } : {}),
    ...(startsAt ? { startsAt: { gte: new Date(startsAt) } } : {}),
    ...(facilityName ? { facilityName: { contains: facilityName } } : {}),
    ...(hourlyRate ? { hourlyRateCents: { gte: hourlyRate * 100 } } : {}),
    ...(location ? { location: { contains: location } } : {}),
  };

  const shiftsFromDb = await prisma.shift.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sortBy]: sort,
    },
    where,
  });

  return shiftsFromDb;
};

export const getTotalShiftsRepository = async (
  userId?: string,
): Promise<number> => {
  return await prisma.shift.count({
    where: {
      ...(userId ? { hiredProviderId: userId } : { hiredProviderId: null }),
    },
  });
};

export const getShiftByIdRepository = async (id: string) => {
  return await prisma.shift.findUnique({
    where: { id },
    include: {
      applications: true,
    },
  });
};

export const createShiftRepository = async (
  data: Prisma.ShiftCreateInput,
): Promise<Shift> => {
  return await prisma.shift.create({
    data,
  });
};

export const updateShiftRepository = async (
  id: string,
  data: Prisma.ShiftUpdateInput,
) => {
  return await prisma.shift.update({
    where: { id },
    data,
  });
};

export const deleteShiftRepository = async (id: string): Promise<Shift> => {
  return await prisma.shift.delete({
    where: { id },
  });
};
