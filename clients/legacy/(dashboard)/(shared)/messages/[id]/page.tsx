// src/app/(shared)/messages/[id]/page.tsx

import { useParams } from "next/navigation";
import { UnifiedMessagesLayout } from "@/shared/components/messages/UnifiedMessagesLayout";

export default function ConversationPage() {
  const resolvedParams = useParams<{ id: string }>();

  return <UnifiedMessagesLayout selectedConversationId={resolvedParams.id} />;
}
