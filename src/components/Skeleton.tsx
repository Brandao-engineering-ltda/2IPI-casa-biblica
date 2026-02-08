interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-cream-dark/20";

  const variantClasses = {
    text: "h-4 rounded",
    rectangular: "rounded-lg",
    circular: "rounded-full",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

interface SkeletonSectionProps {
  className?: string;
}

export function HeroSkeleton({ className = "" }: SkeletonSectionProps) {
  return (
    <section className={`relative overflow-hidden bg-navy-dark py-24 lg:py-36 ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center">
        <Skeleton variant="circular" width={80} height={80} className="mb-8" />
        <Skeleton variant="rectangular" width={600} height={48} className="mb-6" />
        <Skeleton variant="rectangular" width={500} height={24} className="mb-10" />
        <div className="mb-16 flex flex-col gap-4 sm:flex-row">
          <Skeleton variant="rectangular" width={160} height={48} />
          <Skeleton variant="rectangular" width={160} height={48} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width={120} height={16} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CourseCardSkeleton({ className = "" }: SkeletonSectionProps) {
  return (
    <div className={`rounded-2xl border border-cream-dark/10 bg-navy p-6 shadow-lg ${className}`}>
      <Skeleton variant="rectangular" width="100%" height={200} className="mb-4" />
      <Skeleton variant="text" width={200} height={24} className="mb-2" />
      <Skeleton variant="text" width="100%" height={16} className="mb-1" />
      <Skeleton variant="text" width="80%" height={16} className="mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={80} height={16} />
        <Skeleton variant="rectangular" width={100} height={32} />
      </div>
    </div>
  );
}

export function CoursesSkeleton({ className = "" }: SkeletonSectionProps) {
  return (
    <section className={`bg-background py-20 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <Skeleton variant="rectangular" width={300} height={40} className="mx-auto mb-4" />
          <Skeleton variant="rectangular" width={500} height={24} className="mx-auto" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutSkeleton({ className = "" }: SkeletonSectionProps) {
  return (
    <section className={`bg-navy py-20 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Skeleton variant="rectangular" width={300} height={40} className="mb-6" />
            <div className="space-y-3">
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="95%" height={20} />
            </div>
          </div>
          <Skeleton variant="rectangular" width="100%" height={400} />
        </div>
      </div>
    </section>
  );
}

export function VideoSkeleton({ className = "" }: SkeletonSectionProps) {
  return (
    <section className={`bg-background py-20 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <Skeleton variant="rectangular" width={400} height={40} className="mx-auto mb-4" />
          <Skeleton variant="rectangular" width={600} height={24} className="mx-auto" />
        </div>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <Skeleton variant="rectangular" width={300} height={40} />
            <div className="space-y-3">
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="95%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="85%" height={20} />
            </div>
            <Skeleton variant="rectangular" width={160} height={48} />
          </div>
          <Skeleton variant="rectangular" width="100%" height={400} className="rounded-lg" />
        </div>
      </div>
    </section>
  );
}

export function DashboardSkeleton({ className = "" }: SkeletonSectionProps) {
  return (
    <section className={`relative min-h-[calc(100vh-80px)] overflow-hidden bg-navy-dark ${className}`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-center gap-4 mb-12">
          <Skeleton variant="rectangular" width={48} height={48} className="rounded-xl" />
          <div>
            <Skeleton variant="rectangular" width={200} height={32} className="mb-2" />
            <Skeleton variant="text" width={150} height={16} />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-cream-dark/10 bg-navy p-6 shadow-lg">
              <Skeleton variant="rectangular" width={120} height={24} className="mb-4" />
              <div className="space-y-2 mb-4">
                <Skeleton variant="text" width="100%" height={16} />
                <Skeleton variant="text" width="80%" height={16} />
              </div>
              <Skeleton variant="rectangular" width={100} height={20} />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Skeleton variant="text" width={180} height={16} />
        </div>
      </div>
    </section>
  );
}

export function CTASkeleton({ className = "" }: SkeletonSectionProps) {
  return (
    <section className={`bg-primary py-20 ${className}`}>
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Skeleton variant="rectangular" width={400} height={48} className="mx-auto mb-6" />
        <Skeleton variant="rectangular" width={500} height={24} className="mx-auto mb-10" />
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Skeleton variant="rectangular" width={200} height={48} />
          <Skeleton variant="rectangular" width={200} height={48} />
        </div>
      </div>
    </section>
  );
}