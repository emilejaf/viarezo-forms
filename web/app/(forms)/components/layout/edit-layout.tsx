import { FormType } from "@/lib/types/form";
import { EditNav } from "./edit-nav";
import { navItems } from "./edit-nav-items";

export default async function EditLayout({
  children,
  type,
}: {
  children: React.ReactNode;
  type: FormType;
}) {
  return (
    <div className="container flex flex-col py-8 lg:py-16 lg:flex-row">
      <div className="sm:hidden">
        <EditNav
          items={Object.values(navItems[type])}
          className="flex flex-col"
        />
      </div>
      <aside className="hidden sm:block space-y-4 self-start lg:sticky lg:top-20 lg:w-1/6">
        <EditNav
          items={Object.values(navItems[type])}
          className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1"
        />
      </aside>
      <div className="py-8 lg:py-0 lg:px-12 flex-1">{children}</div>
    </div>
  );
}
