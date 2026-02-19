"use client";

import { Suspense } from "react";
import ChatContent from "./ChatContent";

export const dynamic = "force-dynamic";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
