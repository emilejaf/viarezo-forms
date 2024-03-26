import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AbstractForm } from "@/lib/types/form";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import Link from "next/link";

export function DataTableToolbar({ table }: { table: Table<AbstractForm> }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrer les formulaires..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="w-[200px] lg:w-[300px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="px-2 lg:px-3"
          >
            Réinitialiser
            <Cross2Icon className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <Button asChild>
        <Link href="/new">Nouveau</Link>
      </Button>
    </div>
  );
}
