import APIErrorPage from "@/components/api-error-page";
import SubmitButton from "@/components/submit-button";
import { Separator } from "@/components/ui/separator";
import { APIError } from "@/lib/exceptions";
import { submitAnswer } from "../../actions/answer";
import FormComponent from "../../components/form-component";
import { Vote } from "@/lib/types/form";
import { queryAPI } from "@/lib/api";

export default async function FormPage({
  params,
  searchParams,
}: {
  searchParams: { key: string; iv: string; id: string; user: string };
  params: { id: string };
}) {
  const vote = await queryAPI<Vote>(
    `/votes/${params.id}?${new URLSearchParams(searchParams).toString()}`,
    {
      next: { tags: [params.id] },
    }
  );

  if (vote instanceof APIError) {
    return <APIErrorPage error={vote} />;
  }

  return (
    <div className="container max-w-screen-lg space-y-6 p-10">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">{vote.title}</h2>
        <p className="text-muted-foreground">{vote.description}</p>
      </div>
      <Separator className="my-6" />
      <form
        className="space-y-8"
        action={submitAnswer.bind(null, {
          id: params.id,
          type: vote.type,
          queryParams: searchParams,
        })}
      >
        <FormComponent form={vote} />
        <SubmitButton>Voter</SubmitButton>
      </form>
    </div>
  );
}
