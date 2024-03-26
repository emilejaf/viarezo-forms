import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteFormAction } from "../../actions/form";
import { FormType, formTypeHelper } from "@/lib/types/form";

export default function DeleteForm(props: { id: string; type: FormType }) {

  const displayName = formTypeHelper[props.type].label.toLowerCase();

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Supprimer le { displayName }</CardTitle>
        <CardDescription>
          Supprime définitivement votre {displayName} ainsi que toutes ses
          réponses. Cette action est irréversible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DeleteDialog {...props} displayName={displayName} />
      </CardContent>
    </Card>
  );
}

function DeleteDialog({ id, type, displayName }: { id: string; type: FormType; displayName: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Supprimer</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Etês-vous vraiment sur ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Cela supprimera définitivement votre { displayName } et toutes ses réponses de nos serveurs.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <form action={deleteFormAction.bind(null, id, type)}>
            <AlertDialogAction variant="destructive" type="submit">
              Supprimer
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
