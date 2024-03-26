export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container py-16">{children}</div>;
}
