import { FieldSummaryProps } from "../../../components/answers/summary";

export default function SummaryShortQuestion({ answers }: FieldSummaryProps) {
  return (
    <div className="flex flex-col space-y-2">
      {answers
        .filter((a) => a?.data)
        .map((answer, index) => (
          <span key={index} className="bg-secondary rounded-md p-2">
            {answer?.data}
          </span>
        ))}
    </div>
  );
}
