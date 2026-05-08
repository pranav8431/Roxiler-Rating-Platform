"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
};

export function FormSubmit({ children }: Props) {
  const status = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={status.pending}>
      {status.pending ? "Submitting..." : children}
    </Button>
  );
}
