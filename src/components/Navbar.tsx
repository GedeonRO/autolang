import { ModeToggle } from "./Toggle-mode";
export default function Navbar() {
  return (
    <div className="flex w-full items-center px-5 py-4 justify-between  border-foreground border-b">
      <span>Autolang</span>
      <ModeToggle />
    </div>
  );
}
