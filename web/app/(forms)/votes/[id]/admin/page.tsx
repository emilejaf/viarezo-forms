import AnswersTabs from "@/app/(forms)/components/answers/answers-tabs";
import DeleteForm from "@/app/(forms)/components/general/delete-form";
import APIErrorPage from "@/components/api-error-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { queryAPI } from "@/lib/api";
import { APIError } from "@/lib/exceptions";
import { getEditableForm } from "@/lib/form";
import { VoteAnswer } from "@/lib/types/answer";
import { FormType, Vote } from "@/lib/types/form";
import { Voter } from "@/lib/types/voters";
import { redirect } from "next/navigation";

export default async function AdminVotePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { key: string; iv: string };
}) {
  const vote = await getEditableForm<Vote>(FormType.VOTE, params.id);

  if (vote instanceof APIError) {
    return <APIErrorPage error={vote} />;
  }

  if (vote.editable) {
    redirect(`/votes/${params.id}/edit`);
  }

  // fetch answers
  const answers = await queryAPI<VoteAnswer[]>(
    `/votes/${params.id}/answers?key=${searchParams.key}&iv=${searchParams.iv}`,
    {
      next: { tags: [`answers/${params.id}`] },
    }
  );

  if (answers instanceof APIError) {
    return <APIErrorPage error={answers} />;
  }

  // fetch voters
  const voters = await queryAPI<Voter[]>(`/votes/${params.id}/voters`, {
    next: { tags: [`voters/${params.id}`] },
  });

  if (voters instanceof APIError) {
    return <APIErrorPage error={voters} />;
  }

  return (
    <div className="container py-16 space-y-8">
      <div className="space-y-6">
        <h3 className="text-2xl font-medium">Administration du vote</h3>
        <Separator />
      </div>
      <VotersComponent voters={voters} />
      <AnswersTabs answers={answers} form={vote} hideAllowAnswers={true} />
      <DeleteForm id={params.id} type={FormType.VOTE} />
    </div>
  );
}

function VotersComponent({ voters }: { voters: Voter[] }) {
  const votersWhoHaveNotVoted = voters.filter((voter) => !voter.voted);

  if (votersWhoHaveNotVoted.length === 0) {
    return <div className="text-lg font-semibold">Tout le monde a voté</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personne n&apos;ayant pas encore voté</CardTitle>
      </CardHeader>
      <CardContent>
        {voters
          .filter((voter) => !voter.voted)
          .map((voter) => (
            <VoterInfo key={voter.id} voter={voter} />
          ))}
      </CardContent>
    </Card>
  );
}

function VoterInfo({ voter }: { voter: Voter }) {
  return (
    <div className="flex space-x-12 items-center">
      <span className="text-lg font-semibold">
        {voter.firstName} {voter.lastName}
      </span>
      <span>{voter.email}</span>
    </div>
  );
}
