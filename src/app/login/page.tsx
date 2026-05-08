import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "@/components/forms/login-form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-12">
      <section className="flex flex-col justify-between rounded-4xl bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight lg:text-6xl">Log in</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
            Enter your email and password
          </p>
        </div>
      </section>

      <section className="flex items-center">
        <Card className="w-full bg-white/90 p-8">
          <CardTitle className="text-3xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account.</CardDescription>
          <div className="mt-8 space-y-6">
            <LoginForm />
            <p className="text-sm text-slate-600">
              New here? <Link className="font-medium text-slate-950 underline underline-offset-4" href="/register">Create an account</Link>
            </p>
          </div>
        </Card>
      </section>
    </main>
  );
}