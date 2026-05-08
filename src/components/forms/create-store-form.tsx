"use client";

import { useActionState } from "react";
import { createStoreAction, type ActionState } from "@/app/actions";
import { FormSubmit } from "@/components/form-submit";
import { FormMessage } from "@/components/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState = { status: "idle" };

export function CreateStoreForm({ owners }: { owners: Array<{ id: string; name: string; email: string }> }) {
  const [state, action] = useActionState(createStoreAction, initialState);

  return (
    <form action={action} className="grid gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="store-name">Store name</label>
        <Input id="store-name" name="name" />
        <p className="text-xs text-rose-600">{state.fieldErrors?.name}</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="store-email">Email</label>
        <Input id="store-email" name="email" type="email" />
        <p className="text-xs text-rose-600">{state.fieldErrors?.email}</p>
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="store-address">Address</label>
        <Textarea id="store-address" name="address" />
        <p className="text-xs text-rose-600">{state.fieldErrors?.address}</p>
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="store-ownerId">Store owner</label>
        <Select id="store-ownerId" name="ownerId" defaultValue="">
          <option value="">No owner assigned</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name} · {owner.email}
            </option>
          ))}
        </Select>
        <p className="text-xs text-rose-600">{state.fieldErrors?.ownerId}</p>
      </div>

      <div className="space-y-3">
        <FormMessage message={state.message} tone={state.status === "success" ? "success" : "error"} />
        <FormSubmit>Create store</FormSubmit>
      </div>
    </form>
  );
}
