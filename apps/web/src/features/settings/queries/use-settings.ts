"use client";

import { useQuery } from "@tanstack/react-query";

import { getSettings } from "@/services/setting.service";

export function useSettings(
  enabled = true,
) {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    enabled,
  });
}