import View from "./view";
import { cookies } from "next/headers";
import storage from "@/lib/core/storage";

export default async function Default() {
  return (
    <View
      authenticated={!!(await cookies()).get(storage.authentication.token)}
    />
  );
}
