"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { clearSessionCookie, hashPassword, setSessionCookie, verifyPassword } from "@/lib/auth";
import { createStoreSchema, createUserSchema, loginSchema, passwordUpdateSchema, parseFormData, ratingSchema, registerSchema } from "@/lib/schemas";
import { requireRole, requireUser } from "@/lib/rbac";
import type { UserRole } from "@/lib/constants";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

const initialState: ActionState = { status: "idle" };

function formatErrors(errors: Record<string, string[] | undefined>) {
  return Object.fromEntries(
    Object.entries(errors)
      .filter(([, value]) => value?.[0])
      .map(([key, value]) => [key, value?.[0] ?? "Invalid value"]),
  );
}

function fail(message: string, fieldErrors?: Record<string, string | undefined>): ActionState {
  return {
    status: "error",
    message,
    fieldErrors: Object.fromEntries(Object.entries(fieldErrors ?? {}).filter(([, value]) => Boolean(value)).map(([key, value]) => [key, value as string])),
  };
}

export async function loginAction(_: ActionState = initialState, formData: FormData): Promise<ActionState> {
  const parsed = parseFormData(loginSchema, formData);
  if (!parsed.success) {
    return fail("Check the highlighted fields.", formatErrors(parsed.error.flatten().fieldErrors));
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return fail("Invalid email or password.");
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return fail("Invalid email or password.");
  }

  await setSessionCookie({ id: user.id, name: user.name, email: user.email, role: user.role });
  redirect("/dashboard");
}

export async function registerAction(_: ActionState = initialState, formData: FormData): Promise<ActionState> {
  const parsed = parseFormData(registerSchema, formData);
  if (!parsed.success) {
    return fail("Check the highlighted fields.", formatErrors(parsed.error.flatten().fieldErrors));
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return fail("An account already exists for this email.", {
      email: "An account already exists for this email.",
    });
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      address: parsed.data.address,
      passwordHash: await hashPassword(parsed.data.password),
      role: "USER",
    },
  });

  await setSessionCookie({ id: user.id, name: user.name, email: user.email, role: user.role });
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}

export async function updatePasswordAction(_: ActionState = initialState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = parseFormData(passwordUpdateSchema, formData);
  if (!parsed.success) {
    return fail("Check the highlighted fields.", formatErrors(parsed.error.flatten().fieldErrors));
  }

  const currentUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!currentUser) {
    return fail("Unable to update password right now.");
  }

  const valid = await verifyPassword(parsed.data.currentPassword, currentUser.passwordHash);
  if (!valid) {
    return fail("Current password is incorrect.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });

  revalidatePath("/password");
  return { status: "success", message: "Password updated successfully." };
}

export async function createUserAction(_: ActionState = initialState, formData: FormData): Promise<ActionState> {
  await requireRole(["ADMIN"]);
  const parsed = parseFormData(createUserSchema, formData);
  if (!parsed.success) {
    return fail("Check the highlighted fields.", formatErrors(parsed.error.flatten().fieldErrors));
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return fail("A user already exists for this email.");
  }

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      address: parsed.data.address,
      passwordHash: await hashPassword(parsed.data.password),
      role: parsed.data.role as UserRole,
    },
  });

  revalidatePath("/admin/users");
  return { status: "success", message: "User created successfully." };
}

export async function createStoreAction(_: ActionState = initialState, formData: FormData): Promise<ActionState> {
  await requireRole(["ADMIN"]);
  const parsed = parseFormData(createStoreSchema, formData);
  if (!parsed.success) {
    return fail("Check the highlighted fields.", formatErrors(parsed.error.flatten().fieldErrors));
  }

  const existing = await prisma.store.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return fail("A store already exists for this email.");
  }

  const ownerId = parsed.data.ownerId || null;
  if (ownerId) {
    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner || owner.role !== "STORE_OWNER") {
      return fail("Select a valid store owner.");
    }
  }

  await prisma.store.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      address: parsed.data.address,
      ownerId,
    },
  });

  revalidatePath("/admin/stores");
  revalidatePath("/admin");
  return { status: "success", message: "Store created successfully." };
}

export async function submitRatingAction(_: ActionState = initialState, formData: FormData): Promise<ActionState> {
  const user = await requireRole(["USER"]);
  const parsed = parseFormData(ratingSchema, formData);
  if (!parsed.success) {
    return fail("Pick a rating between 1 and 5.", formatErrors(parsed.error.flatten().fieldErrors));
  }

  const store = await prisma.store.findUnique({ where: { id: parsed.data.storeId } });
  if (!store) {
    return fail("Store not found.");
  }

  await prisma.rating.upsert({
    where: {
      userId_storeId: {
        userId: user.id,
        storeId: store.id,
      },
    },
    update: {
      value: parsed.data.value,
    },
    create: {
      userId: user.id,
      storeId: store.id,
      value: parsed.data.value,
    },
  });

  revalidatePath("/stores");
  revalidatePath("/owner");
  revalidatePath("/admin/stores");
  return { status: "success", message: "Rating saved." };
}
