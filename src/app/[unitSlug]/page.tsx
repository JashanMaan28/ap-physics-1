"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { UnitShell } from "@/components/unit-shell";
import { unitConfigs } from "@/units/registry";

export default function UnitPage({
  params,
}: {
  params: Promise<{ unitSlug: string }>;
}) {
  const { unitSlug } = use(params);
  const config = unitConfigs[unitSlug];

  if (!config) {
    notFound();
  }

  return <UnitShell config={config} />;
}
