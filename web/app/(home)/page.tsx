import { queryAPI } from "@/lib/api";
import { AbstractForm } from "@/lib/types/form";
import DataTable from "./data-table";
import { APIError } from "@/lib/exceptions";
import APIErrorPage from "@/components/api-error-page";
import { User, getCurrentUser } from "../auth/session";

export default async function Home() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Formulaires</h2>
      <FormsPreview />
    </div>
  );
}

async function FormsPreview() {
  const forms = await queryAPI<AbstractForm[]>("/");

  if (forms instanceof APIError) {
    return <APIErrorPage error={forms} />;
  }

  const currentUser = (await getCurrentUser()) as User;

  return (
    <DataTable
      appURL={process.env.WEB_URL}
      data={forms}
      currentUserLogin={currentUser.login}
    />
  );
}
