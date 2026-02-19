import "server-only";

import gql from "./gql";
import user from "./user";

const api = {
  ...gql,
  user,
};
export default api;
