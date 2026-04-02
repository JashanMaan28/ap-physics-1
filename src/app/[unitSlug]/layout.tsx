import type { Metadata } from "next";
import { units } from "@/data/units";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ unitSlug: string }>;
}): Promise<Metadata> {
  const { unitSlug } = await params;
  const unit = units.find((u) => u.slug === unitSlug);

  if (!unit) {
    return { title: "AP Physics 1" };
  }

  return {
    title: `AP Physics 1 — Unit ${unit.number}: ${unit.name}`,
    description: unit.description,
  };
}

export default function UnitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
