import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PropsWithChildren } from "react";

export function ContactDetailSheet({
  children,
  contact,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
PropsWithChildren & { contact: any }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="line-clamp-2 truncate">
            {contact?.username}
          </SheetTitle>
          <SheetDescription className="text-base">
            {contact?.title}
          </SheetDescription>
          <SheetDescription className="text-sm">
            {contact?.location}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow grid gap-4 py-4"></div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
