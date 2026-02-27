import "server-only";

import gql from "./gql";
import user from "./user";
import listings from "./listings";

const api = {
  ...gql,
  user,
  listings,
};
export default api;
