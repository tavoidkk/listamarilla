import { Skeleton, SkeletonBlock } from "@/components/ui/Skeleton";

export default function ContactosLoading() {
  return (
    <div>
      <div className="mb-6 border-b border-border pb-5">
        <Skeleton variant="text" height="h-2" width="w-16" className="mb-2" />
        <Skeleton variant="title" className="mb-2" />
        <Skeleton variant="text" width="w-40" />
      </div>

      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4"
          >
            <div className="min-w-0 flex-1">
              <Skeleton variant="text" className="mb-1" width="w-2/3" />
              <Skeleton variant="text" width="w-1/2" />
              <Skeleton variant="text" className="mt-1" width="w-24" />
            </div>
            <SkeletonBlock className="h-9 w-20 flex-shrink-0 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}