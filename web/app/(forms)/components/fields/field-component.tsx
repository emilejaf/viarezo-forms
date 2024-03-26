import { Field, FieldType } from "@/lib/types/field";
import { OptimisticField } from "./manage-fields";
import useDebounce from "@/lib/hooks/useDebounce";
import { DragHandle } from "@/components/draggable";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionProps, fieldTypes } from "./field-types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { startTransition } from "react";
import { Spinner } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export interface FieldProps {
  field: OptimisticField;
  updateField: (field: Partial<Field>) => void;
  deleteField: () => void;
}

export function FieldComponent({
  field,
  deleteField,
  updateField,
}: FieldProps) {
  const updateQuestion = useDebounce((question: string) =>
    updateField({ question })
  );

  const updateDescription = useDebounce((description: string) =>
    updateField({ description })
  );

  return (
    <Card className="flex flex-col sm:flex-row">
      <div className="flex items-center justify-center pt-2 sm:pt-0 sm:pl-2">
        <DragHandle />
      </div>
      <div className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <SelectFieldType field={field} updateField={updateField} />
            <div
              className={cn("flex-1 space-y-2", {
                hidden: field.type == "text",
              })}
            >
              <Label htmlFor={`${field.id}-question`}>Question</Label>
              <Input
                id={`${field.id}-question`}
                defaultValue={field.question}
                onChange={(e) => {
                  const value = e.target.value;
                  startTransition(() => {
                    updateQuestion(value);
                  });
                }}
              />
            </div>
          </div>
          <div
            className={cn("space-y-2", {
              hidden: field.type == "text",
            })}
          >
            <Label htmlFor={`${field.id}-description`}>Description</Label>
            <Input
              id={`${field.id}-description`}
              onChange={(e) => {
                updateDescription(e.target.value);
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          {fieldTypes[field.type].children({
            field,
            updateField,
          } as QuestionProps)}
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center justify-between">
            <div
              className={cn("flex", {
                invisible: !field.optimistic,
              })}
            >
              <Spinner className="text-muted-foreground sm:mr-2 animate-spin" />
              <span className="hidden sm:inline-block text-muted-foreground">
                Enregistrement...
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-6">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Label htmlFor={`${field.id}-required`}>Obligatoire</Label>
                <Switch
                  id={`${field.id}-required`}
                  checked={field.required}
                  onCheckedChange={(checked) =>
                    updateField({ required: checked })
                  }
                />
              </div>
              <Button variant="destructive" onClick={deleteField}>
                Supprimer
              </Button>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
function SelectFieldType({
  field,
  updateField,
}: {
  field: OptimisticField;
  updateField: (field: Partial<Field>) => void;
}) {
  return (
    <div className="flex-none space-y-2">
      <Label htmlFor={`${field.id}-fieldtype`}>Type de champs</Label>
      <Select
        value={field.type}
        onValueChange={(type) => {
          // the text field is the only one that doesn't have a question
          // and the question field is used in the text field to store the text
          const shouldResetQuestion = field.type == "text" && type != "text";

          const payload: Partial<Field> = {
            type: type as FieldType,
          };

          if (shouldResetQuestion) {
            payload.question = "";
          }
          updateField(payload);
        }}
        name={`${field.id}-fieldtype`}
      >
        <SelectTrigger className="sm:w-[180px]" id={`${field.id}-fieldtype`}>
          <SelectValue>{fieldTypes[field.type].displayName}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(fieldTypes).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value.displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
