import { APIError } from "@/lib/exceptions";

export default function APIErrorPage({ error }: { error: APIError }) {
  const statusErrors = [403, 404];

  if (!statusErrors.includes(error.statusCode)) {
    throw error;
  }

  return (
    <div className="container max-w-screen-lg space-y-6 p-10">
      <h2 className="text-2xl font-bold tracking-tight">Erreur</h2>
      <p className="text-muted-foreground">
        {error.statusCode == 403 && "Accès non autorisé"}
        {error.statusCode == 404 && "Formulaire introuvable"}
      </p>
    </div>
  );
}
