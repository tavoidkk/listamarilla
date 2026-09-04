import { Skeleton, SkeletonBlock } from "@/components/ui/Skeleton";

export default function CategoriasLoading() {
  return (
    <div>
      <div className="mb-6 border-b border-border pb-5">
        <Skeleton variant="text" height="h-2" width="w-16" className="mb-2" />
        <Skeleton variant="title" className="mb-2" />
        <Skeleton variant="text" width="w-40" />
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <Skeleton variant="title" width="w-52" className="mb-4" />
          <div className="space-y-4">
            <div>
              <Skeleton variant="text" className="mb-1" width="w-16" />
              <SkeletonBlock className="h-11 w-full rounded-xl" />
            </div>
            <div>
              <Skeleton variant="text" className="mb-1" width="w-14" />
              <SkeletonBlock className="h-11 w-full rounded-xl" />
            </div>
            <SkeletonBlock className="h-12 w-full rounded-xl" />
          </div>
        </div>

        <div className="space-y-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton variant="circle" width="w-8" height="h-8" />
                <div>
                  <Skeleton variant="text" className="mb-1" width="w-40" />
                  <Skeleton variant="text" width="w-20" />
                </div>
              </div>
              <SkeletonBlock className="h-9 w-20 flex-shrink-0 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}