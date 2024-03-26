import EditHeader from "@/app/(forms)/components/layout/edit-header";
import { getEditableForm } from "@/lib/form";
import { FormType, Paps } from "@/lib/types/form";
import ManageChoices from "./manage-choices";
import { APIError } from "@/lib/exceptions";
import APIErrorPage from "@/components/api-error-page";

export default async function ChoicesPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  const paps = await getEditableForm<Paps>(FormType.PAPS, params.id);

  if (paps instanceof APIError) {
    return <APIErrorPage error={paps} />;
  }

  return (
    <div className="space-y-6">
      <EditHeader id={id} title="choices" type={FormType.PAPS} />
      <ManageChoices paps={paps} />
    </div>
  );
}
