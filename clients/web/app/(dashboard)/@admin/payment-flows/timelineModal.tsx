import { format } from "date-fns";
import type { BookingStatus, PayoutStatus } from "@prisma/client";

export default function TimelineModal({
  timeline,
  onClose,
}: {
  timeline: {
    booking: {
      campaign: { name: string };
      space: { title: string };
      status: BookingStatus;
      payoutStatus: PayoutStatus;
    };
    timeline: {
      timestamp: Date;
      event: string;
      description: string;
      type: "info" | "success" | "warning" | "error";
      metadata?: number;
    }[];
  };
  onClose: () => void;
}) {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-8">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Payment Flow Timeline
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {timeline.booking.campaign.name} → {timeline.booking.space.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {/* Booking Info */}
        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm">
          <div>
            <span className="text-gray-600">Status:</span>{" "}
            <span className="font-semibold">{timeline.booking.status}</span>
          </div>
          <div>
            <span className="text-gray-600">Payout Status:</span>{" "}
            <span className="font-semibold">
              {timeline.booking.payoutStatus}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {timeline.timeline.map((event, index: number) => (
              <div key={index} className="flex gap-4">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      event.type === "success"
                        ? "bg-green-500"
                        : event.type === "error"
                          ? "bg-red-500"
                          : event.type === "warning"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                    }`}
                  />
                  {index < timeline.timeline.length - 1 && (
                    <div className="mt-2 h-full w-0.5 bg-gray-300" />
                  )}
                </div>

                {/* Event content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {event.event}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {event.description}
                      </p>
                      {event.metadata && (
                        <pre className="mt-2 rounded bg-gray-50 p-2 text-xs text-gray-500">
                          {JSON.stringify(event.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                    <div className="ml-4 text-xs whitespace-nowrap text-gray-500">
                      {format(new Date(event.timestamp), "MMM d, h:mm a")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
