import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useDebounce from "@/lib/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { AccessChildrenProps } from "@/lib/types/access";
import { useRef, useState } from "react";

export default function AdvancedAccess({
  accessMeta,
  saveAccessMeta,
}: AccessChildrenProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [valid, setValid] = useState<boolean | undefined>(true);

  const debouncedSave = useDebounce(saveAccessMeta);

  return (
    <div className="space-y-6">
      <p className="mb-2">Vous pouvez utiliser les fonction suivantes : </p>
      <ul>
        <li>
          <strong className="font-bold">ET(expression1, expression2)</strong>:
          accorde l&apos;accès si l&apos;utilisateur satisfait les deux
          expressions
        </li>
        <li>
          <strong className="font-bold">OU(expression1, expression2)</strong>:
          accorde l&apos;accès si l&apos;utilisateur satisfait une des deux
          expressions
        </li>
        <li>
          <strong className="font-bold">NOT(expression)</strong>: accorde
          l&apos;accès si l&apos;utilisateur ne satisfait pas l&apos;expression
        </li>
        <li>
          <strong className="font-bold">ALL</strong>: tous
        </li>
        <li>
          <strong className="font-bold">CS</strong>: élève à CentraleSupélec
        </li>
        <li>
          <strong className="font-bold">ASSO[id]</strong>: membre de l&apos;asso
          n°id (Recherche d&apos;id dans le champ ci-dessous)
        </li>
        <li>
          <strong className="font-bold">COTIZ[id]</strong>: cotisant pour la
          cotisation n°id (Recherche d&apos;id dans le champ ci-dessous)
        </li>
        <li>
          <strong className="font-bold">PROMO[annee]</strong>: membre de la
          promo annee (ex: PROMO[2020])
        </li>
      </ul>

      <p className="mt-2">
        Voici, par exemple, une expression qui accepte les membres de ViaRézo de
        la P2023, ou, n&apos;importe quel membre de la P2024 :
        OU(ET(PROMO[2023], ASSO[1569]), PROMO[2024])
      </p>

      <div className="space-y-6">
        <div className="space-y-2">
          <Textarea
            name="advanced"
            ref={textAreaRef}
            defaultValue={accessMeta || ""}
            onInput={(e) => {
              const value = e.currentTarget.value;
              debouncedSave(value);
            }}
            className={cn("w-full h-32 -lg", {
              "border-destructive": !valid,
            })}
            placeholder="Expression de la condition d'accès"
            autoCorrect="off"
            spellCheck="false"
          />
          {!valid && (
            <p className="text-[0.8rem] text-muted-foreground">
              Expression incorrecte
            </p>
          )}
        </div>
        <Button
          onClick={() => {
            const expression = textAreaRef.current?.value;

            setValid(checkExpression(expression || ""));
          }}
        >
          Enregistrer l&apos;expression
        </Button>
      </div>
    </div>
  );
}
function checkExpression(str: string): boolean {
  str = str.replace(/\s/g, ""); // Remove all spaces

  if (str.startsWith("OU(") || str.startsWith("ET(")) {
    return str
      .slice(3, -1)
      .split(",")
      .map((slice) => checkExpression(slice))
      .every((slice) => slice);
  } else if (str.startsWith("NOT(")) {
    return checkExpression(str.slice(4, -1));
  } else {
    if (str.match(/^!.*/)) {
      return checkExpression(str.slice(1));
    }

    const parametersMatch = str.match(/^(ASSO|COTIZ|PROMO)\[([0-9]+)\]$/);

    if (parametersMatch) {
      return true;
    } else {
      const match = str.match(/^(ALL|CS)$/);

      return match !== null;
    }
  }
}
