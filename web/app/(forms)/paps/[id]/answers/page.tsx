import { getAnswerableForm, getEditableForm } from "@/lib/form";
import { FormType, Paps } from "@/lib/types/form";
import { queryAPI } from "@/lib/api";
import { PapsAnswer } from "@/lib/types/answer";
import { APIError } from "@/lib/exceptions";
import APIErrorPage from "@/components/api-error-page";
import AnswersTabs from "@/app/(forms)/components/answers/answers-tabs";
import { User, getCurrentUser } from "@/app/auth/session";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EditHeader from "@/app/(forms)/components/layout/edit-header";

export default async function PapsAnswers({
  params,
}: {
  params: { id: string };
}) {
  const form = await getAnswerableForm<Paps>(FormType.PAPS, params.id);
  const answers = await queryAPI<PapsAnswer[]>(`/paps/${params.id}/answers`);

  if (form instanceof APIError) {
    return <APIErrorPage error={form} />;
  }

  if (answers instanceof APIError) {
    return <APIErrorPage error={answers} />;
  }

  const currentUser = (await getCurrentUser()) as User;

  return (
    <div className="space-y-6 container py-16">
      <EditHeader id={params.id} title="answers" type={FormType.PAPS}>
        <Button variant="secondary" size="sm">
          <Link href={`/paps/${params.id}/scan`}>Scanner les QR Codes</Link>
        </Button>
      </EditHeader>
      <AnswersTabs
        form={form}
        answers={answers}
        hideAllowAnswers={currentUser.login != form.login}
      />
    </div>
  );
}
