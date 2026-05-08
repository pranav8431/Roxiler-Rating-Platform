import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateStoreForm } from "@/components/forms/create-store-form";
import { requireRole } from "@/lib/rbac";
import { listStores, listUsers } from "@/lib/data";
import { formatRating } from "@/lib/utils";

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

export default async function AdminStoresPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireRole(["ADMIN"]);
  const params = await searchParams;
  const q = normalize(params.q);
  const sortBy = normalize(params.sortBy) || "name";
  const direction = normalize(params.direction) || "asc";

  const [stores, owners] = await Promise.all([
    listStores({ query: q, sortBy, direction }),
    listUsers({ role: "STORE_OWNER", query: null, sortBy: "name", direction: "asc" }),
  ]);

  const searchParamsObject = new URLSearchParams();
  if (q) searchParamsObject.set("q", q);
  if (sortBy) searchParamsObject.set("sortBy", sortBy);
  if (direction) searchParamsObject.set("direction", direction);

  return (
    <AppShell user={user}>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(380px,0.6fr)]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>Stores</CardTitle>
              <CardDescription>Store list</CardDescription>
            </div>
            <Button asChild variant="secondary">
              <Link href="/admin/users">Manage users</Link>
            </Button>
          </div>

          <form className="mt-6 grid gap-3 md:grid-cols-[1fr_160px_160px]" action="/admin/stores" method="get">
            <input name="q" defaultValue={q} placeholder="Search by name or address" className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none" />
            <select name="sortBy" defaultValue={sortBy} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none">
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="address">Address</option>
              <option value="rating">Rating</option>
            </select>
            <select name="direction" defaultValue={direction} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <div className="md:col-span-3 flex gap-3">
              <Button type="submit">Apply filters</Button>
              <Button variant="ghost" asChild>
                <Link href="/admin/stores">Reset</Link>
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
                    ["Rating", "rating"],
                  ].map(([label, key]) => (
                    <th key={key} className="px-4 py-3 font-medium">
                      <Link href={sortLink("/admin/stores", searchParamsObject, key)} className="inline-flex items-center gap-1 hover:text-slate-950">
                        {label}
                      </Link>
                    </th>
                  ))}
                  <th className="px-4 py-3 font-medium">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {stores.map((store) => (
                  <tr key={store.id}>
                    <td className="px-4 py-4 font-medium text-slate-950">{store.name}</td>
                    <td className="px-4 py-4 text-slate-600">{store.email}</td>
                    <td className="px-4 py-4 text-slate-600">{store.address}</td>
                    <td className="px-4 py-4"><Badge className="bg-slate-50 text-slate-900">{formatRating(store.averageRating)}</Badge></td>
                    <td className="px-4 py-4 text-slate-600">{store.owner?.name ?? "Unassigned"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="min-w-0">
          <CardTitle>Create store</CardTitle>
          <CardDescription>Add a new store</CardDescription>
          <div className="mt-6">
            <CreateStoreForm owners={owners} />
          </div>
        </Card>
      </section>
    </AppShell>
  );
}