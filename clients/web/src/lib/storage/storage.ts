import { def, type StorageTree } from "./_internal/index";
import { ViewOptions } from "@/types/constants";

export type { StorageKeyDef, StorageBackend, CookieOptions } from "./_internal/index";

const YEAR = 60 * 60 * 24 * 365;
const PREF_COOKIE = { maxAge: YEAR, path: "/", sameSite: "lax" as const };
const PREFIX = "elaview";

const storage = {
  preferences: {
    listings: {
      view: def<ViewOptions>(`${PREFIX}.preferences.listings.view`, "cookie", ViewOptions.Grid, PREF_COOKIE),
    },
    bookings: {
      view: def<ViewOptions>(`${PREFIX}.preferences.bookings.view`, "cookie", ViewOptions.Table, PREF_COOKIE),
    },
    advertiserBookings: {
      view: def<ViewOptions>(`${PREFIX}.preferences.advertiser-bookings.view`, "cookie", ViewOptions.Table, PREF_COOKIE),
    },
    campaigns: {
      view: def<ViewOptions>(`${PREFIX}.preferences.campaigns.view`, "cookie", ViewOptions.Grid, PREF_COOKIE),
    },
    discover: {
      view: def<ViewOptions>(`${PREFIX}.preferences.discover.view`, "cookie", ViewOptions.Grid, PREF_COOKIE),
    },
    sidebar: {
      open: def<boolean>(`${PREFIX}.preferences.sidebar.open`, "cookie", true, PREF_COOKIE),
    },
    theme: def<"light" | "dark" | "system">(`${PREFIX}.preferences.theme`, "localStorage", "system"),
  },
  authentication: {
    token: def<string | null>(`${PREFIX}.authentication.token`, "cookie", null, { httpOnly: true }),
  },
  drafts: {
    createSpace: def<unknown>(`${PREFIX}.drafts.create-space`, "localStorage", null),
    createCampaign: def<unknown>(`${PREFIX}.drafts.create-campaign`, "localStorage", null),
  },
} as const satisfies StorageTree;

export default storage;
