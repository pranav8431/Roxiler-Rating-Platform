import Link from "next/link";
import { LayoutDashboard, Store, Users, Shield, Lock, LogOut, Star } from "lucide-react";
import { logoutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { displayRole } from "@/lib/rbac";

type AppShellProps = {
  user: { name: string; email: string; role: "ADMIN" | "USER" | "STORE_OWNER" };
  children: React.ReactNode;
};

const navByRole = {
  ADMIN: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/stores", label: "Stores", icon: Store },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/password", label: "Password", icon: Lock },
  ],
  USER: [
    { href: "/stores", label: "Stores", icon: Store },
    { href: "/password", label: "Password", icon: Lock },
  ],
  STORE_OWNER: [
    { href: "/owner", label: "Dashboard", icon: Star },
    { href: "/password", label: "Password", icon: Lock },
  ],
} as const;

export function AppShell({ user, children }: AppShellProps) {
  const nav = navByRole[user.role];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.08),transparent_40%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] text-slate-950">
      <div className="grid min-h-screen w-full gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="min-w-0 rounded-[28px] border border-slate-200/80 bg-slate-950 px-5 py-6 text-white shadow-2xl shadow-slate-950/15">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Roxiler</p>
              <h1 className="mt-2 text-2xl font-semibold">Rating Platform</h1>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 text-slate-100">
              <Shield className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="mt-1 text-sm text-slate-400">{user.email}</p>
            <Badge className="mt-4 border-white/10 text-white">{displayRole(user.role)}</Badge>
          </div>

          <nav className="mt-6 space-y-2">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <form action={logoutAction} className="mt-8">
            <Button variant="secondary" className="w-full justify-center">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </form>
        </aside>

        <main className="min-w-0 space-y-6 py-2">{children}</main>
      </div>
    </div>
  );
}
