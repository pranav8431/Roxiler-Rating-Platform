import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/rbac";
import { getDashboardCounts, listStores, listUsers } from "@/lib/data";
import { formatRating } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const user = await requireRole(["ADMIN"]);
  const counts = await getDashboardCounts();
  const users = await listUsers({ role: "ALL", query: null, sortBy: "name", direction: "asc" });
  const stores = await listStores({ query: null, sortBy: "name", direction: "asc" });

  return (
    <AppShell user={user}>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total users", value: counts.users },
          { label: "Total stores", value: counts.stores },
          { label: "Submitted ratings", value: counts.ratings },
        ].map((item) => (
          <Card key={item.label}>
            <CardDescription>{item.label}</CardDescription>
            <CardTitle className="mt-3 text-4xl">{item.value}</CardTitle>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Store overview</CardTitle>
              <CardDescription>Stores and their ratings</CardDescription>
            </div>
            <Button asChild variant="secondary">
              <Link href="/admin/stores">View all</Link>
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {stores.slice(0, 4).map((store) => (
              <div key={store.id} className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-950">{store.name}</p>
                  <p className="text-sm text-slate-600">{store.address}</p>
                </div>
                <Badge className="bg-white text-slate-900">{formatRating(store.averageRating)}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>User overview</CardTitle>
              <CardDescription>Users by role</CardDescription>
            </div>
            <Button asChild variant="secondary">
              <Link href="/admin/users">View all</Link>
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {users.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-950">{item.name}</p>
                  <p className="text-sm text-slate-600">{item.email}</p>
                </div>
                <Badge className="bg-white text-slate-900">{item.role}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}