import { getEditableForm } from "@/lib/form";
import { Form, FormType } from "@/lib/types/form";
import APIErrorPage from "@/components/api-error-page";
import { APIError } from "@/lib/exceptions";
import EditHeader from "@/app/(forms)/components/layout/edit-header";
import SelectAccess from "@/app/(forms)/components/access/select-access";

export default async function AccessPage({
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
      <EditHeader id={params.id} title="access" type={FormType.FORM} />
      <SelectAccess form={form} />
    </div>
  );
}
