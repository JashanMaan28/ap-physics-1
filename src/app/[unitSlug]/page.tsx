"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { UnitShell } from "@/components/unit-shell";
import { unitConfigs } from "@/units/registry";

export default function UnitPage({
  params,
  searchParams,
}: {
  params: Promise<{ unitSlug: string }>;
  searchParams: Promise<{ view?: string | string[] }>;
}) {
  const { unitSlug } = use(params);
  const { view } = use(searchParams);
  const config = unitConfigs[unitSlug];

  if (!config) {
    notFound();
  }

  const initialView = Array.isArray(view) ? view[0] : view;

  return <UnitShell config={config} initialView={initialView} />;
}
