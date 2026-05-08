import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(connectionString),
});

async function main() {
  const passwordHash = await bcrypt.hash("Password@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@roxiler.com" },
    update: {},
    create: {
      name: "Roxiler Platform Administrator",
      email: "admin@roxiler.com",
      address: "1 Admin Avenue, Platform City",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@roxiler.com" },
    update: {},
    create: {
      name: "Owner Store Manager Account",
      email: "owner@roxiler.com",
      address: "78 Merchant Street, Commerce District",
      passwordHash,
      role: UserRole.STORE_OWNER,
    },
  });

  const normalUser = await prisma.user.upsert({
    where: { email: "user@roxiler.com" },
    update: {},
    create: {
      name: "Normal Customer Account Name",
      email: "user@roxiler.com",
      address: "45 Market Road, Retail Park",
      passwordHash,
      role: UserRole.USER,
    },
  });

  const store = await prisma.store.upsert({
    where: { email: "store@roxiler.com" },
    update: { ownerId: owner.id },
    create: {
      name: "Roxiler Signature Retail Experience",
      email: "store@roxiler.com",
      address: "100 Commerce Boulevard, Retail District",
      ownerId: owner.id,
    },
  });

  await prisma.rating.upsert({
    where: {
      userId_storeId: {
        userId: normalUser.id,
        storeId: store.id,
      },
    },
    update: { value: 5 },
    create: {
      userId: normalUser.id,
      storeId: store.id,
      value: 5,
    },
  });

  console.log({ admin: admin.email, owner: owner.email, normalUser: normalUser.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
