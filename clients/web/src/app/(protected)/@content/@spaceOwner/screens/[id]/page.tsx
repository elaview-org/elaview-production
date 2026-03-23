import { gql } from "@apollo/client";
import api from "@/api/server";
import { notFound } from "next/navigation";
import PairingCodeButton from "./pairing-code-button";

// ── Types (until codegen runs) ───────────────────────────

type DeviceNode = {
  id: string;
  deviceName: string;
  type: string;
  status: string;
  lastSeenAt: string | null;
  createdAt: string;
};

type ScheduleNode = {
  id: string;
  creativeAssetUrl: string | null;
  creativeType: string;
  rotationIntervalSeconds: number;
  startDate: string;
  endDate: string;
  status: string;
  pushedToDevicesAt: string | null;
};

type ScreenDetailData = {
  digitalSignageScreenById: {
    id: string;
    name: string;
    status: string;
    resolution: string | null;
    lastHeartbeatAt: string | null;
    createdAt: string;
    updatedAt: string;
    devices: DeviceNode[] | null;
    schedules: ScheduleNode[] | null;
  } | null;
};

type ScreenDetailVars = { id: string };

const SCREEN_DETAIL_QUERY = gql`
  query DigitalSignageScreenDetail($id: ID!) {
    digitalSignageScreenById(id: $id) {
      id
      name
      status
      resolution
      lastHeartbeatAt
      createdAt
      updatedAt
      devices {
        id
        deviceName
        type
        status
        lastSeenAt
        createdAt
      }
      schedules {
        id
        creativeAssetUrl
        creativeType
        rotationIntervalSeconds
        startDate
        endDate
        status
        pushedToDevicesAt
      }
    }
  }
`;

function StatusBadge({ status, variant = "default" }: { status: string; variant?: "default" | "device" | "schedule" }) {
  const colorMap: Record<string, Record<string, string>> = {
    default: {
      ONLINE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      OFFLINE: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      ERROR: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      MAINTENANCE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    device: {
      ONLINE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      OFFLINE: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      PAIRING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      UNPAIRED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      ERROR: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      DISABLED: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
    },
    schedule: {
      ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      PENDING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      COMPLETED: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  const colors = colorMap[variant] ?? colorMap.default;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function ScreenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data } = await api.query<ScreenDetailData, ScreenDetailVars>({
    query: SCREEN_DETAIL_QUERY,
    variables: { id },
    revalidate: 15,
    tags: [`screen-${id}`],
  });

  const screen = data?.digitalSignageScreenById;
  if (!screen) {
    notFound();
  }

  const devices = screen.devices ?? [];
  const schedules = screen.schedules ?? [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{screen.name}</h1>
          <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
            <StatusBadge status={screen.status} />
            {screen.resolution && <span>{screen.resolution}</span>}
            <span>Registered {formatDate(screen.createdAt)}</span>
          </div>
        </div>
        <PairingCodeButton screenId={screen.id} />
      </div>

      {/* Devices */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">
          Devices ({devices.length})
        </h2>
        {devices.length === 0 ? (
          <div className="bg-muted/50 rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground text-sm">
              No devices paired yet. Generate a pairing code to connect a
              device.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className="bg-card rounded-lg border p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{device.deviceName}</h3>
                    <p className="text-muted-foreground text-xs">{device.type}</p>
                  </div>
                  <StatusBadge status={device.status} variant="device" />
                </div>
                {device.lastSeenAt && (
                  <p className="text-muted-foreground mt-2 text-xs">
                    Last seen: {new Date(device.lastSeenAt).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Schedules */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">
          Content Schedules ({schedules.length})
        </h2>
        {schedules.length === 0 ? (
          <div className="bg-muted/50 rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground text-sm">
              No content schedules yet. Schedules are automatically created when
              bookings are paid for digital display spaces.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="text-muted-foreground pb-2 pr-4 font-medium">
                    Type
                  </th>
                  <th className="text-muted-foreground pb-2 pr-4 font-medium">
                    Status
                  </th>
                  <th className="text-muted-foreground pb-2 pr-4 font-medium">
                    Period
                  </th>
                  <th className="text-muted-foreground pb-2 pr-4 font-medium">
                    Rotation
                  </th>
                  <th className="text-muted-foreground pb-2 font-medium">
                    Pushed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {schedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td className="py-2.5 pr-4">{schedule.creativeType}</td>
                    <td className="py-2.5 pr-4">
                      <StatusBadge
                        status={schedule.status}
                        variant="schedule"
                      />
                    </td>
                    <td className="py-2.5 pr-4">
                      {formatDate(schedule.startDate)} –{" "}
                      {formatDate(schedule.endDate)}
                    </td>
                    <td className="py-2.5 pr-4">
                      {schedule.rotationIntervalSeconds}s
                    </td>
                    <td className="text-muted-foreground py-2.5">
                      {schedule.pushedToDevicesAt
                        ? formatDate(schedule.pushedToDevicesAt)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
