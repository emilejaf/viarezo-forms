import { FormType, Vote } from "@/lib/types/form";
import APIErrorPage from "@/components/api-error-page";
import { APIError } from "@/lib/exceptions";
import EditHeader from "@/app/(forms)/components/layout/edit-header";
import { queryAPI } from "@/lib/api";
import { Voter } from "@/lib/types/voters";
import ManageVoters from "./manage-voters";
import { getEditableForm } from "@/lib/form";
import { redirect } from "next/navigation";

export default async function VotersPage({
  params,
}: {
  params: { id: string };
}) {
  // this could be optimised by using Promise.all
  const vote = await getEditableForm<Vote>(FormType.VOTE, params.id);

  if (vote instanceof APIError) {
    return <APIErrorPage error={vote} />;
  }

  if (!vote.editable) {
    redirect(`/votes/${params.id}/started`);
  }

  const voters = await queryAPI<Voter[]>(`/votes/${params.id}/voters`, {
    next: { tags: [`voters/${params.id}`] },
  });

  if (voters instanceof APIError) {
    return <APIErrorPage error={voters} />;
  }

  return (
    <div className="space-y-6">
      <EditHeader id={params.id} title="voters" type={FormType.VOTE} />
      <ManageVoters voteId={params.id} voters={voters} />
    </div>
  );
}
