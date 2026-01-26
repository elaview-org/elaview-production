"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/primitives/accordion";
import ProfileSettingsForm from "./profile-settings-form";
import BusinessSettingsForm from "./business-settings-form";
import PayoutSettingsForm from "./payout-settings-form";
import NotificationSettingsForm from "./notification-settings-form";
import AccountSettingsForm from "./account-settings-form";
import type { SpaceOwnerSettingsQuery } from "@/types/gql/graphql";
import {
  IconBell,
  IconBuilding,
  IconCreditCard,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";

type Props = {
  user: NonNullable<SpaceOwnerSettingsQuery["me"]>;
  notificationPreferences: SpaceOwnerSettingsQuery["myNotificationPreferences"];
};

export default function SettingsContent({
  user,
  notificationPreferences,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <Accordion
        type="multiple"
        defaultValue={["profile"]}
        className="flex flex-col gap-4"
      >
        <AccordionItem value="profile" className="rounded-lg border px-6">
          <AccordionTrigger className="text-base">
            <div className="flex items-center gap-3">
              <IconUser className="text-muted-foreground size-5" />
              <div className="flex flex-col items-start gap-0.5">
                <span>Profile Information</span>
                <span className="text-muted-foreground text-sm font-normal">
                  Your personal details and contact info
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ProfileSettingsForm user={user} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="business" className="rounded-lg border px-6">
          <AccordionTrigger className="text-base">
            <div className="flex items-center gap-3">
              <IconBuilding className="text-muted-foreground size-5" />
              <div className="flex flex-col items-start gap-0.5">
                <span>Business Information</span>
                <span className="text-muted-foreground text-sm font-normal">
                  Your business details and payout schedule
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <BusinessSettingsForm user={user} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="payout" className="rounded-lg border px-6">
          <AccordionTrigger className="text-base">
            <div className="flex items-center gap-3">
              <IconCreditCard className="text-muted-foreground size-5" />
              <div className="flex flex-col items-start gap-0.5">
                <span>Payout Settings</span>
                <span className="text-muted-foreground text-sm font-normal">
                  Stripe Connect and bank account
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <PayoutSettingsForm user={user} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="notifications" className="rounded-lg border px-6">
          <AccordionTrigger className="text-base">
            <div className="flex items-center gap-3">
              <IconBell className="text-muted-foreground size-5" />
              <div className="flex flex-col items-start gap-0.5">
                <span>Notification Preferences</span>
                <span className="text-muted-foreground text-sm font-normal">
                  Email, push, and in-app notifications
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <NotificationSettingsForm preferences={notificationPreferences} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="account" className="rounded-lg border px-6">
          <AccordionTrigger className="text-base">
            <div className="flex items-center gap-3">
              <IconSettings className="text-muted-foreground size-5" />
              <div className="flex flex-col items-start gap-0.5">
                <span>Account Settings</span>
                <span className="text-muted-foreground text-sm font-normal">
                  Security, password, and account management
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <AccountSettingsForm user={user} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
