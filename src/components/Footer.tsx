import { Separator } from "./ui/separator";

export default function Footer() {
  return (
    <div className="flex h-[48px] w-full bg-slate-800 items-center justify-between fixed bottom-0 px-[24px] border-t">
      <div>
        <span className="text-xs">ⓒ 2024 Appwrite. All rights reserved.</span>
      </div>
      <div className="text-xs h-8 flex gap-2 items-center">
        <span>Version 1.0.1</span>
        <Separator orientation="vertical" />
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Terms</span>
        <Separator orientation="vertical" />
        <span>Privacy</span>
      </div>
    </div>
  );
}
