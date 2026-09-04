import { Skeleton, SkeletonBlock } from "@/components/ui/Skeleton";

export default function QrLoading() {
  return (
    <div>
      <div className="mb-6 border-b border-border pb-5">
        <Skeleton variant="text" height="h-2" width="w-16" className="mb-2" />
        <Skeleton variant="title" className="mb-2" />
        <Skeleton variant="text" width="w-72" />
      </div>

      <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <SkeletonBlock className="mx-auto mb-5 h-64 w-64 rounded-2xl" />
        <Skeleton variant="text" width="w-32" className="mx-auto mb-1" />
        <Skeleton variant="title" width="w-48" className="mx-auto mb-4" />
        <SkeletonBlock className="mx-auto mb-5 h-8 w-full max-w-md rounded-xl" />
        <SkeletonBlock className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}