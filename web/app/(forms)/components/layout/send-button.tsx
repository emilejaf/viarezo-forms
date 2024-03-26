"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

export function SendButton({ formURL }: { formURL: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="sm">
          Envoyer
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[520px]">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold">Envoyer le formulaire</h3>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Lien
            </Label>
            <Input id="link" defaultValue={formURL} readOnly className="h-9" />
          </div>
          <PopoverClose asChild>
            <Button
              type="submit"
              size="sm"
              className="px-3"
              onClick={() => {
                navigator.clipboard.writeText(formURL);
                toast("Lien copié dans le presse-papier");
              }}
            >
              <span className="sr-only">Copier</span>
              <CopyIcon className="size-4" />
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
