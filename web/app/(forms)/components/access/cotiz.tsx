import { AccessChildrenProps, CotizAsso } from "@/lib/types/access";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/icons";
import { Combobox } from "../../../../components/combobox";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import SubmitButton from "./submit-button";
import { getCotizAssos } from "../../actions/external";

export default function CotizAccess({
  accessMeta,
  saveAccessMeta,
}: AccessChildrenProps) {
  const query = useQuery<CotizAsso[]>({
    queryKey: ["cotiz"],
    queryFn: () => getCotizAssos(),
  });

  const [selectedCotiz, setSelectedCotiz] = useState<CotizAsso | undefined>(
    undefined
  );

  useEffect(() => {
    if (query.status == "success" && accessMeta) {
      setSelectedCotiz(query.data?.find((a) => a.id == parseInt(accessMeta)));
    }
  }, [query.data, query.status, accessMeta]);

  if (query.isLoading) {
    return <Spinner className="mx-auto size-6 animate-spin" />;
  }

  if (query.isError) {
    return <p>Erreur lors de la récupération des cotiz</p>;
  }

  const cotiz = query.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="cotiz">Nom de la cotisation</Label>
        <Combobox<CotizAsso>
          id="cotiz"
          labelFn={(item) => (item ? item.name : "Rechercher une cotiz...")}
          valueFn={(item) => item.id.toString()}
          searchFn={(query) =>
            cotiz
              ? cotiz
                  .filter((a) =>
                    a.name.toLowerCase().includes(query.toLowerCase().trim())
                  )
                  .filter((v, i) => i < 5)
              : []
          }
          onValueChange={setSelectedCotiz}
          value={selectedCotiz}
        />
      </div>
      <SubmitButton
        onClick={() => saveAccessMeta(selectedCotiz?.id.toString())}
      />
    </div>
  );
}
