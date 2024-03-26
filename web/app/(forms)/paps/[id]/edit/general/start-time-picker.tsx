"use client";

import * as React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function StartTimePicker({ initialDate }: { initialDate: Date | null }) {
  const [date, setDate] = React.useState<Date | undefined>(
    initialDate || undefined,
  );
  const [time, setTime] = React.useState<string>(
    initialDate ? format(initialDate, "HH:mm") : "",
  );

  return (
    <>
      <div className="flex flex-row space-x-4">
        <div className="flex flex-1 flex-col space-y-2">
          <Label>Date de lancement du PAPS</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, "PPP", { locale: fr })
                ) : (
                  <span>Choisissez une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-1 flex-col space-y-2">
          <Label htmlFor="time">Heure de lancement</Label>
          <Input
            value={time}
            id="time"
            type="time"
            onInput={(e) => {
              setTime(e.currentTarget.value);
            }}
          />
        </div>
      </div>
      {date && (
        <input
          type="hidden"
          name="start"
          id="start"
          value={format(date, "yyyy-MM-dd") + (time ? `T${time}` : "")}
        />
      )}
    </>
  );
}
