import { getCourseStaticParams } from "@/lib/static-params";

export const generateStaticParams = getCourseStaticParams;

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
