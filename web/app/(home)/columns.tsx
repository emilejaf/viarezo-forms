"use client";

import { Badge } from "@/components/ui/badge";
import { AbstractForm, formTypeHelper } from "@/lib/types/form";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { formatDate } from "@/lib/utils";

export const columns: (appURL: string) => ColumnDef<AbstractForm>[] = (
  appUrl
) => [
  {
    accessorKey: "title",
    header: "Titre",
    cell: ({ row }) => {
      const typeLabel = formTypeHelper[row.original.type].label;

      return (
        <div className="flex space-x-2 lg:min-w-[500px]">
          <Badge variant="outline">{typeLabel}</Badge>
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (form) =>
      form.owner === undefined
        ? "Erreur"
        : form.owner === null
          ? "Moi"
          : form.owner,
    header: "Propriétaire",
  },
  {
    accessorKey: "updatedAt",
    header: "Dernière modification",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));

      return formatDate(date);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions appURL={appUrl} row={row} />,
  },
];
