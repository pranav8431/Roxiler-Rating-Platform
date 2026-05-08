import { AppShell } from "@/components/app-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/rbac";
import { getOwnerOverview } from "@/lib/data";
import { formatRating } from "@/lib/utils";

export default async function OwnerPage() {
  const user = await requireRole(["STORE_OWNER"]);
  const overview = await getOwnerOverview(user.id);

  return (
    <AppShell user={user}>
      {!overview ? (
        <Card>
          <CardTitle>No store assigned yet</CardTitle>
          <CardDescription>Ask an administrator to connect your account to a store.</CardDescription>
        </Card>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card>
            <Badge className="bg-slate-50 text-slate-900">Store owner</Badge>
            <CardTitle className="mt-4 text-3xl">{overview.store.name}</CardTitle>
            <CardDescription>{overview.store.address}</CardDescription>
            <div className="mt-6 space-y-3">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Average rating</p>
                <p className="mt-1 text-3xl font-semibold text-slate-950">{formatRating(overview.averageRating)}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Total ratings</p>
                <p className="mt-1 text-3xl font-semibold text-slate-950">{overview.ratingCount}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle>Users who rated your store</CardTitle>
            <CardDescription>Ratings received</CardDescription>
            <div className="mt-6 space-y-3">
              {overview.store.ratings.map((rating) => (
                <div key={rating.id} className="rounded-3xl border border-slate-200 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-950">{rating.user.name}</p>
                      <p className="text-sm text-slate-600">{rating.user.email}</p>
                    </div>
                    <Badge className="bg-slate-50 text-slate-900">{rating.value} / 5</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}
    </AppShell>
  );
}