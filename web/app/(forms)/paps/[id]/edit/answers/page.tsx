import { getEditableForm } from "@/lib/form";
import { FormType, Paps } from "@/lib/types/form";
import { queryAPI } from "@/lib/api";
import { FormAnswer } from "@/lib/types/answer";
import { APIError } from "@/lib/exceptions";
import APIErrorPage from "@/components/api-error-page";
import EditHeader from "@/app/(forms)/components/layout/edit-header";
import AnswersTabs from "@/app/(forms)/components/answers/answers-tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AnswersPage({
  params,
}: {
  params: { id: string };
}) {
  const paps = await getEditableForm<Paps>(FormType.PAPS, params.id);
  const answers = await queryAPI<FormAnswer[]>(`/paps/${params.id}/answers`);

  if (paps instanceof APIError) {
    return <APIErrorPage error={paps} />;
  }

  if (answers instanceof APIError) {
    return <APIErrorPage error={answers} />;
  }

  return (
    <div className="space-y-6">
      <EditHeader id={params.id} title="answers" type={FormType.PAPS}>
        <Button variant="secondary" size="sm">
          <Link href={`/paps/${params.id}/scan`}>Scanner les QR Codes</Link>
        </Button>
      </EditHeader>
      <AnswersTabs form={paps} answers={answers} />
    </div>
  );
}
