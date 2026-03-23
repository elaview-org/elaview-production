"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/primitives/button";
import { IconQrcode, IconCopy, IconCheck } from "@tabler/icons-react";
import { generatePairingCodeAction } from "../screens.actions";
import { toast } from "sonner";

export default function PairingCodeButton({ screenId }: { screenId: string }) {
  const [pending, startTransition] = useTransition();
  const [pairingData, setPairingData] = useState<{
    code: string;
    expiresAt: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    startTransition(async () => {
      const result = await generatePairingCodeAction(screenId);
      if (result.success && result.pairingCode && result.expiresAt) {
        setPairingData({
          code: result.pairingCode,
          expiresAt: result.expiresAt,
        });
      } else {
        toast.error(result.error ?? "Failed to generate pairing code.");
      }
    });
  }

  async function handleCopy() {
    if (!pairingData) return;
    await navigator.clipboard.writeText(pairingData.code);
    setCopied(true);
    toast.success("Pairing code copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  if (pairingData) {
    const expiresDate = new Date(pairingData.expiresAt);
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-blue-50 px-4 py-2.5 dark:bg-blue-950/30">
        <div>
          <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
            Pairing Code
          </p>
          <p className="font-mono text-lg font-bold tracking-widest">
            {pairingData.code}
          </p>
          <p className="text-muted-foreground text-xs">
            Expires {expiresDate.toLocaleString()}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? (
            <IconCheck className="size-4" />
          ) : (
            <IconCopy className="size-4" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" onClick={handleGenerate} disabled={pending}>
      <IconQrcode className="mr-2 size-4" />
      {pending ? "Generating…" : "Generate Pairing Code"}
    </Button>
  );
}
