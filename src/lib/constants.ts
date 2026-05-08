export const userRoles = ["ADMIN", "USER", "STORE_OWNER"] as const;

export type UserRole = (typeof userRoles)[number];

export const roleLabels: Record<UserRole, string> = {
  ADMIN: "System Administrator",
  USER: "Normal User",
  STORE_OWNER: "Store Owner",
};

export const protectedRoutes = ["/dashboard", "/admin", "/owner", "/stores", "/password"];
