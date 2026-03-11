import { getCourseStaticParams } from "@/lib/static-params";

export const generateStaticParams = getCourseStaticParams;

export default function AdminCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
