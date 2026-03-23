import { gql } from "@apollo/client";
import api from "@/api/server";
import { IconScreenShare, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

// ── Types (until codegen runs) ───────────────────────────

type ScreenNode = {
  id: string;
  name: string;
  status: string;
  resolution: string | null;
  lastHeartbeatAt: string | null;
  updatedAt: string;
  devices: Array<{
    id: string;
    deviceName: string;
    status: string;
    lastSeenAt: string | null;
  }> | null;
  schedules: Array<{
    id: string;
    status: string;
    startDate: string;
    endDate: string;
    creativeType: string;
  }> | null;
};

type MyScreensData = {
  myDigitalSignageScreens: { nodes: ScreenNode[] } | null;
};

const MY_SCREENS_QUERY = gql`
  query MyDigitalSignageScreens {
    myDigitalSignageScreens(first: 50, order: { createdAt: DESC }) {
      nodes {
        id
        name
        status
        resolution
        lastHeartbeatAt
        updatedAt
        devices {
          id
          deviceName
          status
          lastSeenAt
        }
        schedules {
          id
          status
          startDate
          endDate
          creativeType
        }
      }
    }
  }
`;

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ONLINE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    OFFLINE: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    ERROR: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    MAINTENANCE:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? colors.OFFLINE}`}
    >
      {status}
    </span>
  );
}

export default async function ScreensPage() {
  const { data } = await api.query<MyScreensData>({
    query: MY_SCREENS_QUERY,
    revalidate: 30,
    tags: ["screens"],
  });

  const screens = data?.myDigitalSignageScreens?.nodes ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Digital Signage Screens
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your digital display screens, devices, and content schedules.
          </p>
        </div>
        <Link
          href="/screens/register"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors"
        >
          <IconPlus className="h-4 w-4" />
          Register Screen
        </Link>
      </div>

      {screens.length === 0 ? (
        <div className="bg-card text-card-foreground flex flex-col items-center justify-center rounded-lg border p-12 text-center shadow-sm">
          <IconScreenShare className="text-muted-foreground mb-4 h-12 w-12" />
          <h2 className="text-lg font-semibold">No screens registered</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Register a digital signage screen to start managing content on your
            digital displays.
          </p>
          <Link
            href="/screens/register"
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors"
          >
            <IconPlus className="h-4 w-4" />
            Register Your First Screen
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {screens.map((screen) => {
            const deviceCount = screen.devices?.length ?? 0;
            const activeSchedules =
              screen.schedules?.filter(
                (s) => s.status === "ACTIVE"
              ).length ?? 0;

            return (
              <Link
                key={screen.id}
                href={`/screens/${screen.id}`}
                className="bg-card text-card-foreground hover:border-primary/50 group rounded-lg border p-5 shadow-sm transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold group-hover:underline">
                      {screen.name}
                    </h3>
                    {screen.resolution && (
                      <p className="text-muted-foreground text-xs">
                        {screen.resolution}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={screen.status} />
                </div>

                <div className="text-muted-foreground mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="block text-xs uppercase tracking-wide">
                      Devices
                    </span>
                    <span className="text-foreground font-medium">
                      {deviceCount}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wide">
                      Active Schedules
                    </span>
                    <span className="text-foreground font-medium">
                      {activeSchedules}
                    </span>
                  </div>
                </div>

                {screen.lastHeartbeatAt && (
                  <p className="text-muted-foreground mt-3 text-xs">
                    Last heartbeat:{" "}
                    {new Date(screen.lastHeartbeatAt).toLocaleString()}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
