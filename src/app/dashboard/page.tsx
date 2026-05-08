import { redirect } from "next/navigation";
import { requireUser } from "@/lib/rbac";

export default async function DashboardPage() {
  const user = await requireUser();

  if (user.role === "ADMIN") redirect("/admin");
  if (user.role === "STORE_OWNER") redirect("/owner");
  redirect("/stores");
}