// src/app/(shared)/messages/[id]/page.tsx
"use client";

import { use } from "react";
import { UnifiedMessagesLayout } from "../../../../../../elaview-mvp/src/components/messages/UnifiedMessagesLayout";

export default function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  
  return <UnifiedMessagesLayout selectedConversationId={resolvedParams.id} />;
}