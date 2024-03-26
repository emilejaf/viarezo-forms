"use client";

import { LinkCSUser } from "@/lib/types/access";
import { startTransition, useOptimistic } from "react";
import AddModerator from "./add-moderator";
import ModeratorsTable from "./table";
import { updateModerators } from "../../actions/moderator";

interface OptimisticModerator {
  moderator: LinkCSUser;
  action: "add" | "remove";
}

export default function ManageModerators({
  moderators,
  formId,
}: {
  moderators: LinkCSUser[];
  formId: string;
}) {
  const [optimisticModerators, setOptimisticModerators] = useOptimistic<
    LinkCSUser[],
    OptimisticModerator
  >(moderators, (state, payload) => {
    if (payload.action === "add") {
      return [...state, payload.moderator];
    } else {
      return state.filter((m) => m.login !== payload.moderator.login);
    }
  });

  function updateModerator(payload: OptimisticModerator) {
    startTransition(() => {
      setOptimisticModerators(payload);

      const moderator = payload.moderator;

      if (payload.action === "add") {
        updateModerators(
          formId,
          [...optimisticModerators, moderator].map((m) => m.login)
        );
      } else {
        updateModerators(
          formId,
          optimisticModerators
            .filter((m) => m.login !== moderator.login)
            .map((m) => m.login)
        );
      }
    });
  }

  return (
    <>
      <AddModerator
        addModerator={(moderator) =>
          updateModerator({ moderator, action: "add" })
        }
      />
      <ModeratorsTable
        moderators={optimisticModerators}
        removeModerator={(moderator) =>
          updateModerator({ moderator, action: "remove" })
        }
      />
    </>
  );
}
