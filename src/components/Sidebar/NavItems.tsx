import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package2, Settings, LogOut, Contact } from "lucide-react";
import { AlertLogoutDialog } from "../auth/LogoutDialog";
import SidebarItem from "./SiderbarItem";
import ExtIconsax from "@/types/icons";

export function DesktopSidebar() {
  return (
    <div className="h-full flex flex-col">
      <nav className="flex-grow items-start px-2 text-sm font-medium lg:px-4 py-4">
        <SidebarItem Icon={ExtIconsax.Element4} path="/" title="Overview" />

        {location.pathname === "/" ? (
          <>
            <SidebarItem
              Icon={ExtIconsax.Setting3}
              path="/settings"
              title="App Settings"
            />
          </>
        ) : (
          <>
            <SidebarItem
              Icon={ExtIconsax.UserSquare}
              path="/contacts"
              title="My contacts"
            />
            <SidebarItem
              Icon={ExtIconsax.Folder2}
              path="/lists"
              title="My Lists"
            />
            <SidebarItem
              Icon={ExtIconsax.Setting3}
              path="/settings"
              title="App Settings"
            />
          </>
        )}
      </nav>

      <div className="text-base font-medium lg:px-4 py-4 cursor-pointer">
        <AlertLogoutDialog>
          <div
            className={`flex items-center gap-3 px-3 py-2 border border-red-500 text-red-600 transition-all hover:text-red-400 text-muted-foreground border-l-4`}>
            <ExtIconsax.Logout className="" size={26} />
            Logout
          </div>
        </AlertLogoutDialog>
      </div>
    </div>
  );
}

export function MobileNavBar() {
  return (
    <>
      <nav className="grid gap-2 text-lg font-medium">
        <Link to="#" className="flex items-center gap-2 text-lg font-semibold">
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Panel</span>
        </Link>
        <Link
          to="/"
          className={`flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-primary  ${
            location.pathname === "/"
              ? "font-semibold text-focus"
              : "text-muted-foreground"
          }`}>
          <Contact className="h-4 w-4" />
          Contact
        </Link>

        <Link
          to="/settings"
          className={`flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-primary  ${
            location.pathname === "/settings"
              ? "font-semibold text-focus"
              : "text-muted-foreground"
          }`}>
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </nav>
      <div className="mt-auto">
        <LogoutUI />
      </div>
    </>
  );
}

export function LogoutUI() {
  return (
    <AlertLogoutDialog>
      <Button size="lg" className="w-full">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </AlertLogoutDialog>
  );
}
