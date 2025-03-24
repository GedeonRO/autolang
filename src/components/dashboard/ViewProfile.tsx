/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { timestampToDate } from "@/lib/utils";

interface PostType {
  timestamp?: any;
  url: string;
  data: {
    latest_comments?: any;
    views?: any;
    username?: string;
    email?: string;
    location?: string;
    company?: string;
    title?: string;
  };
}

export function ViewProfile({
  children,
  url,
}: {
  children: ReactNode;
  url: PostType;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="lg:max-w-[980px] max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{url?.data.username}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 w-full">
          <div className="flex gap-5 items-center w-full">
            <div className="space-y-3 flex flex-col w-full">
              <div className="font-bold text-[1rem]">Date </div>
              <span className="text-muted-foreground">
                {url && url?.timestamp && timestampToDate(url?.timestamp)}
              </span>
            </div>
            <div className="space-y-3 flex flex-col w-full">
              <div className="font-bold text-[1rem]">email</div>
              <span className="text-muted-foreground">{url?.data.email}</span>
            </div>
          </div>
          <div className="flex gap-5 items-center w-full">
            <div className="space-y-3 flex flex-col w-full">
              <div className="font-bold text-[1rem]">Location</div>
              <span className="text-muted-foreground">
                {url?.data.location}
              </span>
            </div>
            <div className="space-y-3 flex flex-col w-full">
              <div className="font-bold text-[1rem]">Company</div>
              <span className="text-muted-foreground">
                {url?.data.company ? url?.data.company : "N/A"}
              </span>
            </div>
          </div>
          <div className="flex gap-5 items-center w-full">
            <div className="space-y-3 flex flex-col relative w-full">
              <div className="font-bold text-[1rem]">Url</div>
              <div className="absolute inset-0 pt-6 flex items-center">
                <span className="truncate block w-full">
                  <a
                    href={url?.url}
                    className="text-muted-foreground"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {url?.url}
                  </a>
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 mt-3 w-full">
            <div className="space-y-3 flex flex-col w-full">
              <div className="font-bold  text-[1rem]">Title</div>
              <span className="text-muted-foreground">{url?.data.title}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
