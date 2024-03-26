import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form } from "@/lib/types/form";

export default function ExtraSettings({ form }: { form: Form }) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2 justify-between items-center">
        <Label htmlFor="uniqueAnswer">Réponse unique</Label>
        <Switch
          id="uniqueAnswer"
          name="uniqueAnswer"
          defaultChecked={form.uniqueAnswer}
        />
      </div>
      <div className="flex space-x-2 justify-between items-center">
        <Label htmlFor="anonym">Réponse anonyme</Label>
        <Switch id="anonym" name="anonym" defaultChecked={form.anonym} />
      </div>
    </div>
  );
}
