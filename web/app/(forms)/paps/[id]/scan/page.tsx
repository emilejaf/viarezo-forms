import Scanner from "./scanner";

export default function ScanPaps({ params }: { params: { id: string } }) {
  return (
    <div className="flex space-y-6 container flex-col py-16 items-center">
      <Scanner
        id={params.id}
        className="max-w-96 max-h-96 object-cover aspect-square"
      />
    </div>
  );
}
