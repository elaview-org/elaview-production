import { redirect } from "next/navigation";
import { AdvertiserSettingsContent } from "./advertiser-settings-content";
import getAdvertiserQuery from "./advertiser-queries";
import { User } from "@/types/graphql.generated";

export default async function AdvertiserSettingsPage() {
  const { status, currentUser } = await getAdvertiserQuery();
  if (status) {
    redirect("/logout");
  }

  return <AdvertiserSettingsContent user={currentUser as User} />;
}
