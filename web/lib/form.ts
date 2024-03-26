import { AbstractForm, FormType, formTypeHelper } from "./types/form";
import { queryAPI } from "./api";
import { APIError } from "./exceptions";
import { getCurrentUser } from "@/app/auth/session";
import { redirect } from "next/navigation";

export function getEditableForm<T extends AbstractForm>(
  type: FormType,
  id: string,
) {
  return queryAPI<T>(`/${formTypeHelper[type].url}/${id}/edit`, {
    next: { tags: [id] },
  });
}

// L'answerable form est un formulaire contenant uniquement les champs publics (par exemple: access_meta ne doit pas être présent car peut contenir des informations sensibles)
export async function getAnswerableForm<T extends AbstractForm>(
  type: FormType,
  id: string,
) {
  const result = await queryAPI<T>(`/${formTypeHelper[type].url}/${id}`, {
    next: { tags: [id] },
  });

  // si l'erreur est une erreur d'authentification, on redirige l'utilisateur vers la page de login
  // on le vérifie qu'ici car c'est le seul endroit où le middleware n'a pas vérifié l'authentification de l'utilisateur étant donné que certains formulaires peuvent être accessibles sans être connecté
  if (result instanceof APIError) {
    const user = await getCurrentUser();
    if (result.statusCode === 403 && user == undefined) {
      redirect("/auth/login");
    }
  }

  return result;
}
