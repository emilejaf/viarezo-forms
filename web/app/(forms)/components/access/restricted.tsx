import { AccessChildrenProps, LinkCSUser } from "@/lib/types/access";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Combobox } from "../../../../components/combobox";
import { Label } from "@/components/ui/label";
import AccessTable from "./table";
import { getUsers, searchUsers } from "../../actions/external";

export default function RestrictedAccess({
  accessMeta,
  saveAccessMeta,
}: AccessChildrenProps) {
  const initialUsersIds: string[] = accessMeta ? JSON.parse(accessMeta) : [];

  const [users, setUsers] = useState<LinkCSUser[]>([]);

  const query = useQuery<LinkCSUser[]>({
    queryKey: ["restricted-users"],
    queryFn: () =>
      initialUsersIds.length > 0 ? getUsers(initialUsersIds) : [],
  });

  useEffect(() => {
    if (query.status == "success") {
      setUsers(query.data);
    }
  }, [query.data, query.status]);

  if (query.isLoading) {
    return <Spinner className="mx-auto size-6 animate-spin" />;
  }

  if (query.isError) {
    return <p>Erreur lors de la récupération des utilisateurs</p>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <RestrictedCombobox
          addUser={(user) => {
            if (users.find((u) => u.login == user.login)) {
              return;
            }

            const newUsers = [...users, user];
            setUsers(newUsers);
            saveAccessMeta(JSON.stringify(newUsers.map((user) => user.login)));
          }}
        />
      </div>
      {users.length > 0 && (
        <div className="space-y-2">
          <AccessTable
            header="Utilisateurs autorisés"
            labelFn={(item) => item.firstName + " " + item.lastName}
            items={users}
            removeItem={(user) => {
              const newUsers = users.filter((u) => u.login != user.login);
              setUsers(newUsers);
              saveAccessMeta(
                JSON.stringify(newUsers.map((user) => user.login))
              );
            }}
          />
        </div>
      )}
    </div>
  );
}

function RestrictedCombobox({
  addUser,
}: {
  addUser: (user: LinkCSUser) => void;
}) {
  const [newUser, setNewUser] = useState<LinkCSUser | undefined>(undefined);

  return (
    <div className="space-y-2">
      <Label htmlFor="restricted">Ajouter un utilisateur</Label>
      <div className="space-x-2">
        <Combobox<LinkCSUser>
          id="restricted"
          labelFn={(item) =>
            item
              ? item.firstName + " " + item.lastName
              : "Rechercher un utilisateur..."
          }
          searchFn={searchUsers}
          valueFn={(item) => item.login}
          onValueChange={setNewUser}
          value={newUser}
        />
        <Button
          onClick={() => {
            if (newUser) {
              addUser(newUser);
              setNewUser(undefined);
            }
          }}
        >
          Ajouter l&apos;utilisateur
        </Button>
      </div>
    </div>
  );
}
