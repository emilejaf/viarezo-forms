import { AccessChildrenProps, LinkCSAsso } from "@/lib/types/access";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/icons";
import { Combobox } from "../../../../components/combobox";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import SubmitButton from "./submit-button";
import { getAsso, searchAssos } from "../../actions/external";

export default function AssoAccess({
  accessMeta,
  saveAccessMeta,
}: AccessChildrenProps) {
  const [asso, setAsso] = useState<LinkCSAsso | undefined>(undefined);

  const query = useQuery<LinkCSAsso | null>({
    queryKey: ["assos"],
    queryFn: () => (accessMeta ? getAsso(accessMeta) : null),
  });

  // Update asso when the query is resolved
  useEffect(() => {
    if (query.status == "success") {
      setAsso(query.data || undefined);
    }
  }, [query.data, query.status]);

  if (query.isLoading) {
    return <Spinner className="mx-auto size-6 animate-spin" />;
  }

  if (query.isError) {
    return <p>Erreur lors de la récupération de l&apos;association</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="asso">Nom de l&apos;asosciation</Label>
        <Combobox<LinkCSAsso>
          id="asso"
          labelFn={(item) =>
            item ? item.name : "Rechercher une association..."
          }
          valueFn={(item) => item.id.toString()}
          searchFn={searchAssos}
          onValueChange={(item) => {
            setAsso(item);
          }}
          value={asso}
        />
      </div>
      <SubmitButton onClick={() => saveAccessMeta(asso?.id.toString())} />
    </div>
  );
}
