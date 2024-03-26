"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { AbstractAnswerWithForm } from "./page";
import { formatDate } from "@/lib/utils";
import { formTypeHelper } from "@/lib/types/form";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function AnswerTableRow({
  answer,
}: {
  answer: AbstractAnswerWithForm;
}) {
  const router = useRouter();

  const typeLabel = formTypeHelper[answer.form.type].label;

  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => {
        router.push(
          `/${formTypeHelper[answer.form.type].url}/${answer.form.id}/success`
        );
      }}
    >
      <TableCell>
        <div className="flex space-x-2 lg:min-w-[500px]">
          <Badge variant="outline">{typeLabel}</Badge>
          <span className="max-w-[500px] truncate font-medium">
            {answer.form.title}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        {formatDate(new Date(answer.createdAt))}
      </TableCell>
    </TableRow>
  );
}
