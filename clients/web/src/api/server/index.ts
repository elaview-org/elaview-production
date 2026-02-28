import "server-only";

import gql from "./gql";
import user from "./user";
import listings from "./listings";
import { overview } from "./overview";

const api = {
  ...gql,
  user,
  listings,
  getMyOverview: overview.getMyOverView,
};
export default api;
