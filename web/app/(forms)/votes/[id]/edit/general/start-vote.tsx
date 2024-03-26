"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { startVoteAction } from "./start-vote-action";
import { toast } from "sonner";

export default function StartVote({ id }: { id: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lancer le vote</CardTitle>
        <CardDescription>
          Une fois le vote lancé, vous ne pourrez plus le modifier. Vous aller
          recevoir un email vous permettant de consulter les résultats du vote
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          onClick={async () => {
            const result = await startVoteAction(id);
            if (!result.ok) {
              toast.error(result.payload.message);
            }
          }}
        >
          Lancer
        </Button>
      </CardFooter>
    </Card>
  );
}
