"use client";

import { useActionState } from "react";
import { updatePasswordAction, type ActionState } from "@/app/actions";
import { FormSubmit } from "@/components/form-submit";
import { FormMessage } from "@/components/form-message";
import { Input } from "@/components/ui/input";

const initialState: ActionState = { status: "idle" };

export function PasswordForm() {
  const [state, action] = useActionState(updatePasswordAction, initialState);

  return (
    <form action={action} className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="currentPassword">Current password</label>
        <Input id="currentPassword" name="currentPassword" type="password" />
        <p className="text-xs text-rose-600">{state.fieldErrors?.currentPassword}</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="newPassword">New password</label>
        <Input id="newPassword" name="newPassword" type="password" />
        <p className="text-xs text-rose-600">{state.fieldErrors?.newPassword}</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="confirmPassword">Confirm password</label>
        <Input id="confirmPassword" name="confirmPassword" type="password" />
        <p className="text-xs text-rose-600">{state.fieldErrors?.confirmPassword}</p>
      </div>

      <div className="md:col-span-3 space-y-3">
        <FormMessage message={state.message} tone={state.status === "success" ? "success" : "error"} />
        <div className="max-w-sm">
          <FormSubmit>Update password</FormSubmit>
        </div>
      </div>
    </form>
  );
}
