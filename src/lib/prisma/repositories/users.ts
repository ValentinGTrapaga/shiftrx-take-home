import { prisma } from "../client";

export const getUserByIdRepository = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const getAllUsersRepository = async () => {
  return await prisma.user.findMany();
};
