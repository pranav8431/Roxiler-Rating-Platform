import { AppShell } from "@/components/app-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/rbac";
import { listStores } from "@/lib/data";
import { formatRating } from "@/lib/utils";
import { RatingForm } from "@/components/forms/rating-form";

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

export default async function StoresPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireRole(["USER"]);
  const params = await searchParams;
  const q = normalize(params.q);
  const sortBy = normalize(params.sortBy) || "name";
  const direction = normalize(params.direction) || "asc";

  const stores = await listStores({ query: q, sortBy, direction, userId: user.id });

  const searchParamsObject = new URLSearchParams();
  if (q) searchParamsObject.set("q", q);
  if (sortBy) searchParamsObject.set("sortBy", sortBy);
  if (direction) searchParamsObject.set("direction", direction);

  return (
    <AppShell user={user}>
      <Card>
        <CardTitle>Store directory</CardTitle>
        <CardDescription>Browse and rate stores</CardDescription>

        <form className="mt-6 grid gap-3 md:grid-cols-[1fr_160px_160px]" action="/stores" method="get">
          <input name="q" defaultValue={q} placeholder="Search by name or address" className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none" />
          <select name="sortBy" defaultValue={sortBy} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none">
            <option value="name">Name</option>
            <option value="address">Address</option>
            <option value="email">Email</option>
            <option value="rating">Rating</option>
          </select>
          <select name="direction" defaultValue={direction} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <div className="md:col-span-3 flex gap-3">
            <button className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white" type="submit">Apply filters</button>
            <a className="rounded-full px-4 py-2.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200" href="/stores">Reset</a>
          </div>
        </form>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {[
                  ["Store name", "name"],
                  ["Address", "address"],
                  ["Overall rating", "rating"],
                  ["Your rating", "current"],
                ].map(([label, key]) => (
                  <th key={key} className="px-4 py-3 font-medium">
                    {key === "current" ? label : <a href={sortLink("/stores", searchParamsObject, key)} className="hover:text-slate-950">{label}</a>}
                  </th>
                ))}
                <th className="px-4 py-3 font-medium">Submit rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {stores.map((store) => (
                <tr key={store.id}>
                  <td className="px-4 py-4 font-medium text-slate-950">
                    {store.name}
                    <p className="text-xs text-slate-500">{store.email}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{store.address}</td>
                  <td className="px-4 py-4"><Badge className="bg-slate-50 text-slate-900">{formatRating(store.averageRating)}</Badge></td>
                  <td className="px-4 py-4 text-slate-600">{store.currentUserRating ?? "Not rated"}</td>
                  <td className="px-4 py-4" style={{ minWidth: 220 }}>
                    <RatingForm storeId={store.id} currentRating={store.currentUserRating} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}