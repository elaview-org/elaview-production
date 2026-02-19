import auth from "./auth";
import listings from "./listings";

const api = {
  auth,
  listings,
} as const;
export default api;
