"use client";

import { Suspense } from "react";
import CreateBookingContent from "./CreateBookingContent";

export const dynamic = "force-dynamic";

export default function CreateBookingPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading booking...</div>}>
      <CreateBookingContent />
    </Suspense>
  );
}
