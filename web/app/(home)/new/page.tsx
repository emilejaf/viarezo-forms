import { FormHTMLAttributes } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createForm } from "./action";
import { FormType } from "@/lib/types/form";

export default function New() {
  const formTypes = [
    {
      name: "Formulaire",
      description:
        "Créez un nouveau formulaire et ajoutez-y des champs pour commencer à collecter des informations.",
      action: createForm.bind(null, FormType.FORM),
    },
    {
      name: "PAPS",
      description:
        "Les PAPS vous permettent de créer un formulaire avec un nombre de place fixé.",
      action: createForm.bind(null, FormType.PAPS),
    },
    {
      name: "Vote",
      description:
        "Les votes sécurisés permettent de créer un vote à destination d'un ensemble de votants (liste d'adresses mail).",
      action: createForm.bind(null, FormType.VOTE),
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Créer un formulaire</h2>
      <div className="flex flex-col gap-8 md:flex-row">
        {formTypes.map((formType, i) => (
          <NewFormCard
            key={i}
            name={formType.name}
            description={formType.description}
            action={formType.action}
          />
        ))}
      </div>
    </div>
  );
}

function NewFormCard({
  name,
  description,
  action,
}: {
  name: string;
  description: string;
  action: FormHTMLAttributes<HTMLFormElement>["action"];
}) {
  return (
    <Card className="flex flex-1 flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
      <CardFooter className="flex flex-1 items-end">
        <form action={action} className="w-full">
          <Button type="submit" className="w-full">
            Créer
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
