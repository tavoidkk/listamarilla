import { Skeleton, SkeletonBlock } from "@/components/ui/Skeleton";

export default function PanelLoading() {
  return (
    <div>
      <div className="mb-6 border-b border-border pb-5">
        <Skeleton variant="text" height="h-2" width="w-16" className="mb-2" />
        <Skeleton variant="title" className="mb-2" />
        <Skeleton variant="text" width="w-64" />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-white p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <Skeleton variant="circle" width="w-10" height="h-10" />
              <Skeleton variant="title" width="w-10" />
            </div>
            <Skeleton variant="text" className="mb-2" />
            <Skeleton variant="text" width="w-24" />
          </div>
        ))}
      </div>

      <section>
        <Skeleton variant="text" width="w-32" className="mb-3" />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4"
            >
              <SkeletonBlock className="h-12 w-12 flex-shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <Skeleton variant="text" className="mb-1" />
                <Skeleton variant="text" width="w-32" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}