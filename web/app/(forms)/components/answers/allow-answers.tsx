"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AbstractForm } from "@/lib/types/form";
import { startTransition, useOptimistic } from "react";
import { updateFormAction } from "../../actions/form";
import { toast } from "sonner";

export default function AllowAnswers({ form }: { form: AbstractForm }) {
  const [optimisticActive, setOptimisticActive] = useOptimistic<
    boolean,
    boolean
  >(form.active, (state, action) => action);

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="active">Autoriser les réponses</Label>
      <Switch
        id="active"
        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-destructive"
        checked={optimisticActive}
        onCheckedChange={(active) => {
          startTransition(() => {
            setOptimisticActive(active);
            updateFormAction(form.id, form.type, { active }).then(() => {
              toast(
                "Les réponses sont maintenant " +
                  (active ? "activées" : "désactivées")
              );
            });
          });
        }}
      />
    </div>
  );
}
