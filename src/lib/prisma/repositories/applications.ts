import {
  CommonQueryOptions,
  PrismaApplicationCreateInput,
} from "../../../server/models/common";
import { prisma } from "../client";
import { Application } from "../../../server/models/common";
import { ApplicationStatus, Prisma } from "@prisma/client";

interface GetAllApplicationsOptions extends CommonQueryOptions {
  userId: string;
  status: ApplicationStatus | undefined;
  title: string | undefined;
  startsAt: string | undefined;
}

export const getAllApplicationsByUserIdRepository = async (
  options: GetAllApplicationsOptions,
) => {
  const {
    userId,
    page = 1,
    limit = 10,
    sort = "asc",
    sortBy = "createdAt",
    status,
    title,
    startsAt,
  } = options;

  const where: Prisma.ApplicationWhereInput = {
    userId,
    ...(status && { status }),
    ...(title && { shift: { title: { contains: title } } }),
    ...(startsAt && { shift: { startsAt: { gte: new Date(startsAt) } } }),
  };

  let orderBy: Prisma.ApplicationOrderByWithRelationInput = {
    createdAt: sort,
  };

  if (sortBy === "shiftTitle") {
    orderBy = {
      shift: {
        title: sort,
      },
    };
  }

  if (sortBy === "shiftStartsAt") {
    orderBy = {
      shift: {
        startsAt: sort,
      },
    };
  }

  if (sortBy === "status") {
    orderBy = {
      status: sort,
    };
  }

  return await prisma.application.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy,
    include: {
      shift: true,
    },
  });
};

export const getTotalApplicationsByUserIdRepository = async (
  userId: string,
): Promise<number> => {
  return await prisma.application.count({
    where: { userId },
  });
};

export const getApplicationByShiftIdAndUserIdRepository = async (
  shiftId: string,
  userId: string,
): Promise<Application | null> => {
  return await prisma.application.findUnique({
    where: { shiftId_userId: { shiftId, userId } },
  });
};

export const getApplicationByIdRepository = async (
  id: string,
): Promise<Application | null> => {
  return await prisma.application.findUnique({
    where: { id },
    include: {
      shift: true,
      user: true,
    },
  });
};

export const createApplicationRepository = async (
  data: PrismaApplicationCreateInput,
): Promise<Application> => {
  return await prisma.application.create({
    data,
  });
};

export const toggleApplicationStatusRepository = async (
  shiftId: string,
  userId: string,
  status: ApplicationStatus,
): Promise<Application> => {
  return await prisma.application.update({
    where: { shiftId_userId: { shiftId, userId } },
    data: { status },
  });
};

export const toggleManyApplicationStatusesRepository = async (
  userIds: string[],
  shiftId: string,
  status: ApplicationStatus,
) => {
  return await prisma.application.updateMany({
    where: { userId: { in: userIds }, shiftId },
    data: { status },
  });
};
