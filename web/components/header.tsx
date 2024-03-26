import { getCurrentUser } from "@/app/auth/session";
import { AvatarDropdown } from "./avatar-dropdown";
import MainNav from "./main-nav";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user && <AvatarDropdown user={user} />}
        </div>
      </div>
    </header>
  );
}
