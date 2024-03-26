import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormType, formTypeHelper } from "@/lib/types/form";
import Link from "next/link";
import { navItems } from "./edit-nav-items";
import { SendButton } from "./send-button";

export default function EditHeader({
  children,
  title,
  id,
  type,
}: {
  title: keyof (typeof navItems)[FormType];
  type: FormType;
  id: string;
  children?: React.ReactNode;
}) {
  const formHref = `/${formTypeHelper[type].url}/${id}`;

  return (
    <>
      <div className="flex justify-between ">
        <h3 className="text-2xl font-medium">{navItems[type][title].title} </h3>
        <div className="flex justify-end space-x-2">
          {children}
          <Button variant="secondary" size="sm">
            <Link href={formHref} target="_blank">
              Aperçu
            </Link>
          </Button>
          <SendButton formURL={process.env.WEB_URL + formHref} />
        </div>
      </div>
      <Separator />
    </>
  );
}
