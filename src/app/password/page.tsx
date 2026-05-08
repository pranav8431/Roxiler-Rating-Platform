import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PasswordForm } from "@/components/forms/password-form";
import { requireUser } from "@/lib/rbac";
import { AppShell } from "@/components/app-shell";

export default async function PasswordPage() {
  const user = await requireUser();

  return (
    <AppShell user={user}>
      <Card>
        <CardTitle>Update password</CardTitle>
        <CardDescription>Keep your account secure with a password change form that follows the policy rules.</CardDescription>
        <div className="mt-6">
          <PasswordForm />
        </div>
      </Card>
    </AppShell>
  );
}