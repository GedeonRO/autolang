import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CircleUser, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DesktopSidebar, MobileNavBar } from "@/components/Sidebar/NavItems";
import { AlertLogoutDialog } from "@/components/auth/LogoutDialog";
import { ModeToggle } from "../theme/modeToggle";
import { FirebaseAuth as auth } from "@/firebase/config";

import { ReactNode } from "react";
import { Badge } from "../ui/badge";
import { MoneyRecive } from "iconsax-react";
export const description =
  "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action.";

export function DashboardLayout({
  header,
  children,
  title,
}: {
  children: ReactNode;
  header?: ReactNode;
  title: string;
}) {
  const navigate = useNavigate();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) navigate("/auth/login");
    });
  }, [navigate]);

  return (
    <div className="grid h-screen overflow-hidden w-full max-w-screen md:grid-cols-[200px_1fr] dark:bg-inherit bg-gray-50 lg:grid-cols-[230px_1fr]">
      <div className="hidden bg-muted/40 md:block w-full relative border-r">
        <div className="flex h-full max-h-screen flex-col sticky top-0 left-0 bg-gray-50 dark:bg-inherit">
          <div className="flex py-4 items-center px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <h1 className="text-lg font-bold md:text-2xl text-primary">
                Autolang
              </h1>
            </Link>
          </div>
          <div className="h-full bg-gray-50 dark:bg-inherit">
            <DesktopSidebar />
          </div>
        </div>
      </div>
      <div className="flex-grow flex flex-col overflow-hidden">
        <div className="z-50 sticky top-0 bg-gray-50 dark:bg-inherit">
          {header ? (
            header
          ) : (
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                  <MobileNavBar />
                </SheetContent>
              </Sheet>
              <div className="w-full flex-1">
                <h4 className="text-lg font-medium md:text-xl">{title}</h4>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Badge
                  variant="outline"
                  className="flex items-center space-x-2 py-2 px-4"
                >
                  <div className="flex items-center space-x-1">
                    <MoneyRecive />
                    <span className="text-base font-light">Plan:</span>
                  </div>
                  <span className="font-medium text-base"> Monthly</span>
                </Badge>

                <ModeToggle />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full border"
                    >
                      <CircleUser className="h-5 w-5" />
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/settings"
                        className="flex items-center cursor-pointer"
                      >
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertLogoutDialog>
                      <DropdownMenuLabel className="cursor-pointer font-[500] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm">
                        Logout
                      </DropdownMenuLabel>
                    </AlertLogoutDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
          )}
        </div>

        <main className="flex-grow overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
