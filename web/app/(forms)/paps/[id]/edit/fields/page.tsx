import { getEditableForm } from "@/lib/form";
import { FormType, Paps } from "@/lib/types/form";
import APIErrorPage from "@/components/api-error-page";
import { APIError } from "@/lib/exceptions";
import EditHeader from "@/app/(forms)/components/layout/edit-header";
import ManageFields from "@/app/(forms)/components/fields/manage-fields";

export default async function FieldsPage({
  params,
}: {
  params: { id: string };
}) {
  const paps = await getEditableForm<Paps>(FormType.PAPS, params.id);

  if (paps instanceof APIError) {
    return <APIErrorPage error={paps} />;
  }

  return (
    <div className="space-y-6">
      <EditHeader id={params.id} title="fields" type={FormType.PAPS} />
      <ManageFields fields={paps.fields} id={paps.id} formType={paps.type} />
    </div>
  );
}
