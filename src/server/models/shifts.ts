import { z } from "zod";

export const ShiftStatusSchema = z.enum(["OPEN", "HIRED", "CANCELLED"]);
export const ShiftSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  facilityName: z.string(),
  location: z.string().optional(),
  startsAt: z.date(),
  endsAt: z.date(),
  hourlyRateCents: z.number().int(),
  hiredProviderId: z.string().optional(),
  status: ShiftStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const NewShiftSchema = ShiftSchema.omit({
  id: true,
});

export const HireProviderForShiftSchema = z.object({
  shiftId: z.string(),
  userId: z.string(),
});

export type Shift = z.infer<typeof ShiftSchema>;
export type NewShift = z.infer<typeof NewShiftSchema>;
