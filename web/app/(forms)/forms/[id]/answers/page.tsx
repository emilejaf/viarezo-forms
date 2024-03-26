import { getAnswerableForm } from "@/lib/form";
import { Form, FormType } from "@/lib/types/form";
import { queryAPI } from "@/lib/api";
import { FormAnswer } from "@/lib/types/answer";
import { APIError } from "@/lib/exceptions";
import APIErrorPage from "@/components/api-error-page";
import AnswersTabs from "@/app/(forms)/components/answers/answers-tabs";
import { User, getCurrentUser } from "@/app/auth/session";
import EditHeader from "@/app/(forms)/components/layout/edit-header";

export default async function FormAnswers({
  params,
}: {
  params: { id: string };
}) {
  const form = await getAnswerableForm<Form>(FormType.FORM, params.id);
  const answers = await queryAPI<FormAnswer[]>(`/forms/${params.id}/answers`);

  if (form instanceof APIError) {
    return <APIErrorPage error={form} />;
  }

  if (answers instanceof APIError) {
    return <APIErrorPage error={answers} />;
  }

  const currentUser = (await getCurrentUser()) as User;

  return (
    <div className="space-y-6 container flex-col py-16">
      <EditHeader id={params.id} title="answers" type={FormType.FORM} />
      <AnswersTabs
        form={form}
        answers={answers}
        hideAllowAnswers={currentUser.login != form.login}
      />
    </div>
  );
}
