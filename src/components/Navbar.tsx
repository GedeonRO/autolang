import { ChevronDown, Search } from "lucide-react";
import { ModeToggle } from "./Toggle-mode";
import { Separator } from "./ui/separator";
export default function Navbar() {
  return (
    <div className="flex w-full bg-navbar-bg items-center fixed top-0 px-5 h-[68px] justify-between  border-foreground border-b ">
      <div className="flex gap-4 items-center">
        <img className="size-8" src="yellow.png" alt="" />
        <span className="text-xl font-semibold">Autolang</span>
        <div className="flex gap-4 items-center">
          <div className="bg-button px-3 py-1 rounded-full">
            <span className="text-sm">BETA</span>
          </div>
          <span>/</span>
          <span>TEST</span>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <button className="bg-[#0C4185] hover:bg-[#0C4199] transition-all text-white ease-in-out duration-300 roboto-medium px-5 py-[10px] rounded-sm">
          <span>Upgrade</span>
        </button>
        <div className="flex gap-8 items-center ">
          <span className="cursor-pointer font-semibold">Feedback</span>
          <span className="cursor-pointer font-semibold">Support</span>
          <Search />
          <Separator
            className="bg-foreground h-[67px] w-[1px]"
            orientation="vertical"
          />
          <div className="flex gap-12 items-center cursor-pointer">
            <div className="flex gap-4 items-center">
              <div className="shrink-0 bg-slate-600 size-11 rounded-full flex items-center justify-center">
                <span className="roboto-medium text-xl">G</span>
              </div>
              <div className="flex flex-col  ">
                <span>Gedeon</span>
                <span>TEST</span>
              </div>
            </div>
            <ChevronDown size={15} />
          </div>

          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
