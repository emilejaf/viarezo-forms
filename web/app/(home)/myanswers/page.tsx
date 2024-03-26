import APIErrorPage from "@/components/api-error-page";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { queryAPI } from "@/lib/api";
import { APIError } from "@/lib/exceptions";
import { AbstractAnswer } from "@/lib/types/answer";
import { AbstractForm } from "@/lib/types/form";
import AnswerTableRow from "./answer-table-row";

export type AbstractAnswerWithForm = AbstractAnswer & { form: AbstractForm };

export default async function MyAnswersPage() {
  const answers = await queryAPI<AbstractAnswerWithForm[]>("/answers");

  if (answers instanceof APIError) {
    return <APIErrorPage error={answers} />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Mes réponses</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead className="text-right">Date de réponse</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {answers
              .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
              .map((answer) => (
                <AnswerTableRow key={answer.id} answer={answer} />
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
