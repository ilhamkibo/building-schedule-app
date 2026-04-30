import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adjust Schedule",
};

export default function AdjustScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
