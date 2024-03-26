import { Spinner } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SubmitButton({
  onClick,
  children,
}: {
  onClick: () => Promise<void>;
  children?: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="submit"
      onClick={() => {
        setLoading(true);
        onClick().finally(() => setLoading(false));
      }}
      disabled={loading}
    >
      {loading && <Spinner className="mr-2 size-4 animate-spin" />}
      {children || "Enregistrer"}
    </Button>
  );
}
