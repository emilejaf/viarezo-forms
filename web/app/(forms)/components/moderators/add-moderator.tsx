import { Combobox } from "@/components/combobox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkCSUser } from "@/lib/types/access";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { searchUsers } from "../../actions/external";

export default function AddModerator({
  addModerator,
}: {
  addModerator: (moderator: LinkCSUser) => void;
}) {
  const [moderator, setModerator] = useState<LinkCSUser | undefined>(undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un modérateur</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-2">
        <Combobox<LinkCSUser>
          labelFn={(item) =>
            item
              ? item.firstName + " " + item.lastName
              : "Rechercher un utilisateur..."
          }
          valueFn={(item) => item.login}
          onValueChange={setModerator}
          value={moderator}
          searchFn={searchUsers}
        />
        <Button
          onClick={() => {
            if (moderator) {
              addModerator(moderator);
              setModerator(undefined);
            }
          }}
        >
          Ajouter
        </Button>
      </CardContent>
    </Card>
  );
}
