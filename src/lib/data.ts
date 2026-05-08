import { prisma } from "@/lib/db";
import { average } from "@/lib/utils";
import type { UserRole } from "@/lib/constants";

type SortDirection = "asc" | "desc";

export function getSortDirection(value?: string | null): SortDirection {
  return value === "desc" ? "desc" : "asc";
}

function matches(value: string, query?: string | null) {
  return query ? value.toLowerCase().includes(query.toLowerCase()) : true;
}

export async function getDashboardCounts() {
  const [users, stores, ratings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);

  return { users, stores, ratings };
}

export async function listUsers(options: { query?: string | null; role?: UserRole | "ALL"; sortBy?: string | null; direction?: string | null; }) {
  const users = await prisma.user.findMany({
    include: {
      ownedStore: {
        include: {
          ratings: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const filtered = users.filter((user) => {
    const query = options.query?.trim();
    const roleMatches = options.role && options.role !== "ALL" ? user.role === options.role : true;
    const searchMatches = !query ? true : [user.name, user.email, user.address, user.role].some((value) => matches(value, query));
    return roleMatches && searchMatches;
  });

  const direction = getSortDirection(options.direction);
  const sortKey = options.sortBy ?? "name";

  filtered.sort((left, right) => {
    const leftValue = sortKey === "rating" ? (left.ownedStore ? average(left.ownedStore.ratings.map((rating) => rating.value)) : 0) : String((left as Record<string, unknown>)[sortKey] ?? "");
    const rightValue = sortKey === "rating" ? (right.ownedStore ? average(right.ownedStore.ratings.map((rating) => rating.value)) : 0) : String((right as Record<string, unknown>)[sortKey] ?? "");

    if (typeof leftValue === "number" && typeof rightValue === "number") {
      return direction === "asc" ? leftValue - rightValue : rightValue - leftValue;
    }

    return direction === "asc"
      ? String(leftValue).localeCompare(String(rightValue))
      : String(rightValue).localeCompare(String(leftValue));
  });

  return filtered;
}

export async function listStores(options: { query?: string | null; sortBy?: string | null; direction?: string | null; userId?: string | null; }) {
  const stores = await prisma.store.findMany({
    include: {
      owner: true,
      ratings: {
        include: { user: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const filtered = stores.filter((store) => {
    const query = options.query?.trim();
    return !query ? true : [store.name, store.address, store.email].some((value) => matches(value, query));
  });

  const direction = getSortDirection(options.direction);
  const sortKey = options.sortBy ?? "name";

  const mapped = filtered.map((store) => {
    const ratings = store.ratings.map((rating) => rating.value);
    const averageRating = average(ratings);
    const currentUserRating = options.userId ? store.ratings.find((rating) => rating.userId === options.userId)?.value ?? null : null;

    return {
      ...store,
      averageRating,
      currentUserRating,
    };
  });

  mapped.sort((left, right) => {
    const leftValue = sortKey === "rating" ? left.averageRating : String((left as Record<string, unknown>)[sortKey] ?? "");
    const rightValue = sortKey === "rating" ? right.averageRating : String((right as Record<string, unknown>)[sortKey] ?? "");

    if (typeof leftValue === "number" && typeof rightValue === "number") {
      return direction === "asc" ? leftValue - rightValue : rightValue - leftValue;
    }

    return direction === "asc"
      ? String(leftValue).localeCompare(String(rightValue))
      : String(rightValue).localeCompare(String(leftValue));
  });

  return mapped;
}

export async function getOwnerOverview(ownerId: string) {
  const store = await prisma.store.findFirst({
    where: { ownerId },
    include: {
      owner: true,
      ratings: {
        include: { user: true },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!store) {
    return null;
  }

  const averageRating = average(store.ratings.map((rating) => rating.value));

  return {
    store,
    averageRating,
    ratingCount: store.ratings.length,
  };
}

export async function getAdminUserDetails(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      ownedStore: {
        include: {
          ratings: {
            include: { user: true },
          },
        },
      },
      ratings: {
        include: { store: true },
      },
    },
  });
}
