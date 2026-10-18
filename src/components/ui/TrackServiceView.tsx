"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

// service_page_viewed { service_name } once per service page view (sent only with analytics consent).
export default function TrackServiceView({ serviceName }: { serviceName: string }) {
  useEffect(() => {
    track("service_page_viewed", { service_name: serviceName });
  }, [serviceName]);
  return null;
}
