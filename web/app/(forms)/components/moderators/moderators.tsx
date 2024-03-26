import APIErrorPage from "@/components/api-error-page";
import { queryAPI } from "@/lib/api";
import { APIError } from "@/lib/exceptions";
import { LinkCSUser } from "@/lib/types/access";
import { Moderator } from "@/lib/types/moderator";
import ManageModerators from "./manage-moderators";

async function getModerators(formId: string): Promise<LinkCSUser[] | APIError> {
  const moderatorlogins = await queryAPI<Moderator[]>(`/moderators/${formId}`, {
    next: { tags: [`${formId}/moderators`] },
  });

  if (moderatorlogins instanceof APIError) {
    return moderatorlogins;
  }

  const moderators =
    moderatorlogins.length > 0
      ? await queryAPI<LinkCSUser[]>(
          "/viarezo/users?logins=" +
            moderatorlogins.map((m) => m.login).join(",")
        )
      : [];

  return moderators;
}

export default async function Moderators({ formId }: { formId: string }) {
  const moderators = await getModerators(formId);

  if (moderators instanceof APIError) {
    return <APIErrorPage error={moderators} />;
  }

  return <ManageModerators moderators={moderators} formId={formId} />;
}
