export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center items-center space-y-6 py-16">
      {children}
    </div>
  );
}
