import { useState } from "react";

export function useAdminNotes() {
  const [adminNotes, setAdminNotes] = useState("");

  const handleConfirm = (callback: (notes: string) => void) => {
    if (adminNotes.length < 10) {
      alert("Please provide at least 10 characters in admin notes");
      return false;
    }
    callback(adminNotes);
    setAdminNotes("");
    return true;
  };

  const handleClose = (callback: () => void) => {
    setAdminNotes("");
    callback();
  };

  const reset = () => {
    setAdminNotes("");
  };

  return {
    adminNotes,
    setAdminNotes,
    handleConfirm,
    handleClose,
    reset,
  };
}
