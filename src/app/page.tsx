import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default async function Home() {
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative overflow-hidden px-4 py-8 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 lg:text-7xl">
                Rating platform for stores
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Sign up to browse stores and submit ratings. Administrators manage users and stores. Store owners view ratings.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/login" className="inline-flex items-center justify-center rounded-full border-2 border-slate-950 bg-white px-5 py-3 text-sm font-medium text-slate-950 shadow-lg shadow-slate-950/10 transition hover:bg-slate-50">
                Log in <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Button variant="secondary" asChild>
                <Link href="/register">Create account</Link>
              </Button>
            </div>
          </div>

          <Card className="relative overflow-hidden bg-slate-950 text-white">
            <div className="relative space-y-5">
              <div className="space-y-2">
                <CardTitle className="text-2xl text-white">Demo credentials</CardTitle>
                <CardDescription className="text-slate-300">
                  Test accounts for evaluation
                </CardDescription>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium text-white">Admin:</span> <span className="text-slate-300">admin@roxiler.com / Password@123</span></p>
                <p><span className="font-medium text-white">Store Owner:</span> <span className="text-slate-300">owner@roxiler.com / Password@123</span></p>
                <p><span className="font-medium text-white">User:</span> <span className="text-slate-300">user@roxiler.com / Password@123</span></p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
