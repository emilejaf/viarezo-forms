import APIErrorPage from "@/components/api-error-page";
import { Button } from "@/components/ui/button";
import { queryAPI } from "@/lib/api";
import { APIError } from "@/lib/exceptions";
import depaps from "./depaps";
import { redirect } from "next/navigation";
import Image from "next/image";
import QRCode from "qrcode";

import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getAnswerableForm } from "@/lib/form";
import { FormType, Paps } from "@/lib/types/form";
import { PapsAnswer } from "@/lib/types/answer";
import { getCurrentUser } from "@/app/auth/session";

export default async function SucessPage({
  params,
}: {
  params: { id: string };
}) {
  const paps = await getAnswerableForm<Paps>(FormType.PAPS, params.id);
  const data = await queryAPI<{ position: number; answer: PapsAnswer } | null>(
    `/paps/${params.id}/answer`,
    {
      next: { tags: [`paps/${params.id}`] },
    }
  );

  if (paps instanceof APIError) {
    return <APIErrorPage error={paps} />;
  }

  if (data instanceof APIError) {
    return <APIErrorPage error={data} />;
  }

  if (data == null) {
    return redirect(`/paps/${params.id}`);
  }

  const { position, answer } = data;

  const choice = paps.choices.find((v) => v.id == answer.papsChoiceId);

  if (!choice) {
    return "Invalid choice. Please contact the support.";
  }

  return (
    <>
      {position < choice.size ? (
        <Papsed position={position} papsId={params.id} />
      ) : (
        <h2 className="py-10 text-2xl tracking-tight">
          Vous êtes {position - choice.size + 1}
          {position == choice.size ? "er" : "ème"} dans la file d&apos;attente
        </h2>
      )}
      <form action={depaps.bind(null, params.id)}>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Depaps</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Etês-vous vraiment sur ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <form action={depaps.bind(null, params.id)}>
                <AlertDialogAction variant="destructive" type="submit">
                  Depaps
                </AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </>
  );
}

async function Papsed({
  position,
  papsId,
}: {
  position: number;
  papsId: string;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return "Vous n'êtes pas connecté. Veuillez vous connecter pour voir votre QR code.";
  }

  const qrcodeDataURL = await QRCode.toDataURL(user.login, {
    width: 500,
    maskPattern: 4,
    errorCorrectionLevel: "low",
  });

  return (
    <>
      <h2 className="text-2xl tracking-tight">
        Vous avez papsé ! Vous êtes {position + 1}
        {position === 0 ? "er" : "ème"}
      </h2>
      <Image src={qrcodeDataURL} alt="qrcode" width={250} height={250} />
    </>
  );
}
