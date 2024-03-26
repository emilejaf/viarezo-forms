"use client";

import { Spinner } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending && <Spinner className="mr-2 size-4 animate-spin" />}
      {children}
    </Button>
  );
}
