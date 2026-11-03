"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/utm";

// Runs once per page load: remembers any utm_* tags on the landing URL for the session (src/lib/utm.ts).
export default function UtmCapture() {
  useEffect(() => captureUtm(), []);
  return null;
}
