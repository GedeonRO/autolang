import { Skeleton } from "@/components/ui/skeleton";
import { TableRow, TableCell } from "../ui/table";

export const TableLoadingSkeleton = ({ rowCount }: { rowCount: number }) => {
  return (
    <>
      <TableRow>
        {rowCount
          ? new Array(rowCount).fill(null).map((_, index) => (
              <TableCell className="font-medium py-4" key={index}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))
          : null}
      </TableRow>
    </>
  );
};
