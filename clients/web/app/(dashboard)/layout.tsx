// import { api } from "../../../elaview-mvp/src/trpc/server";
import { AdvertiserLayoutClient } from "./(shared)/AdvertiserLayoutClient";
import { AdminLayoutClient } from "./(shared)/AdminLayoutClient";
import { SpaceOwnerLayoutClient } from "./(shared)/SpaceOwnerLayoutClient";
import { AdminModeProvider } from "@/shared/contexts/AdminModeContext";
// import { getAdminModeCookie } from "@/shred/lib/admin-mode-cookies";

export default async function DashboardLayout({
  admin,
  marketing,
  advertiser,
  spaceOwner,
}: LayoutProps<"/">) {
  // const role = (await api.user.getCurrentUser()).role;
  const role = "MARKETING" as
    | "MARKETING"
    | "ADMIN"
    | "ADVERTISER"
    | "SPACE_OWNER";
  // const initialMode =
  // (await getAdminModeCookie()) ?? (role === "ADMIN" ? "admin" : "marketing");

  // switch (role) {
  //   case "ADMIN": {
  //     return admin;
  //   }
  //   case "MARKETING": {
  //     return (
  //       <>{marketing}</>
  // <AdminModeProvider userRole={role} initialMode={initialMode}>
  // <AdminLayoutClient>
  // </AdminLayoutClient>
  // </AdminModeProvider>
  //   );
  // }
  // case "ADVERTISER": {
  // return <AdvertiserLayoutClient>{advertiser}</AdvertiserLayoutClient>;
  //   return <>{advertiser}</>;
  // }
  // case "SPACE_OWNER": {
  //   return <>{spaceOwner}</>;
  // return <SpaceOwnerLayoutClient>{spaceOwner}</SpaceOwnerLayoutClient>;
  // }
return <SpaceOwnerLayoutClient>{spaceOwner}</SpaceOwnerLayoutClient>;
}
