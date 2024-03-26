import { getEditableForm } from "@/lib/form";
import { FormType, Vote } from "@/lib/types/form";
import APIErrorPage from "@/components/api-error-page";
import { APIError } from "@/lib/exceptions";
import EditHeader from "@/app/(forms)/components/layout/edit-header";
import DeleteForm from "@/app/(forms)/components/general/delete-form";
import GeneralForm from "@/app/(forms)/components/general/general-form";
import StartVote from "./start-vote";
import { redirect } from "next/navigation";

export default async function GeneralPage({
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
      <EditHeader id={params.id} title="general" type={FormType.VOTE} />
      <GeneralForm
        id={vote.id}
        title={vote.title}
        description={vote.description}
        type={vote.type}
      />
      <StartVote id={params.id} />
      <DeleteForm id={vote.id} type={vote.type} />
    </div>
  );
}
