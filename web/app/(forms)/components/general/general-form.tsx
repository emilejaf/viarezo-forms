import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/submit-button";
import { updateFormAction } from "../../actions/form";
import {
  AbstractForm,
  DeepPartial,
  Form,
  FormType,
  Paps,
  Vote,
} from "@/lib/types/form";

export default function GeneralForm({
  id,
  type,
  title,
  description,
  children,
}: {
  id: string;
  type: FormType;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <form
      className="space-y-6"
      action={async (formData: FormData) => {
        "use server";
        const partialForm: DeepPartial<Form & Paps & Vote> = {};

        if (type == FormType.FORM) {
          partialForm.uniqueAnswer = false;
          partialForm.anonym = false;
        }

        formData.forEach((value, key) => {
          // nextjs adds some keys to the form data, ignore them
          if (key.startsWith("$")) return;

          if (key === "uniqueAnswer" || key === "anonym") {
            partialForm[key as "uniqueAnswer" | "anonym"] = value === "on";
          } else {
            partialForm[key as keyof AbstractForm] = value as any;
          }
        });

        return await updateFormAction(id, type, partialForm);
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          name="title"
          placeholder="Mon super formulaire"
          defaultValue={title}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          placeholder=""
          defaultValue={description}
        />
      </div>
      {children}
      <div>
        <SubmitButton>Enregistrer</SubmitButton>
      </div>
    </form>
  );
}
