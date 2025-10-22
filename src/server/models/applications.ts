import { z } from "zod";

export const ApplicationStatusSchema = z.enum([
  "APPLIED",
  "WITHDRAWN",
  "REJECTED",
  "HIRED",
]);
export const ApplicationSchema = z.object({
  id: z.string(),
  shiftId: z.string(),
  userId: z.string(),
  status: ApplicationStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const NewApplicationSchema = ApplicationSchema.omit({
  id: true,
});

export type Application = z.infer<typeof ApplicationSchema>;
export type NewApplication = z.infer<typeof NewApplicationSchema>;
