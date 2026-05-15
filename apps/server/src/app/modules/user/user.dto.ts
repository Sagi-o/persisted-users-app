import { z } from 'zod';

export const SaveUserDTO = z.object({
  id: z.string().min(1),
  title: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  gender: z.string(),
  email: z.string().email(),
  phone: z.string(),
  pictureLarge: z.string().url(),
  pictureThumbnail: z.string().url(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  streetNumber: z.number().int(),
  streetName: z.string(),
  dobDate: z.string(),
  age: z.number().int().nonnegative(),
});
export type SaveUserDTO = z.infer<typeof SaveUserDTO>;

export const UpdateNameDTO = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});
export type UpdateNameDTO = z.infer<typeof UpdateNameDTO>;
