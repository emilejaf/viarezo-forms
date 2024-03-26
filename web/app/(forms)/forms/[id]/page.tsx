import { Separator } from "@/components/ui/separator";
import { getAnswerableForm } from "@/lib/form";
import { Form, FormType } from "@/lib/types/form";
import SubmitButton from "@/components/submit-button";
import { APIError } from "@/lib/exceptions";
import APIErrorPage from "@/components/api-error-page";
import FormComponent from "../../components/form-component";
import { submitAnswer } from "../../actions/answer";

export default async function FormPage({ params }: { params: { id: string } }) {
  const form = await getAnswerableForm<Form>(FormType.FORM, params.id);

  if (form instanceof APIError) {
    return <APIErrorPage error={form} />;
  }

  return (
    <div className="container max-w-screen-lg space-y-6 p-10">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">{form.title}</h2>
        <p className="text-muted-foreground">{form.description}</p>
      </div>
      <Separator className="my-6" />
      <form
        className="space-y-8"
        action={submitAnswer.bind(null, { id: params.id, type: form.type })}
      >
        <FormComponent form={form} />
        <SubmitButton>Soumettre ma réponse</SubmitButton>
      </form>
    </div>
  );
}
