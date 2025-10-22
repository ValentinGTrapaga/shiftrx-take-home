import { router } from "./trpc";
import { applicationsRouter } from "./routers/applications";
import { usersRouter } from "./routers/users";
import { shiftsRouter } from "./routers/shifts";

export const appRouter = router({
  applications: applicationsRouter,
  users: usersRouter,
  shifts: shiftsRouter,
});

export type AppRouter = typeof appRouter;
