import { getEditableForm } from "@/lib/form";
import { FormType, Paps } from "@/lib/types/form";
import APIErrorPage from "@/components/api-error-page";
import { APIError } from "@/lib/exceptions";
import EditHeader from "@/app/(forms)/components/layout/edit-header";
import DeleteForm from "@/app/(forms)/components/general/delete-form";
import GeneralForm from "@/app/(forms)/components/general/general-form";
import { StartTimePicker } from "./start-time-picker";

export default async function GeneralPage({
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
      <EditHeader id={params.id} title="general" type={FormType.PAPS} />
      <GeneralForm
        id={paps.id}
        title={paps.title}
        description={paps.description}
        type={paps.type}
      >
        <StartTimePicker initialDate={paps.start} />
      </GeneralForm>
      <DeleteForm id={paps.id} type={paps.type} />
    </div>
  );
}
