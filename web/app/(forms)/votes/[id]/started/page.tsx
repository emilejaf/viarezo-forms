import DeleteForm from "@/app/(forms)/components/general/delete-form";
import { FormType } from "@/lib/types/form";

export default function StartedVote({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string };
}) {
  const justStarted = searchParams.now != undefined;

  return (
    <div className="container py-16 space-y-6">
      {justStarted ? <JustStarted /> : <AlreadyStarted id={params.id} />}
    </div>
  );
}

function JustStarted() {
  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Vote lancé
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Le vote a été lancé. Vous recevrez un email pour consulter les
        résultats. Tous les participants vont maintenant recevoir un email pour
        voter.
      </p>
    </div>
  );
}

function AlreadyStarted({ id }: { id: string }) {
  return (
    <>
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Vote déjà lancé
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Pour accèder aux résultats du vote, veuillez utiliser le lien reçu par
          email.
        </p>
      </div>
      <DeleteForm id={id} type={FormType.VOTE} />
    </>
  );
}
