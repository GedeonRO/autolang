/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode, useState } from "react";

export function PickDate({
  children,
  setStart_date,
  setEnd_date,
  start_date,
  end_date,
}: {
  children: ReactNode;
  setStart_date: any;
  setEnd_date: any;
  start_date: any;
  end_date: any;
}) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const handleRowClick = () => {
    setDialogOpen(false);
    console.log(start_date, end_date)
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Date Range Picker</DialogTitle>
          <DialogDescription>Enter start and end date</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Start date
            </Label>
            <Input
              id="name"
              value={start_date}
              onChange={(e) => setStart_date(e.target.value)}
              placeholder="mm-dd-yyyy"
              className="col-span-3"
              type="date"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              End date
            </Label>
            <Input
              id="username"
              value={end_date}
              onChange={(e) => setEnd_date(e.target.value)}
              placeholder="mm-dd-yyyy"
              className="col-span-3"
              type="date"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => handleRowClick()}>
            Save date
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
