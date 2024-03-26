import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AccessChildrenProps } from "@/lib/types/access";
import { useEffect, useState } from "react";
import SubmitButton from "./submit-button";

export default function PromoAccess({
  accessMeta,
  saveAccessMeta,
}: AccessChildrenProps) {
  const [year, setYear] = useState<string | undefined>(accessMeta);

  useEffect(() => {
    setYear(accessMeta);
  }, [accessMeta]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="year">Année de la promotion</Label>
        <Input
          className="w-[300px]"
          type="number"
          id="year"
          name="year"
          value={year || ""}
          autoFocus={true}
          onInput={(e) => {
            const value = e.currentTarget.value;
            const newYear =
              value == "" ? undefined : parseInt(e.currentTarget.value);

            if (newYear != undefined && isNaN(newYear)) {
              return;
            }

            setYear(newYear?.toString());
          }}
          placeholder="2026"
        />
      </div>
      <SubmitButton onClick={() => saveAccessMeta(year)} />
    </div>
  );
}
