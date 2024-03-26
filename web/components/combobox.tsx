import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { CommandLoading } from "cmdk";
import { Spinner } from "@/components/icons";
import { debounce } from "@/lib/hooks/useDebounce";

export function Combobox<T>({
  value,
  onValueChange,
  searchFn,
  labelFn,
  valueFn,
  ...props
}: {
  value: T | undefined;
  onValueChange: (item: T) => void;
  searchFn: (search: string) => Promise<T[]> | T[];
  labelFn: (item: T | undefined) => string;
  valueFn: (item: T) => string;
} & React.HTMLAttributes<HTMLButtonElement>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateItems = useCallback(
    debounce(async (query: string) => {
      const items = await searchFn(query);
      setItems(items);
      setLoading(false);
    }, 250),
    [searchFn]
  );

  useEffect(() => {
    setLoading(true);
    debouncedUpdateItems(search);
  }, [search, debouncedUpdateItems]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="sm:w-[300px] justify-between"
          {...props}
        >
          {labelFn(value)}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="sm:w-[300px] p-0" avoidCollisions={false}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Rechercher un accés..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandGroup>
            {loading ? (
              <CommandLoading>
                <Spinner className="mx-auto my-2 size-4 animate-spin" />
              </CommandLoading>
            ) : (
              items.map((item) => (
                <CommandItem
                  key={valueFn(item)}
                  value={valueFn(item)}
                  onSelect={() => {
                    onValueChange(item);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value && valueFn(value) === valueFn(item)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {labelFn(item)}
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
