import RichTextEditor from "@/components/rich-text";
import { Suspense } from "react";
import useDebounce from "@/lib/hooks/useDebounce";
import { TextField } from "@/lib/types/field";

export interface TextProps {
  field: TextField;
  updateField: (field: Partial<TextField>) => void;
}

export function EditText({ field, updateField }: TextProps) {
  const updateData = useDebounce((data: string) => updateField({ data: data }));

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium leading-none">Texte</h4>
      <Suspense fallback={"test"}>
        <RichTextEditor
          id={`${field.id}-text`}
          value={field.data}
          onChange={updateData}
        />
      </Suspense>
    </div>
  );
}
