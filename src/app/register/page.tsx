import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { RegisterForm } from "@/components/forms/register-form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-12">
      <section className="rounded-4xl border border-white/60 bg-white/80 p-8 shadow-2xl shadow-slate-950/10 backdrop-blur">
        <CardTitle className="text-3xl">Create your account</CardTitle>
        <CardDescription>Sign up as a normal user to browse and rate stores.</CardDescription>
        <div className="mt-8">
          <RegisterForm />
        </div>
        <p className="mt-6 text-sm text-slate-600">
          Already have an account? <Link className="font-medium text-slate-950 underline underline-offset-4" href="/login">Log in</Link>
        </p>
      </section>

      <section className="flex flex-col justify-between rounded-4xl bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20">
        <h1 className="text-4xl font-semibold tracking-tight lg:text-6xl">Create account</h1>
        <p className="text-slate-300">Browse stores and submit ratings after you sign up.</p>
      </section>
    </main>
  );
}