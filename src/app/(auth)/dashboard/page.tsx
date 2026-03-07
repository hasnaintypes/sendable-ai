import { Toaster } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const Page = async () => {
  return (
    <div className="flex-1 space-y-4 p-8">
      {/* Header Section */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-[280px]" />
        <Skeleton className="h-5 w-[420px]" />
      </div>

      {/* Main Content Skeletons */}
      <div className="space-y-4 pt-4">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <Skeleton className="h-[240px] w-full rounded-lg" />
        <Skeleton className="h-[180px] w-full rounded-lg" />
      </div>

      <Toaster />
    </div>
  );
};

export default Page;
