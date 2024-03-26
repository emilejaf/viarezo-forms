import { Separator } from "@/components/ui/separator";
import { getAnswerableForm } from "@/lib/form";
import { FormType, Paps } from "@/lib/types/form";
import SubmitButton from "@/components/submit-button";
import { APIError } from "@/lib/exceptions";
import APIErrorPage from "@/components/api-error-page";
import FormComponent from "../../components/form-component";
import { submitAnswer } from "../../actions/answer";
import { queryAPI } from "@/lib/api";
import { redirect } from "next/navigation";

export default async function FormPage({ params }: { params: { id: string } }) {
  const paps = await getAnswerableForm<Paps>(FormType.PAPS, params.id);
  const hasAnswered = await queryAPI<number | null>(
    `/paps/${params.id}/answer`,
    {
      next: { tags: [`paps/${params.id}`] },
    }
  );

  if (paps instanceof APIError) {
    return <APIErrorPage error={paps} />;
  }

  if (hasAnswered instanceof APIError) {
    return <APIErrorPage error={hasAnswered} />;
  }

  if (hasAnswered != null) {
    redirect(`/paps/${params.id}/success`);
  }

  return (
    <div className="container max-w-screen-lg space-y-6 p-10">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">{paps.title}</h2>
        <p className="text-muted-foreground">{paps.description}</p>
      </div>
      <Separator className="my-6" />
      <form
        className="space-y-8"
        action={submitAnswer.bind(null, { id: params.id, type: paps.type })}
      >
        <FormComponent form={paps} />
        <div className="space-x-4">
          {paps.choices.map((choice) => (
            <SubmitButton key={choice.id} name="+choiceId" value={choice.id}>
              {choice.name} - {choice.size - choice.answersCount}
            </SubmitButton>
          ))}
        </div>
      </form>
    </div>
  );
}
