import { z } from "zod";

const nameSchema = z.string().trim().min(20, "Name must be at least 20 characters.").max(60, "Name must be at most 60 characters.");
const addressSchema = z.string().trim().max(400, "Address must be at most 400 characters.");
const emailSchema = z.string().trim().email("Enter a valid email address.");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(16, "Password must be at most 16 characters.")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
  .regex(/[^A-Za-z0-9]/, "Password must include at least one special character.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
});

export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, "Confirm your new password."),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  role: z.enum(["ADMIN", "USER", "STORE_OWNER"]),
});

export const createStoreSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  ownerId: z.string().trim().optional(),
});

export const ratingSchema = z.object({
  storeId: z.string().min(1),
  value: z.coerce.number().int().min(1, "Rating must be between 1 and 5.").max(5, "Rating must be between 1 and 5."),
});

export function parseFormData<T extends z.ZodTypeAny>(schema: T, formData: FormData) {
  const payload = Object.fromEntries(formData.entries());
  return schema.safeParse(payload);
}
