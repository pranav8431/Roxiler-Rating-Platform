"use client";

import { useActionState } from "react";
import { createUserAction, type ActionState } from "@/app/actions";
import { FormSubmit } from "@/components/form-submit";
import { FormMessage } from "@/components/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState = { status: "idle" };

export function CreateUserForm() {
  const [state, action] = useActionState(createUserAction, initialState);

  return (
    <form action={action} className="grid gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="user-name">Name</label>
        <Input id="user-name" name="name" />
        <p className="text-xs text-rose-600">{state.fieldErrors?.name}</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="user-email">Email</label>
        <Input id="user-email" name="email" type="email" />
        <p className="text-xs text-rose-600">{state.fieldErrors?.email}</p>
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="user-address">Address</label>
        <Textarea id="user-address" name="address" />
        <p className="text-xs text-rose-600">{state.fieldErrors?.address}</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="user-password">Password</label>
        <Input id="user-password" name="password" type="password" />
        <p className="text-xs text-rose-600">{state.fieldErrors?.password}</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="user-role">Role</label>
        <Select id="user-role" name="role" defaultValue="USER">
          <option value="USER">Normal User</option>
          <option value="ADMIN">System Administrator</option>
          <option value="STORE_OWNER">Store Owner</option>
        </Select>
        <p className="text-xs text-rose-600">{state.fieldErrors?.role}</p>
      </div>

      <div className="space-y-3">
        <FormMessage message={state.message} tone={state.status === "success" ? "success" : "error"} />
        <FormSubmit>Create user</FormSubmit>
      </div>
    </form>
  );
}
