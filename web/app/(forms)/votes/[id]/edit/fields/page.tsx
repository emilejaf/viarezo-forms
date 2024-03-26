import { getEditableForm } from "@/lib/form";
import { FormType, Vote } from "@/lib/types/form";
import APIErrorPage from "@/components/api-error-page";
import { APIError } from "@/lib/exceptions";
import EditHeader from "@/app/(forms)/components/layout/edit-header";
import ManageFields from "@/app/(forms)/components/fields/manage-fields";
import { redirect } from "next/navigation";

export default async function FieldsPage({
  params,
}: {
  params: { id: string };
}) {
  const vote = await getEditableForm<Vote>(FormType.VOTE, params.id);

  if (vote instanceof APIError) {
    return <APIErrorPage error={vote} />;
  }

  if (!vote.editable) {
    redirect(`/votes/${params.id}/started`);
  }

  return (
    <div className="space-y-6">
      <EditHeader id={params.id} title="fields" type={FormType.VOTE} />
      <ManageFields fields={vote.fields} id={vote.id} formType={vote.type} />
    </div>
  );
}
