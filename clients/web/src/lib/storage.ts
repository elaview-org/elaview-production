const PREFIX = "elaview";

function createKey(...segments: string[]): string {
  return [PREFIX, ...segments].join(".");
}

const storage = {
  preferences: {
    listings: {
      view: createKey("preferences", "listings", "view"),
    },
    bookings: {
      view: createKey("preferences", "bookings", "view"),
    },
    advertiserBookings: {
      view: createKey("preferences", "advertiser-bookings", "view"),
    },
    campaigns: {
      view: createKey("preferences", "campaigns", "view"),
    },
    discover: {
      view: createKey("preferences", "discover", "view"),
    },
    sidebar: {
      open: createKey("preferences", "sidebar", "open"),
    },
    theme: createKey("preferences", "theme"),
  },
  authentication: {
    token: createKey("authentication", "token"),
  },
  drafts: {
    createSpace: createKey("drafts", "create-space"),
  },
} as const;

export default storage;
