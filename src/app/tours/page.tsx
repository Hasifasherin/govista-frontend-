"use client";

import { Suspense } from "react";
import ToursContent from "./ToursContent";

export const dynamic = "force-dynamic";

export default function ToursPage() {
  return (
    <Suspense fallback={<p className="p-10">Loading tours...</p>}>
      <ToursContent />
    </Suspense>
  );
}
