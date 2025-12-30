import { api } from "../../../elaview-mvp/src/trpc/server";
import { AdvertiserLayoutClient } from "./(shared)/AdvertiserLayoutClient";
import { AdminLayoutClient } from "./(shared)/AdminLayoutClient";
import { SpaceOwnerLayoutClient } from "./(shared)/SpaceOwnerLayoutClient";
import { AdminModeProvider } from "../../../elaview-mvp/src/contexts/AdminModeContext";
import { getAdminModeCookie } from "../../../elaview-mvp/src/lib/admin-mode-cookies";

export default async function DashboardLayout({
  admin,
  marketing,
  advertiser,
  spaceOwner,
}: LayoutProps<"/">) {
  const role = (await api.user.getCurrentUser()).role;
  const initialMode =
    (await getAdminModeCookie()) ?? (role === "ADMIN" ? "admin" : "marketing");

  switch (role) {
    case "ADMIN":
    case "MARKETING": {
      return (
        <AdminModeProvider userRole={role} initialMode={initialMode}>
          <AdminLayoutClient>
            {initialMode === "admin" ? admin : marketing}
          </AdminLayoutClient>
        </AdminModeProvider>
      );
    }
    case "ADVERTISER": {
      return <AdvertiserLayoutClient>{advertiser}</AdvertiserLayoutClient>;
    }
    case "SPACE_OWNER": {
      return <SpaceOwnerLayoutClient>{spaceOwner}</SpaceOwnerLayoutClient>;
    }
  }
}
