import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateUserForm } from "@/components/forms/create-user-form";
import { requireRole } from "@/lib/rbac";
import { listUsers } from "@/lib/data";
import { displayRole } from "@/lib/rbac";

function normalize(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

function sortLink(base: string, params: URLSearchParams, key: string) {
  const next = new URLSearchParams(params);
  const currentKey = next.get("sortBy");
  const currentDir = next.get("direction") ?? "asc";

  if (currentKey === key) {
    next.set("direction", currentDir === "asc" ? "desc" : "asc");
  } else {
    next.set("sortBy", key);
    next.set("direction", "asc");
  }

  return `${base}?${next.toString()}`;
}

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireRole(["ADMIN"]);
  const params = await searchParams;
  const query = normalize(params.q);
  const role = normalize(params.role) || "ALL";
  const sortBy = normalize(params.sortBy) || "name";
  const direction = normalize(params.direction) || "asc";

  const users = await listUsers({ query, role: role as "ALL" | "ADMIN" | "USER" | "STORE_OWNER", sortBy, direction });

  const searchParamsObject = new URLSearchParams();
  if (query) searchParamsObject.set("q", query);
  if (role) searchParamsObject.set("role", role);
  if (sortBy) searchParamsObject.set("sortBy", sortBy);
  if (direction) searchParamsObject.set("direction", direction);

  return (
    <AppShell user={user}>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(380px,0.6fr)]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>User directory</CardTitle>
              <CardDescription>User list</CardDescription>
            </div>
            <Button asChild variant="secondary">
              <Link href="/admin/stores">Create store</Link>
            </Button>
          </div>

          <form className="mt-6 grid gap-3 md:grid-cols-[1fr_160px_160px]" action="/admin/users" method="get">
            <input name="q" defaultValue={query} placeholder="Search by name, email, or address" className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none" />
            <select name="role" defaultValue={role} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none">
              <option value="ALL">All roles</option>
              <option value="ADMIN">System Administrator</option>
              <option value="USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
            <select name="sortBy" defaultValue={sortBy} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none">
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="address">Address</option>
              <option value="role">Role</option>
            </select>
            <select name="direction" defaultValue={direction} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none md:col-start-3">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <div className="md:col-span-3 flex gap-3">
              <Button type="submit">Apply filters</Button>
              <Button variant="ghost" asChild>
                <Link href="/admin/users">Reset</Link>
              </Button>
            </div>
          </form>

          <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  {[
                    ["Name", "name"],
                    ["Email", "email"],
                    ["Address", "address"],
                    ["Role", "role"],
                  ].map(([label, key]) => (
                    <th key={key} className="px-4 py-3 font-medium">
                      <Link href={sortLink("/admin/users", searchParamsObject, key)} className="inline-flex items-center gap-1 hover:text-slate-950">
                        {label}
                      </Link>
                    </th>
                  ))}
                  <th className="px-4 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {users.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-4 font-medium text-slate-950">{item.name}</td>
                    <td className="px-4 py-4 text-slate-600">{item.email}</td>
                    <td className="px-4 py-4 text-slate-600">{item.address}</td>
                    <td className="px-4 py-4"><Badge className="bg-slate-50 text-slate-900">{displayRole(item.role)}</Badge></td>
                    <td className="px-4 py-4">
                      <Link href={`/admin/users/${item.id}`} className="text-sm font-medium text-slate-950 underline underline-offset-4">Open</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="min-w-0">
          <CardTitle>Create user</CardTitle>
          <CardDescription>Add a new user</CardDescription>
          <div className="mt-6">
            <CreateUserForm />
          </div>
        </Card>
      </section>
    </AppShell>
  );
}