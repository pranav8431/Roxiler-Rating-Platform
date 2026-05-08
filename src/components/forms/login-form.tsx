"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/actions";
import { FormSubmit } from "@/components/form-submit";
import { FormMessage } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: ActionState = { status: "idle" };

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="login-email">Email</label>
        <Input id="login-email" name="email" type="email" placeholder="name@company.com" />
        <p className="text-xs text-rose-600">{state.fieldErrors?.email}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="login-password">Password</label>
        <Input id="login-password" name="password" type="password" placeholder="Your password" />
        <p className="text-xs text-rose-600">{state.fieldErrors?.password}</p>
      </div>

      <FormMessage message={state.message} tone={state.status === "success" ? "success" : "error"} />

      <FormSubmit>Log in</FormSubmit>
    </form>
  );
}
