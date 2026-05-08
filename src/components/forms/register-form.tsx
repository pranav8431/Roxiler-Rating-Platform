"use client";

import { useActionState, useEffect, useState } from "react";
import { registerAction, type ActionState } from "@/app/actions";
import { FormSubmit } from "@/components/form-submit";
import { FormMessage } from "@/components/form-message";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState = { status: "idle" };

type RegisterValues = {
  name: string;
  email: string;
  address: string;
  password: string;
};

export function RegisterForm() {
  const [state, action] = useActionState(registerAction, initialState);
  const [values, setValues] = useState<RegisterValues>({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  useEffect(() => {
    if (state.status !== "error") {
      return;
    }

    setValues((current) => ({
      name: state.fieldErrors?.name ? "" : current.name,
      email: state.fieldErrors?.email ? "" : current.email,
      address: state.fieldErrors?.address ? "" : current.address,
      password: "",
    }));
  }, [state.status, state.fieldErrors]);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="register-name">Full name</label>
        <Input
          id="register-name"
          name="name"
          placeholder="Your full legal name"
          value={values.name}
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
        />
        <p className="text-xs text-rose-600">{state.fieldErrors?.name}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="register-email">Email</label>
        <Input
          id="register-email"
          name="email"
          type="email"
          placeholder="name@company.com"
          value={values.email}
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
        />
        <p className="text-xs text-rose-600">{state.fieldErrors?.email}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="register-address">Address</label>
        <Textarea
          id="register-address"
          name="address"
          placeholder="Street, city, state"
          value={values.address}
          onChange={(event) => setValues((current) => ({ ...current, address: event.target.value }))}
        />
        <p className="text-xs text-rose-600">{state.fieldErrors?.address}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="register-password">Password</label>
        <Input
          id="register-password"
          name="password"
          type="password"
          placeholder="Create a strong password"
          value={values.password}
          onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
        />
        <p className="text-xs text-rose-600">{state.fieldErrors?.password}</p>
      </div>

      <FormMessage message={state.message} tone={state.status === "success" ? "success" : "error"} />

      <FormSubmit>Create account</FormSubmit>
    </form>
  );
}
