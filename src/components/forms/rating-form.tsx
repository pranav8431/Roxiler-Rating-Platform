"use client";

import { useActionState } from "react";
import { submitRatingAction, type ActionState } from "@/app/actions";
import { FormSubmit } from "@/components/form-submit";
import { FormMessage } from "@/components/form-message";
import { Select } from "@/components/ui/select";

const initialState: ActionState = { status: "idle" };

export function RatingForm({ storeId, currentRating }: { storeId: string; currentRating: number | null }) {
  const [state, action] = useActionState(submitRatingAction, initialState);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="storeId" value={storeId} />
      <Select name="value" defaultValue={currentRating?.toString() ?? "5"}>
        {[5, 4, 3, 2, 1].map((value) => (
          <option key={value} value={value}>
            {value} star{value === 1 ? "" : "s"}
          </option>
        ))}
      </Select>
      <p className="text-xs text-rose-600">{state.fieldErrors?.value}</p>
      <FormMessage message={state.message} tone={state.status === "success" ? "success" : "error"} />
      <FormSubmit>{currentRating ? "Update rating" : "Submit rating"}</FormSubmit>
    </form>
  );
}
