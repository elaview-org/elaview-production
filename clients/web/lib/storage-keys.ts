const PREFIX = "elaview";

function createKey(...segments: string[]): string {
  return [PREFIX, ...segments].join(".");
}

const storageKey = {
  preferences: {
    listings: {
      view: createKey("preferences", "listings", "view"),
    },
    bookings: {
      view: createKey("preferences", "bookings", "view"),
    },
    sidebar: {
      open: createKey("preferences", "sidebar", "open"),
    },
    theme: createKey("preferences", "theme"),
  },
  authentication: {
    token: createKey("authentication", "token"),
  },
} as const;

export default storageKey;
