import { getEditableForm } from "@/lib/form";
import { Form, FormType } from "@/lib/types/form";
import APIErrorPage from "@/components/api-error-page";
import { APIError } from "@/lib/exceptions";
import EditHeader from "@/app/(forms)/components/layout/edit-header";
import DeleteForm from "@/app/(forms)/components/general/delete-form";
import GeneralForm from "@/app/(forms)/components/general/general-form";
import ExtraSettings from "./extra-settings";

export default async function GeneralPage({
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
      <EditHeader id={params.id} title="general" type={FormType.FORM} />
      <GeneralForm
        id={form.id}
        title={form.title}
        description={form.description}
        type={form.type}
      >
        <ExtraSettings form={form} />
      </GeneralForm>
      <DeleteForm id={form.id} type={form.type} />
    </div>
  );
}
