import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface SelectIndexProps<T> {
  list: T[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export default function SelectIndex<T>({
  list,
  activeIndex,
  setActiveIndex,
}: SelectIndexProps<T>) {
  const [inputValue, setInputValue] = useState<string>(
    (activeIndex + 1).toString()
  );

  useEffect(() => {
    const value = parseInt(inputValue);
    if (!isNaN(value) && value >= 1 && value <= list.length) {
      setActiveIndex(value - 1);
    }
  }, [inputValue, list, setActiveIndex]);

  useEffect(() => {
    setInputValue((activeIndex + 1).toString());
  }, [activeIndex]);

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => setActiveIndex(activeIndex - 1)}
        disabled={activeIndex === 0}
        size="icon"
        variant="ghost"
      >
        <ChevronLeft />
      </Button>
      <Input
        id="select-index"
        className="max-w-[40px]"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        inputMode="numeric"
      />
      <span>sur {list.length}</span>
      <Button
        onClick={() => setActiveIndex(activeIndex + 1)}
        disabled={activeIndex === list.length - 1}
        size="icon"
        variant="ghost"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
