import EditLayout from "@/app/(forms)/components/layout/edit-layout";
import { FormType } from "@/lib/types/form";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <EditLayout type={FormType.VOTE}>{children}</EditLayout>;
}
