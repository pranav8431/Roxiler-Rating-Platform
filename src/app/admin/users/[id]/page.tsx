import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/rbac";
import { getAdminUserDetails } from "@/lib/data";
import { displayRole } from "@/lib/rbac";
import { formatRating } from "@/lib/utils";

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(["ADMIN"]);
  const { id } = await params;
  const detail = await getAdminUserDetails(id);

  if (!detail) notFound();

  return (
    <AppShell user={user}>
      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <Badge className="bg-slate-50 text-slate-900">{displayRole(detail.role)}</Badge>
          <CardTitle className="mt-4 text-3xl">{detail.name}</CardTitle>
          <CardDescription>{detail.email}</CardDescription>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <p><span className="font-medium text-slate-950">Address:</span> {detail.address}</p>
            <p><span className="font-medium text-slate-950">Created:</span> {detail.createdAt.toLocaleString()}</p>
          </div>
        </Card>

        <Card>
          <CardTitle>Role insight</CardTitle>
          <CardDescription>Store owners show store-wide rating details here.</CardDescription>

          {detail.role === "STORE_OWNER" && detail.ownedStore ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Owned store</p>
                <p className="mt-1 font-medium text-slate-950">{detail.ownedStore.name}</p>
                <p className="text-sm text-slate-600">Average rating: {formatRating(detail.ownedStore.ratings.length ? detail.ownedStore.ratings.reduce((sum, rating) => sum + rating.value, 0) / detail.ownedStore.ratings.length : 0)}</p>
              </div>
              <div className="space-y-3">
                {detail.ownedStore.ratings.map((rating) => (
                  <div key={rating.id} className="rounded-3xl border border-slate-200 px-4 py-3">
                    <p className="font-medium text-slate-950">{rating.user.name}</p>
                    <p className="text-sm text-slate-600">{rating.user.email}</p>
                    <Badge className="mt-3 bg-slate-50 text-slate-900">{rating.value} / 5</Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
              This account does not own a store.
            </div>
          )}
        </Card>
      </section>
    </AppShell>
  );
}