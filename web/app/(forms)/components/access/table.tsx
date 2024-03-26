import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X } from "lucide-react";

export default function AccessTable<T>({
  header,
  items,
  removeItem,
  labelFn,
}: {
  header: string;
  items: T[];
  removeItem: (item: T) => void;
  labelFn: (item: T) => string;
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full">{ header }</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={labelFn(item)}>
              <TableCell className="px-4 py-2">{labelFn(item)}</TableCell>
              <TableCell className="px-4 py-2">
                <Button variant="ghost" className="group size-8 p-0">
                  <X
                    className="size-4 group-hover:text-destructive"
                    onClick={() => removeItem(item)}
                  />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
