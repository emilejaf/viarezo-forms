import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FieldSummaryProps } from "../../../components/answers/summary";
import { FieldAnswer } from "@/lib/types/answer";
import { SliderField } from "@/lib/types/field";

function processAnswers({
  field,
  answers,
}: FieldSummaryProps): { name: string; value: number }[] {
  const counts: Record<number, number> = {};

  const sliderField = field as SliderField;

  for (
    let x = sliderField.min || 0;
    x < (sliderField.max || 10);
    x = x + (sliderField.step || 1)
  ) {
    counts[x] = 0;
  }

  function addData(data: number) {
    if (counts[data] !== undefined) {
      counts[data] = counts[data] + 1;
    }
  }
  answers.forEach((a) => {
    if (a) {
      try {
        const data = JSON.parse(a.data);
        if (typeof data === "number") {
          addData(data);
        }
      } catch {}
    }
  });

  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export default function SummarySlider(props: FieldSummaryProps) {
  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={processAnswers(props)}>
          <Bar dataKey="value" fill="#8884d8" isAnimationActive={false} />
          <XAxis dataKey="name" />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background rounded-lg border p-2 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground text-[0.70rem] uppercase">
                        Count
                      </span>
                      <span className="text-muted-foreground font-bold">
                        {payload[0].value}
                      </span>
                    </div>
                  </div>
                );
              }

              return null;
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
