import { getEditableForm } from "@/lib/form";
import { Form, FormType } from "@/lib/types/form";
import APIErrorPage from "@/components/api-error-page";
import { APIError } from "@/lib/exceptions";
import EditHeader from "@/app/(forms)/components/layout/edit-header";
import ManageFields from "@/app/(forms)/components/fields/manage-fields";

export default async function FieldsPage({
  params,
}: {
  params: { id: string };
}) {
  const form = await getEditableForm<Form>(FormType.FORM, params.id);

  if (form instanceof APIError) {
    return <APIErrorPage error={form} />;
  }

  return (
    <div className="space-y-6">
      <EditHeader id={params.id} title="fields" type={FormType.FORM} />
      <ManageFields
        fields={form.fields}
        id={form.id}
        formType={FormType.FORM}
      />
    </div>
  );
}
