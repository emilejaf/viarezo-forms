import { getEditableForm } from "@/lib/form";
import { AccessType, Form, FormType, Paps } from "@/lib/types/form";
import APIErrorPage from "@/components/api-error-page";
import { APIError } from "@/lib/exceptions";
import EditHeader from "@/app/(forms)/components/layout/edit-header";
import SelectAccess from "@/app/(forms)/components/access/select-access";

export default async function AccessPage({
  params,
}: {
  params: { id: string };
}) {
  const paps = await getEditableForm<Paps>(FormType.PAPS, params.id);

  if (paps instanceof APIError) {
    return <APIErrorPage error={paps} />;
  }

  const allowedAccess = [
    AccessType.ASSO,
    AccessType.ADVANCED,
    AccessType.CS,
    AccessType.PROMO,
    AccessType.RESTRICTED,
  ];

  return (
    <div className="space-y-6">
      <EditHeader id={params.id} title="access" type={FormType.PAPS} />
      <SelectAccess form={paps} allowedAccess={allowedAccess} />
    </div>
  );
}
