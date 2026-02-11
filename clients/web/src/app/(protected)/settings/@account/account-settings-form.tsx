"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/primitives/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import { Separator } from "@/components/primitives/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/primitives/dialog";
import { toast } from "sonner";
import { deleteAccountAction, changePasswordAction } from "../settings.actions";

type Props = {
  createdAt?: string;
  lastLoginAt?: string | null;
  activeProfileType?: string | null;
};

function formatAccountDate(dateString: string | null | undefined) {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AccountSettingsForm({
  createdAt,
  lastLoginAt,
  activeProfileType,
}: Props) {
  const [deletePassword, setDeletePassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletePending, startDeleteTransition] = useTransition();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordPending, startPasswordTransition] = useTransition();

  function handleDelete() {
    startDeleteTransition(async () => {
      const result = await deleteAccountAction(deletePassword);
      if (result.error) {
        toast.error(result.error);
        setDialogOpen(false);
        setDeletePassword("");
      }
    });
  }

  function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    startPasswordTransition(async () => {
      const result = await changePasswordAction(currentPassword, newPassword);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    });
  }

  return (
    <div className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Account Information</FieldLabel>
          <div className="space-y-3 rounded-md border p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Account Created
              </span>
              <span className="text-sm font-medium">
                {formatAccountDate(createdAt)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Last Login</span>
              <span className="text-sm font-medium">
                {formatAccountDate(lastLoginAt)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Account Type
              </span>
              <span className="text-sm font-medium capitalize">
                {activeProfileType?.toLowerCase().replace("_", " ")}
              </span>
            </div>
          </div>
        </Field>

        <Field>
          <FieldLabel>Change Password</FieldLabel>
          <FieldDescription>
            Update your password to keep your account secure.
          </FieldDescription>
          <div className="mt-4 space-y-4">
            <Field>
              <FieldLabel htmlFor="currentPassword">
                Current Password
              </FieldLabel>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={passwordPending}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={passwordPending}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm New Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={passwordPending}
              />
            </Field>
            <Button
              type="button"
              variant="outline"
              disabled={
                passwordPending ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
              onClick={handleChangePassword}
            >
              {passwordPending ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </Field>

        <Separator className="my-6" />

        <Field>
          <FieldLabel className="text-destructive">Danger Zone</FieldLabel>
          <FieldDescription>
            Irreversible and destructive actions
          </FieldDescription>
          <div className="mt-4 space-y-4">
            <div className="border-destructive/50 rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Delete Account</h4>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Permanently delete your account and all associated data.
                  </p>
                </div>
                <Dialog
                  open={dialogOpen}
                  onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) setDeletePassword("");
                  }}
                >
                  <DialogTrigger asChild>
                    <Button type="button" variant="destructive">
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="sm">
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        This action is permanent and cannot be undone. Enter
                        your password to verify your identity.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      <p className="text-sm">Enter your password to confirm:</p>
                      <Input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Password"
                        autoComplete="off"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="destructive"
                        disabled={!deletePassword || deletePending}
                        onClick={handleDelete}
                      >
                        {deletePending
                          ? "Deleting..."
                          : "Permanently Delete Account"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </Field>
      </FieldGroup>
    </div>
  );
}
