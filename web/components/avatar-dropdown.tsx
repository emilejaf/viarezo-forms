"use client";
import { User } from "@/app/auth/session";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { AvatarIcon } from "@radix-ui/react-icons";

interface ThemeProps {
  theme?: string;
  toggleTheme: () => void;
}

export function AvatarDropdown({ user }: { user?: User }) {
  const { setTheme, theme } = useTheme();

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return user ? (
    <UserDropdown user={user} themeProps={{ theme, toggleTheme }} />
  ) : (
    <GuestDropdown theme={theme} toggleTheme={toggleTheme} />
  );
}

function UserDropdown({
  user,
  themeProps: { theme, toggleTheme },
}: {
  user: User;
  themeProps: ThemeProps;
}) {
  const userName = user.firstName + " " + user.lastName;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-8 rounded-full">
          <Avatar className="size-9">
            <AvatarImage src={user.photo} alt={userName} />
            <AvatarFallback>
              {user.firstName[0] + user.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium leading-none">{userName} </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleTheme}>
          {theme === "dark" ? "Thème clair" : "Thème sombre"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => window.location.assign("/auth/logout")}
        >
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function GuestDropdown({ theme, toggleTheme }: ThemeProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-8 rounded-full">
          <Avatar className="size-9">
            <AvatarIcon />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem onClick={toggleTheme}>
          {theme === "dark" ? "Thème clair" : "Thème sombre"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.location.assign("/auth/login")}>
          Se connecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
