"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavProps {
  items: {
    href: string;
    mobileHref?: string;
    title: string;
  }[];
  className?: string;
}

function isActive(
  href: string,
  pathname: string,
  mobileHref?: string
): boolean {
  return pathname == href || pathname == mobileHref;
}

export function EditNav({ items, className }: SidebarNavProps) {
  const pathname = usePathname();

  const baseEditPath = pathname.split("/").slice(0, 4).join("/");
  const endPath = "/" + pathname.split("/").slice(4).join("/");

  return (
    <nav className={className}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={baseEditPath + item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            isActive(item.href, endPath, item.mobileHref)
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start lg:pr-16"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
