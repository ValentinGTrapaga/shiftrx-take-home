import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function ShiftCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          <div className="flex flex-row gap-2 items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-20" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex-1 flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-center">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex flex-col flex-1 gap-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex flex-col flex-1 gap-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex flex-col flex-1 gap-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Separator />
        <div className="flex items-end justify-end gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
