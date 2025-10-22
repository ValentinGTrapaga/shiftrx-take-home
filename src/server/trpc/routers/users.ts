import { UserSchema } from "@/server/models/users";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  getAllUsersRepository,
  getUserByIdRepository,
} from "@/lib/prisma/repositories/users";

export const usersRouter = router({
  getById: publicProcedure
    .input(UserSchema.pick({ id: true }))
    .query(async ({ input }) => {
      try {
        const user = await getUserByIdRepository(input.id);
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }
        return user;
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get user",
        });
      }
    }),
  getAllUsers: publicProcedure.query(async () => {
    try {
      const users = await getAllUsersRepository();
      return users;
    } catch (error) {
      if (error instanceof Error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get users",
      });
    }
  }),
});
