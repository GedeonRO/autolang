import { BookType, Grip, Languages, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="flex flex-col h-[90svh] mt-[10svh] border-r  justify-between items-star px-[16px] py-[36px] w-[250px] bg-navbar-bg">
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 hover:bg-button py-2 px-4 rounded-md cursor-pointer">
          <Grip />
          <span>Overview</span>
        </div>
        <div className="flex gap-4 hover:bg-button py-2 px-4 rounded-md cursor-pointer">
          <BookType />
          <span>Translates</span>
        </div>
        <div className="flex gap-4 hover:bg-button py-2 px-4 rounded-md cursor-pointer">
          <Languages />
          <span>Languages</span>
        </div>
      </div>
      <div className="flex gap-4 hover:bg-button py-2 px-4 rounded-md cursor-pointer">
        <Settings />
        <span>Settings</span>
      </div>
    </div>
  );
}
