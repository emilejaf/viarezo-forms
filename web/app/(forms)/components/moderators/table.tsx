import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LinkCSUser } from "@/lib/types/access";
import { X } from "lucide-react";

export default function ModeratorsTable({
  moderators,
  removeModerator,
}: {
  moderators: LinkCSUser[];
  removeModerator: (moderator: LinkCSUser) => void;
}) {
  return (
    moderators.length > 0 && (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-full">Nom</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {moderators
              .sort((a, b) => a.login.localeCompare(b.login))
              .map((moderator) => (
                <TableRow key={moderator.login}>
                  <TableCell className="px-4 py-2">
                    {moderator.firstName + " " + moderator.lastName}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Button variant="ghost" className="group size-8 p-0">
                      <X
                        className="size-4 group-hover:text-destructive"
                        onClick={() => removeModerator(moderator)}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    )
  );
}
