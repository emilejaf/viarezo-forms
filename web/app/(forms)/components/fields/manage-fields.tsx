"use client";

import { startTransition, useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/lib/types/field";
import { Draggable, DraggableItem } from "@/components/draggable";
import { FieldComponent } from "./field-component";
import { DeepPartial, FormType } from "@/lib/types/form";
import { updateFormAction } from "../../actions/form";

export type OptimisticField = Field & { optimistic?: boolean };

function reorderFields(l: OptimisticField[], start: number, end: number) {
  if (start < end) {
    const temp = l[start];

    for (let i = start; i < end; i++) {
      l[i] = l[i + 1];
      l[i].index = i;
    }
    l[end] = temp;
    l[end].index = end;
  } else if (start > end) {
    const temp = l[start];

    for (let i = start; i > end; i--) {
      l[i] = l[i - 1];
      l[i].index = i;
    }

    l[end] = temp;
    l[end].index = end;
  }

  return l;
}

export default function ManageFields({
  id,
  formType,
  fields,
}: {
  id: string;
  formType: FormType;
  fields: Field[];
}) {
  const [optimisticFields, setOptimisticFields] = useOptimistic<
    OptimisticField[],
    OptimisticField[]
  >(
    fields.sort((a, b) => a.index - b.index),
    (state, action) => {
      return action.sort((a, b) => a.index - b.index);
    }
  );

  const updateForm = updateFormAction.bind(null, id, formType);

  function newField() {
    startTransition(() => {
      const field: Field = {
        id: Math.random().toString(),
        index: optimisticFields.length,
        question: "Nouveau champ",
        type: "shortq",
        required: false,
      };

      updateForm({
        fields: [
          ...optimisticFields.map((f) => ({
            id: f.id,
          })),
          // we must strip the dummy id from the field
          { ...field, id: undefined },
        ],
      });

      setOptimisticFields([...optimisticFields, field]);
    });
  }

  function updateField(
    partialField: DeepPartial<Field>,
    initialField: OptimisticField
  ) {
    startTransition(() => {
      updateForm({
        fields: [
          ...optimisticFields.map((f) =>
            f.id === initialField.id
              ? {
                  ...partialField,
                  type: partialField.type || initialField.type, // we must include the type because the backend does not know the type of the field
                  id: initialField.id,
                }
              : { id: f.id }
          ),
        ],
      });

      const field = { ...initialField, ...partialField, optimistic: true };

      const newState = optimisticFields.map((f) =>
        f.id === field.id ? field : f
      );
      setOptimisticFields(newState);
    });
  }

  function deleteField(fieldId: string) {
    startTransition(() => {
      let newState = optimisticFields.filter((f) => f.id !== fieldId);

      // we must reindex the fields
      newState = newState.map((f, index) => ({ ...f, index }));

      updateForm({
        fields: newState.map((f) => ({
          id: f.id,
        })),
      });

      setOptimisticFields(newState);
    });
  }

  function reorder(start: number, end: number) {
    startTransition(() => {
      const newFields = reorderFields([...optimisticFields], start, end);
      updateForm({ fields: newFields });
      setOptimisticFields(newFields);
    });
  }

  return (
    <div className="space-y-4">
      <Button onClick={newField}>Ajouter un champ</Button>
      <Draggable reorder={reorder}>
        <div className="space-y-4">
          {optimisticFields.map((field, index) => (
            <DraggableItem key={field.id} index={index}>
              <FieldComponent
                field={field}
                deleteField={() => deleteField(field.id)}
                updateField={(partialField) => updateField(partialField, field)}
              />
            </DraggableItem>
          ))}
        </div>
      </Draggable>
    </div>
  );
}
