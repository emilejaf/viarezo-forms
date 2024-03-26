import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import { FieldSummaryProps } from "../../../components/answers/summary";
import { FieldAnswer } from "@/lib/types/answer";

function processAnswers(
  answers: (FieldAnswer | undefined)[]
): { name: string; value: number }[] {
  const counts: Record<string, number> = {};

  function addData(data: string) {
    if (counts[data]) {
      counts[data] += 1;
    } else {
      counts[data] = 1;
    }
  }

  answers.forEach((a) => {
    if (a) {
      try {
        const data = JSON.parse(a.data);
        if (Array.isArray(data)) {
          data.forEach(addData);
        } else {
          addData(data);
        }
      } catch (e) {
        addData(a.data);
      }
    }
  });

  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export default function SummaryMultipleChoiceQuestion({
  field,
  answers,
}: FieldSummaryProps) {
  // we need a color for each answer
  const processedAnswers = processAnswers(answers);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF1919",
    "#19FF19",
    "#1919FF",
    "#FF19FF",
    "#19FFFF",
  ];

  const total = processedAnswers.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={processedAnswers}
            dataKey="value"
            isAnimationActive={false}
            label={({ name, value }) =>
              `${name} (${((value / total) * 100).toFixed(2)}%)`
            }
          >
            {processedAnswers.map((entry, index) => (
              <Cell
                style={{ outline: "none" }}
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
