import { getEditableForm } from "@/lib/form";
import { Form, FormType } from "@/lib/types/form";
import EditHeader from "../../../../components/layout/edit-header";
import { queryAPI } from "@/lib/api";
import { FormAnswer } from "@/lib/types/answer";
import { APIError } from "@/lib/exceptions";
import APIErrorPage from "@/components/api-error-page";
import AnswersTabs from "../../../../components/answers/answers-tabs";

export default async function FormAnswers({
  params,
}: {
  params: { id: string };
}) {
  const form = await getEditableForm<Form>(FormType.FORM, params.id);
  const answers = await queryAPI<FormAnswer[]>(`/forms/${params.id}/answers`);

  if (form instanceof APIError) {
    return <APIErrorPage error={form} />;
  }

  if (answers instanceof APIError) {
    return <APIErrorPage error={answers} />;
  }

  return (
    <div className="space-y-6">
      <EditHeader id={params.id} title="answers" type={FormType.FORM} />
      <AnswersTabs form={form} answers={answers} />
    </div>
  );
}
