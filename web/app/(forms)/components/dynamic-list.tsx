import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDebounce from "@/lib/hooks/useDebounce";
import { Choice, FieldWithChoices } from "@/lib/types/field";
import { DeepPartial } from "@/lib/types/form";
import { X } from "lucide-react";
import { startTransition, useOptimistic } from "react";

export default function DynamicList({
  initialItems,
  updateField,
  children,
}: {
  initialItems: Choice[];
  updateField: (items: DeepPartial<FieldWithChoices>) => void;
  children?: React.ReactNode;
}) {
  const [choices, setChoices] = useOptimistic<Choice[], Choice[]>(
    initialItems,
    (state, action) => action
  );

  function newChoice() {
    startTransition(() => {
      const choice = { data: "", id: Math.random() };

      updateField({
        choices: [
          ...choices.map((c) => ({
            id: c.id,
          })),
          { ...choice, id: undefined },
        ],
      });

      setChoices([...choices, choice]);
    });
  }

  function updateChoice(partialChoice: Partial<Choice>, initialChoice: Choice) {
    startTransition(() => {
      updateField({
        choices: [
          ...choices.map((c) =>
            c.id === initialChoice.id
              ? { ...partialChoice, id: initialChoice.id }
              : { id: c.id }
          ),
        ],
      });

      const newChoices = choices.map((c) =>
        c.id === initialChoice.id ? { ...initialChoice, ...partialChoice } : c
      );

      setChoices(newChoices);
    });
  }

  function deleteChoice(choiceId: number) {
    startTransition(() => {
      const newChoices = [...choices].filter((c) => c.id !== choiceId);
      updateField({
        choices: newChoices.map((c) => ({
          id: c.id,
        })),
      });
      setChoices(newChoices);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <Button variant="outline" onClick={newChoice}>
          Ajouter une option
        </Button>
        {children}
      </div>
      <ul className="space-y-2">
        {choices.map((item, index) => (
          <Item
            key={index}
            item={item}
            index={index}
            updateItem={(updatedChoice) => updateChoice(updatedChoice, item)}
            deleteItem={() => deleteChoice(item.id)}
          />
        ))}
      </ul>
    </div>
  );
}

function Item({
  item,
  index,
  updateItem,
  deleteItem,
}: {
  item: Choice;
  index: number;
  updateItem: (item: Partial<Choice>) => void;
  deleteItem: () => void;
}) {
  const debouncedUpdateData = useDebounce((data: string) => {
    updateItem({ data });
  });

  return (
    <li className="flex items-center space-x-2">
      <Input
        id={`choice-${item.id}`}
        placeholder={`Option ${index + 1}`}
        defaultValue={item.data}
        onChange={(e) => {
          const value = e.currentTarget.value;
          startTransition(() => {
            debouncedUpdateData(value);
          });
        }}
      />
      <Button variant="secondary" className="group" onClick={deleteItem}>
        <X className="group-hover:text-destructive size-4" />
      </Button>
    </li>
  );
}
