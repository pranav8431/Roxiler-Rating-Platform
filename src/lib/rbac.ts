import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { roleLabels, type UserRole } from "@/lib/constants";

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    redirect("/dashboard");
  }
  return user;
}

export function displayRole(role: UserRole) {
  return roleLabels[role];
}
