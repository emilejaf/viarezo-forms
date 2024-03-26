"use client";

import { Voter } from "@/lib/types/voters";
import { startTransition, useOptimistic } from "react";
import { createVoter, deleteVoter, updateVoter } from "./voters-actions";
import { Button } from "@/components/ui/button";
import useDebounce from "@/lib/hooks/useDebounce";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface OptimisticVoter extends Voter {
  optimistic?: boolean;
}

type VoterAction =
  | { action: "create"; voter: Voter }
  | { action: "update"; voterId: number; voter: Partial<Voter> }
  | { action: "delete"; voterId: number };

export default function ManageVoters({
  voteId,
  voters,
}: {
  voteId: string;
  voters: Voter[];
}) {
  const [optimisticVoters, setOptimisticVoters] = useOptimistic<
    OptimisticVoter[],
    VoterAction
  >(voters, (state, action) => {
    if (action.action === "create") {
      return [
        ...state,
        {
          id: action.voter.id,
          optimistic: true,
        },
      ];
    }
    if (action.action === "update") {
      return state.map((voter) =>
        voter.id === action.voterId
          ? { ...voter, ...action.voter, optimistic: true }
          : voter
      );
    }
    if (action.action === "delete") {
      return state.filter((voter) => voter.id !== action.voterId);
    }
    return state;
  });

  function addVoter() {
    startTransition(() => {
      setOptimisticVoters({ action: "create", voter: { id: Math.random() } });
      createVoter(voteId);
    });
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <Button onClick={addVoter}>Ajouter un votant</Button>
        <p className="text-muted-foreground">
          {optimisticVoters.length} votants
        </p>
      </div>
      <div className="space-y-6">
        {optimisticVoters.map((voter, index) => (
          <VoterCard
            key={index}
            voter={voter}
            updateVoter={(partialVoter) =>
              startTransition(() => {
                setOptimisticVoters({
                  action: "update",
                  voterId: voter.id,
                  voter: partialVoter,
                });
                updateVoter(voteId, voter.id, partialVoter);
              })
            }
            deleteVoter={() =>
              startTransition(() => {
                setOptimisticVoters({ action: "delete", voterId: voter.id });
                deleteVoter(voteId, voter.id);
              })
            }
          />
        ))}
      </div>
    </>
  );
}

function VoterCard({
  voter,
  updateVoter,
  deleteVoter,
}: {
  voter: OptimisticVoter;
  updateVoter: (voter: Partial<Voter>) => void;
  deleteVoter: () => void;
}) {
  const updateEmail = useDebounce((email: string) => updateVoter({ email }));
  const updateFirstName = useDebounce((firstName: string) =>
    updateVoter({ firstName })
  );
  const updateLastName = useDebounce((lastName: string) =>
    updateVoter({ lastName })
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor={voter.id.toString() + "firstName"}>Prénom</Label>
              <Input
                id={voter.id.toString() + "firstName"}
                name="voter-firstName"
                defaultValue={voter.firstName}
                onInput={(e) => updateFirstName(e.currentTarget.value)}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor={voter.id.toString() + "lastName"}>Nom</Label>
              <Input
                id={voter.id.toString() + "lastName"}
                name="voter-lastName"
                defaultValue={voter.lastName}
                onInput={(e) => updateLastName(e.currentTarget.value)}
              />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor={voter.id.toString() + "email"}>Email</Label>
            <Input
              id={voter.id.toString() + "email"}
              name="voter-email"
              type="email"
              defaultValue={voter.email}
              onInput={(e) => updateEmail(e.currentTarget.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <div
            className={cn("flex", {
              invisible: !voter.optimistic,
            })}
          >
            <Spinner className="text-muted-foreground mr-2 animate-spin" />
            <span className="text-muted-foreground">Enregistrement...</span>
          </div>
          <Button variant="destructive" onClick={deleteVoter}>
            Supprimer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
