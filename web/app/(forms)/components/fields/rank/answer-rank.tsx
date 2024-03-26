"use client";

import {
  Draggable,
  DraggableItem,
  defaultReorder,
} from "@/components/draggable";
import { FieldWithChoices } from "@/lib/types/field";
import { useState } from "react";

export function AnswerRankQuestion({
  field,
  answer,
}: {
  field: FieldWithChoices;
  answer?: string | null;
}) {
  if (answer === undefined) {
    return ReorderableAnswerRankQuestion({ field });
  } else {
    if (answer === null) return DisabledAnswerRankQuestion({ answer: null });

    try {
      const parsedAnswer = JSON.parse(answer);
      if (Array.isArray(parsedAnswer)) {
        return DisabledAnswerRankQuestion({ answer: parsedAnswer });
      }
    } catch {
      return DisabledAnswerRankQuestion({ answer: null });
    }
  }
}

function ReorderableAnswerRankQuestion({ field }: { field: FieldWithChoices }) {
  const [rank, setRank] = useState<string[]>(field.choices.map((c) => c.data));

  return (
    <>
      <Draggable
        reorder={(from, to) => setRank(defaultReorder([...rank], from, to))}
      >
        <ul className="space-y-2">
          {rank.map((value, index) => (
            <DraggableItem key={index} index={index} useDragHandle={false}>
              <li className="bg-secondary rounded-md p-2">
                {index + 1} - {value}
              </li>
            </DraggableItem>
          ))}
        </ul>
      </Draggable>
      <input type="hidden" name={field.id} value={JSON.stringify(rank)} />
    </>
  );
}

function DisabledAnswerRankQuestion({ answer }: { answer: string[] | null }) {
  if (answer === null) return <p>Pas de réponse</p>;

  return (
    <ul className="space-y-2">
      {answer.map((value, index) => (
        <li key={index} className="bg-secondary rounded-md p-2">
          {index + 1} - {value}
        </li>
      ))}
    </ul>
  );
}
