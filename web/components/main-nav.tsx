"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainNav() {
  const pathname = usePathname();

  const navLinks = [
    {
      name: "Formulaires",
      href: "/",
    },
    {
      name: "Créer",
      href: "/new",
    },
    {
      name: "Mes réponses",
      href: "/myanswers",
    },
  ];

  return (
    <div className="flex">
      <Link href="/" className="hidden sm:flex mr-6 items-center">
        <ViarezoIcon className="fill-foreground size-10" />
        <span className="font-bold">Forms</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === link.href ? "text-foreground" : "text-foreground/60"
            )}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function ViarezoIcon(props: React.HTMLAttributes<SVGSVGElement>) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="70 70 360 360"
      {...props}
    >
      <g id="Tree_logo">
        <g id="Logo">
          <g id="Pixels">
            <rect
              id="smallR_6_"
              x="287.988"
              y="378.71"
              width="10"
              height="10"
            />
            <rect id="mid_6_" x="217.949" y="359.519" width="13" height="13" />
            <rect
              id="smallL_6_"
              x="205.54"
              y="380.561"
              width="10"
              height="10"
            />
            <rect id="bigL_6_" x="234.742" y="381.639" width="16" height="16" />
            <rect
              id="smallM_6_"
              x="244.349"
              y="417.752"
              width="10"
              height="10"
            />
            <rect id="bigR_6_" x="261.85" y="392.768" width="16" height="16" />
          </g>
          <path
            id="Tree"
            d="M341.33,152.38c-8.82,0-16,7.18-16,16c0,7.45,5.11,13.71,12,15.5v30.24
					c0,3.32-2.13,8.48-4.48,10.83l-47.989,47.99h-17.71l-8.061-8.061v-7.87l44.79-44.79c2.92-2.92,5.12-8.23,5.12-12.36v-12.28
					c4.62-1.3,8-5.54,8-10.58c0-6.07-4.92-11-11-11s-11,4.93-11,11c0,5.04,3.38,9.28,8,10.58v12.28c0,2.49-1.6,6.36-3.36,8.12
					l-40.55,40.54v-53.7l25.79-25.79c2.92-2.92,5.12-8.23,5.12-12.36v-12.42c4.62-1.3,8-5.55,8-10.58c0-6.08-4.92-11-11-11
					s-11,4.92-11,11c0,5.03,3.38,9.28,8,10.58v12.42c0,2.49-1.6,6.36-3.36,8.12l-21.55,21.54v-68.12c6.9-1.78,12-8.05,12-15.49
					c0-8.82-7.17-16-16-16c-8.82,0-16,7.18-16,16c0,7.44,5.11,13.71,12,15.49v121.02l-10.23-10.22c-1.76-1.76-3.36-5.64-3.36-8.13
					v-73.61c0-4.13-2.2-9.45-5.12-12.37l-6.19-6.19c1.15-1.73,1.81-3.81,1.81-6.04c0-6.08-4.92-11-11-11c-6.07,0-11,4.92-11,11
					c0,6.07,4.93,11,11,11c1.66,0,3.23-0.37,4.64-1.02l6.5,6.5c1.76,1.76,3.36,5.63,3.36,8.12v73.61c0,4.13,2.2,9.45,5.12,12.37
					l14.47,14.46v17.18l-8.05,8.051H227.8l-8.06-8.061v-51.32c0-4.37-2.33-9.99-5.42-13.08l-1.65-1.65v-20.37
					c4.61-1.3,8-5.54,8-10.58c0-6.07-4.93-11-11-11c-6.08,0-11,4.93-11,11c0,5.04,3.38,9.28,8,10.58v14.37l-21.43-21.43
					c-1.58-1.58-3.07-5.18-3.07-7.41v-5c6.89-1.78,12-8.05,12-15.49c0-8.82-7.18-16-16-16c-8.83,0-16,7.18-16,16
					c0,7.44,5.1,13.71,12,15.49v5c0,4.36,2.32,9.98,5.41,13.07l29.09,29.08c1.58,1.58,3.07,5.18,3.07,7.42v53.66l-39.72-40.28
					c-1.76-1.78-3.35-5.67-3.35-8.17v-8.33c4.61-1.3,8-5.55,8-10.58c0-6.08-4.93-11-11-11c-6.08,0-11,4.92-11,11
					c0,5.03,3.38,9.28,8,10.58v8.33c0,4.12,2.18,9.44,5.07,12.38l58.35,59.17v57.62h18v12h17.96v12.29h18v-24.29h0.04V289.02
					l58.41-58.41c3.9-3.89,6.83-10.98,6.83-16.49v-30.24c6.9-1.79,12-8.05,12-15.5C357.33,159.56,350.16,152.38,341.33,152.38z
					 M178.17,152.5c-4.97,0-9-4.04-9-9s4.03-9,9-9c4.96,0,9,4.04,9,9S183.13,152.5,178.17,152.5z M246.09,102.72c0-4.96,4.04-9,9-9
					c4.97,0,9,4.04,9,9c0,4.96-4.03,9-9,9C250.13,111.72,246.09,107.68,246.09,102.72z M341.33,177.38c-4.96,0-9-4.03-9-9
					c0-4.96,4.04-9,9-9c4.97,0,9,4.04,9,9C350.33,173.35,346.3,177.38,341.33,177.38z"
          />
        </g>
      </g>
    </svg>
  );
}
