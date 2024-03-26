import { FormType } from "@/lib/types/form";
import EditHeader from "@/app/(forms)/components/layout/edit-header";
import Moderators from "@/app/(forms)/components/moderators/moderators";

export default async function ModeratorsPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  return (
    <div className="space-y-6">
      <EditHeader id={id} title="moderators" type={FormType.PAPS} />
      <Moderators formId={id} />
    </div>
  );
}
