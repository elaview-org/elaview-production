"use client";

import { useState } from "react";
import { api } from "../../../../../elaview-mvp/src/trpc/react";
import { Button } from "../../../../../elaview-mvp/src/components/ui/Button";
import { Input } from "../../../../../elaview-mvp/src/components/ui/Input";
import {
  CheckCircle2,
  Circle,
  Clock,
  RefreshCw,
  MessageSquare,
  Copy,
  AlertCircle,
} from "lucide-react";

export default function TestBookingPage() {
  const [bookingId, setBookingId] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(0);
  const [campaignName, setCampaignName] = useState("Test Campaign");
  const [spaceName, setSpaceName] = useState("Test Billboard Space");
  const [amount, setAmount] = useState(500);
  const [proofUrl, setProofUrl] = useState("https://example.com/proof.jpg");
  const [denyReason, setDenyReason] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // tRPC mutations
  const createBooking = api.admin.system.createTestBooking.useMutation({
    onSuccess: (data) => {
      setBookingId(data.bookingId);
      setCurrentStep(1);
      setMessage({
        type: "success",
        text: `✅ Booking created: ${data.bookingId.slice(0, 8)}`,
      });
    },
    onError: (error) => {
      setMessage({ type: "error", text: `❌ Error: ${error.message}` });
    },
  });

  const approveBooking = api.admin.bookings.approveBooking.useMutation({
    onSuccess: () => {
      setCurrentStep(2);
      setMessage({
        type: "success",
        text: "✅ Booking approved! Status: ACTIVE",
      });
    },
    onError: (error) => {
      setMessage({ type: "error", text: `❌ Error: ${error.message}` });
    },
  });

  const submitProof = api.admin.system.submitTestProof.useMutation({
    onSuccess: () => {
      setCurrentStep(3);
      setMessage({
        type: "success",
        text: "✅ Proof submitted! Awaiting approval",
      });
    },
    onError: (error) => {
      setMessage({ type: "error", text: `❌ Error: ${error.message}` });
    },
  });

  const approveProofMutation = api.admin.bookings.approveProof.useMutation({
    onSuccess: () => {
      setCurrentStep(4);
      setMessage({
        type: "success",
        text: "✅ Proof approved! Booking complete",
      });
    },
    onError: (error) => {
      setMessage({ type: "error", text: `❌ Error: ${error.message}` });
    },
  });

  const denyBookingMutation = api.admin.bookings.denyBooking.useMutation({
    onSuccess: () => {
      setCurrentStep(5);
      setMessage({ type: "success", text: "🚫 Booking denied and cancelled" });
    },
    onError: (error) => {
      setMessage({ type: "error", text: `❌ Error: ${error.message}` });
    },
  });

  const steps = [
    { id: 0, name: "Setup", icon: Circle },
    { id: 1, name: "Pending Approval", icon: Clock },
    { id: 2, name: "Active", icon: CheckCircle2 },
    { id: 3, name: "Proof Submitted", icon: Clock },
    { id: 4, name: "Completed", icon: CheckCircle2 },
  ];

  const handleReset = () => {
    setBookingId("");
    setCurrentStep(0);
    setMessage(null);
    setCampaignName("Test Campaign");
    setSpaceName("Test Billboard Space");
    setAmount(500);
    setProofUrl("https://example.com/proof.jpg");
    setDenyReason("");
  };

  const copyBookingId = () => {
    void navigator.clipboard.writeText(bookingId);
    setMessage({ type: "success", text: "📋 Booking ID copied to clipboard!" });
  };

  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed */}
        <div className="shrink-0 border-b border-slate-700 p-6">
          <h1 className="text-3xl font-bold text-white">
            Booking Flow Simulator
          </h1>
          <p className="mt-2 text-slate-400">
            Test the complete booking lifecycle with WhatsApp notifications
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Progress Indicator */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Progress</h2>
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex flex-col items-center ${idx <= currentStep ? "text-blue-400" : "text-slate-500"}`}
                  >
                    <div
                      className={`rounded-full p-2 ${idx < currentStep ? "bg-green-500" : idx === currentStep ? "bg-blue-500" : "bg-slate-700"}`}
                    >
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="mt-2 max-w-20 text-center text-xs">
                      {step.name}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 w-12 ${idx < currentStep ? "bg-green-500" : "bg-slate-700"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Booking ID */}
          {bookingId && (
            <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Booking ID</p>
                  <p className="font-mono text-2xl font-bold text-blue-900">
                    {bookingId.slice(0, 8)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Full: {bookingId}
                  </p>
                </div>
                <Button onClick={copyBookingId} variant="outline">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy ID
                </Button>
              </div>
            </div>
          )}

          {/* Status Message */}
          {message && (
            <div
              className={`rounded-lg border p-4 ${message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
            >
              <div className="flex items-start gap-2">
                {message.type === "error" && (
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                )}
                <p
                  className={
                    message.type === "error" ? "text-red-800" : "text-green-800"
                  }
                >
                  {message.text}
                </p>
              </div>
            </div>
          )}

          {/* WhatsApp Commands Guide */}
          <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-700" />
              <h2 className="text-xl font-semibold text-green-900">
                WhatsApp Commands
              </h2>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Use these commands directly from WhatsApp
            </p>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-green-900">Help:</strong>
                <p className="ml-4 text-gray-700">
                  • Text &#34;Commands&#34; to see all available commands
                </p>
              </div>
              <div>
                <strong className="text-green-900">Quick Create:</strong>
                <p className="ml-4 text-gray-700">
                  • Text &#34Elaview-simulate&#34; to create instant test
                  booking
                </p>
              </div>
              <div>
                <strong className="text-green-900">View Active:</strong>
                <p className="ml-4 text-gray-700">
                  • Text &#34Elaview-status&#34 to get all active booking IDs
                </p>
              </div>
              <div>
                <strong className="text-green-900">Approve/Deny:</strong>
                <p className="ml-4 text-gray-700">
                  • Reply &#34Approve [id]&#34 or &#34Deny [id]&#34 to any
                  booking
                </p>
                <p className="ml-4 text-gray-700">
                  • Example: &#34Approve{" "}
                  {bookingId ? bookingId.slice(0, 8) : "clxx1234"}&#34
                </p>
              </div>
              <div>
                <strong className="text-green-900">Auto-Run:</strong>
                <p className="ml-4 text-gray-700">
                  • &#34Wait [id]&#34 - Run full flow with 5-second delays
                </p>
                <p className="ml-4 text-gray-700">
                  • &#34Bypass [id]&#34 - Complete instantly
                </p>
                <p className="ml-4 text-gray-700">
                  • &#34Close [id]&#34 - Archive simulation
                </p>
              </div>
            </div>
            <div className="mt-4 rounded border border-green-300 bg-green-100 p-3">
              <p className="text-sm text-green-800">
                💡 <strong>Pro tip:</strong> Always use &#34Elaview-status&#34
                to get current booking IDs before running commands
              </p>
            </div>
          </div>

          {/* Manual Controls */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-2 text-xl font-semibold text-white">
              Manual Step-by-Step Testing
            </h2>
            <p className="mb-6 text-sm text-slate-400">
              Execute each step of the booking flow manually
            </p>

            <div className="space-y-6">
              {/* Step 1: Create Booking */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Step 1: Create Test Booking
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label
                        htmlFor="campaignName"
                        className="mb-1 block text-sm font-medium text-slate-300"
                      >
                        Campaign Name
                      </label>
                      <Input
                        id="campaignName"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="Test Campaign"
                        className="border-slate-600 bg-slate-900 text-white"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="spaceName"
                        className="mb-1 block text-sm font-medium text-slate-300"
                      >
                        Space Name
                      </label>
                      <Input
                        id="spaceName"
                        value={spaceName}
                        onChange={(e) => setSpaceName(e.target.value)}
                        placeholder="Test Billboard Space"
                        className="border-slate-600 bg-slate-900 text-white"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="amount"
                        className="mb-1 block text-sm font-medium text-slate-300"
                      >
                        Amount ($)
                      </label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="500"
                        className="border-slate-600 bg-slate-900 text-white"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      createBooking.mutate({ campaignName, spaceName, amount })
                    }
                    disabled={createBooking.isPending}
                    className="w-full"
                  >
                    {createBooking.isPending
                      ? "Creating..."
                      : "📥 Create Booking (Step 1)"}
                  </Button>
                  <p className="text-sm text-slate-400">
                    This will create a booking with PENDING_APPROVAL status and
                    send a WhatsApp notification with command prompts.
                  </p>
                </div>
              )}

              {/* Step 2: Approve Booking */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Step 2: Approve Booking
                  </h3>
                  <p className="text-sm text-slate-400">
                    You can approve via WhatsApp by texting:{" "}
                    <code className="rounded bg-slate-900/50 px-2 py-1 text-slate-300">
                      Approve {bookingId.slice(0, 8)}
                    </code>
                  </p>
                  <p className="text-sm text-slate-400">
                    Or use the button below:
                  </p>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => approveBooking.mutate({ bookingId })}
                      disabled={approveBooking.isPending}
                      className="flex-1"
                    >
                      {approveBooking.isPending
                        ? "Approving..."
                        : "✅ Approve Booking (Step 2)"}
                    </Button>
                    <Button
                      onClick={() => {
                        if (denyReason) {
                          denyBookingMutation.mutate({
                            bookingId,
                            reason: denyReason,
                          });
                        } else {
                          setMessage({
                            type: "error",
                            text: "Please enter a denial reason",
                          });
                        }
                      }}
                      disabled={denyBookingMutation.isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      {denyBookingMutation.isPending
                        ? "Denying..."
                        : "🚫 Deny Booking"}
                    </Button>
                  </div>
                  <div>
                    <label
                      htmlFor="denyReason"
                      className="mb-1 block text-sm font-medium text-slate-300"
                    >
                      Denial Reason (if denying)
                    </label>
                    <textarea
                      id="denyReason"
                      value={denyReason}
                      onChange={(e) => setDenyReason(e.target.value)}
                      placeholder="Space doesn't meet requirements..."
                      className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Submit Proof */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Step 3: Submit Installation Proof
                  </h3>
                  <div>
                    <label
                      htmlFor="proofUrl"
                      className="mb-1 block text-sm font-medium text-slate-300"
                    >
                      Proof Image URL
                    </label>
                    <Input
                      id="proofUrl"
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                      placeholder="https://example.com/proof.jpg"
                      className="border-slate-600 bg-slate-900 text-white"
                    />
                  </div>
                  <Button
                    onClick={() => submitProof.mutate({ bookingId, proofUrl })}
                    disabled={submitProof.isPending}
                    className="w-full"
                  >
                    {submitProof.isPending
                      ? "Submitting..."
                      : "📸 Submit Proof (Step 3)"}
                  </Button>
                  <p className="text-sm text-slate-400">
                    This simulates the advertiser uploading installation photos
                    and sends a WhatsApp alert for review.
                  </p>
                </div>
              )}

              {/* Step 4: Approve Proof */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Step 4: Approve Installation Proof
                  </h3>
                  <p className="text-sm text-slate-400">
                    You can approve via WhatsApp by texting:{" "}
                    <code className="rounded bg-slate-900/50 px-2 py-1 text-slate-300">
                      Approve {bookingId.slice(0, 8)}
                    </code>
                  </p>
                  <p className="text-sm text-slate-400">
                    Or use the button below:
                  </p>
                  <Button
                    onClick={() => approveProofMutation.mutate({ bookingId })}
                    disabled={approveProofMutation.isPending}
                    className="w-full"
                  >
                    {approveProofMutation.isPending
                      ? "Approving..."
                      : "✅ Approve Proof (Step 4)"}
                  </Button>
                  <p className="text-sm text-slate-400">
                    This marks the booking as COMPLETED and triggers payout
                    processing.
                  </p>
                </div>
              )}

              {/* Step 5: Completed */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    🎉 Booking Flow Complete!
                  </h3>
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="font-semibold text-green-800">
                      ✅ All steps completed successfully
                    </p>
                    <p className="mt-2 text-sm text-green-700">
                      The booking has gone through the full lifecycle:
                    </p>
                    <ul className="mt-2 ml-4 space-y-1 text-sm text-green-700">
                      <li>✓ Created with PENDING_APPROVAL</li>
                      <li>✓ Approved → ACTIVE</li>
                      <li>✓ Proof submitted → AWAITING_PROOF</li>
                      <li>✓ Proof approved → COMPLETED</li>
                      <li>✓ WhatsApp notifications sent at each step</li>
                    </ul>
                  </div>
                  <Button
                    onClick={handleReset}
                    className="w-full"
                    variant="outline"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Start New Test
                  </Button>
                </div>
              )}

              {/* Cancelled State */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    🚫 Booking Denied
                  </h3>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="font-semibold text-red-800">
                      The booking was denied and cancelled
                    </p>
                    <p className="mt-2 text-sm text-red-700">
                      Reason: {denyReason || "No reason provided"}
                    </p>
                  </div>
                  <Button
                    onClick={handleReset}
                    className="w-full"
                    variant="outline"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Start New Test
                  </Button>
                </div>
              )}

              {/* Reset Button (always available after step 1) */}
              {currentStep > 0 && currentStep < 4 && (
                <div className="border-t border-slate-700 pt-4">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset & Start Over
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
