"use client";

import { updateFormAction } from "@/app/(forms)/actions/form";
import { Spinner } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDebounce from "@/lib/hooks/useDebounce";
import { Paps, PapsChoice } from "@/lib/types/form";
import { cn } from "@/lib/utils";
import { startTransition, useOptimistic } from "react";

interface OptimisticPapsChoice extends PapsChoice {
  optimistic?: boolean;
}

export default function ManageChoices({ paps }: { paps: Paps }) {
  const [optimisticChoices, setOptimisticChoices] = useOptimistic<
    OptimisticPapsChoice[],
    OptimisticPapsChoice[]
  >(paps.choices, (state, newChoices) => newChoices);

  function addChoice() {
    startTransition(() => {
      const choice = {
        id: Math.random(),
        name: "",
        size: 0,
        optimistic: true,
        answersCount: 0,
      };

      updateFormAction<Paps>(paps.id, paps.type, {
        choices: [
          ...optimisticChoices.map((c) => ({ id: c.id })),
          // we must strip the dummy id from the field
          { ...choice, id: undefined },
        ],
      });

      setOptimisticChoices([...optimisticChoices, choice]);
    });
  }

  function updateChoice(
    partialChoice: Partial<PapsChoice>,
    initialChoice: PapsChoice
  ) {
    startTransition(() => {
      updateFormAction<Paps>(paps.id, paps.type, {
        choices: [
          ...optimisticChoices.map((c) =>
            c.id === initialChoice.id
              ? {
                  ...partialChoice,
                  id: initialChoice.id,
                }
              : { id: c.id }
          ),
        ],
      });

      const newChoice: OptimisticPapsChoice = {
        ...initialChoice,
        ...partialChoice,
        optimistic: true,
      };

      const newState = optimisticChoices.map((c) =>
        c.id === newChoice.id ? newChoice : c
      );

      setOptimisticChoices(newState);
    });
  }

  function deleteChoice(id: number) {
    startTransition(() => {
      const updatedChoices = optimisticChoices.filter(
        (choice) => choice.id !== id
      );
      updateFormAction<Paps>(paps.id, paps.type, {
        choices: updatedChoices.map((c) => ({ id: c.id })),
      });
      setOptimisticChoices(updatedChoices);
    });
  }

  return (
    <>
      <Button onClick={addChoice}>Ajouter un choix</Button>
      <div className="space-y-6">
        {optimisticChoices.map((choice, index) => (
          <Choice
            key={index}
            choice={choice}
            updateChoice={(partialChoice) =>
              updateChoice(partialChoice, choice)
            }
            deleteChoice={deleteChoice.bind(null, choice.id)}
            hideDelete={optimisticChoices.length == 1}
          />
        ))}
      </div>
    </>
  );
}

function Choice({
  choice,
  hideDelete,
  updateChoice,
  deleteChoice,
}: {
  choice: OptimisticPapsChoice;
  hideDelete?: boolean;
  updateChoice: (choice: Partial<PapsChoice>) => void;
  deleteChoice: () => void;
}) {
  const updateName = useDebounce((name: string) => updateChoice({ name }));

  const updateSize = useDebounce((size: number) => updateChoice({ size }));
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor={choice.id.toString() + "name"}>Nom</Label>
            <Input
              id={choice.id.toString() + "name"}
              name="choice-name"
              placeholder="Mon super choix"
              defaultValue={choice.name}
              onInput={(e) => updateName(e.currentTarget.value)}
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor={choice.id.toString() + "size"}>
              Nombre de place
            </Label>
            <Input
              id={choice.id.toString() + "size"}
              name="choice-size"
              defaultValue={choice.size}
              onInput={(e) => {
                const number = parseInt(e.currentTarget.value);
                if (!isNaN(number)) {
                  updateSize(number);
                }
              }}
            />
          </div>
        </div>
      </CardHeader>
      {!hideDelete && (
        <CardFooter>
          <div className="flex w-full items-center justify-between">
            <div
              className={cn("flex", {
                invisible: !choice.optimistic,
              })}
            >
              <Spinner className="text-muted-foreground mr-2 animate-spin" />
              <span className="text-muted-foreground">Enregistrement...</span>
            </div>
            <Button variant="destructive" onClick={deleteChoice}>
              Supprimer
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
