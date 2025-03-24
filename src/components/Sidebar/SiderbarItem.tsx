import ExtIconsax from "@/types/icons";
import { PropsWithChildren } from "react";
import { Link } from "react-router";

const SidebarItem = ({
  title,
  path,
  Icon,
}: PropsWithChildren & {
  title: string;
  path: string;
  Icon: ExtIconsax.Icon;
}) => {
  const isSelected = location.pathname === path;
  return (
    <Link
      to={path}
      className={`flex hover:bg-primary/10 rounded-none items-center gap-3 px-3 py-3 transition-all hover:text-primary ${
        isSelected
          ? "font-semibold text-focus border-l-4 bg-primary/10 text-primary border-primary"
          : "text-muted-foreground border-l-4 border-transparent"
      }`}
    >
      <Icon variant={isSelected ? "Bulk" : "Linear"} size={22} />
      {title}
    </Link>
  );
};

export default SidebarItem;
