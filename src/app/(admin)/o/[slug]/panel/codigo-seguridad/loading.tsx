import { Skeleton, SkeletonBlock } from "@/components/ui/Skeleton";

export default function CodigoSeguridadLoading() {
  return (
    <div>
      <div className="mb-6 border-b border-border pb-5">
        <Skeleton variant="text" height="h-2" width="w-16" className="mb-2" />
        <Skeleton variant="title" className="mb-2" />
        <Skeleton variant="text" width="w-72" />
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
        <SkeletonBlock className="h-10 w-full rounded-xl" />
        <div>
          <Skeleton variant="text" className="mb-1" width="w-24" />
          <SkeletonBlock className="h-11 w-full rounded-xl" />
        </div>
        <SkeletonBlock className="h-9 w-36 rounded-xl" />
        <SkeletonBlock className="h-12 w-full rounded-xl" />
        <SkeletonBlock className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}