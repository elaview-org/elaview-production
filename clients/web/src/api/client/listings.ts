"use client";

import { useActionState, useTransition } from "react";
import {
  createSpaceAction,
  updateSpaceAction,
  updateSpaceImagesAction,
  deactivateSpaceAction,
  reactivateSpaceAction,
  deleteSpaceAction,
  bulkDeactivateSpacesAction,
  bulkDeleteSpacesAction,
  blockDatesAction,
  unblockDatesAction,
  type BulkActionResult,
} from "./listings.actions";

type SimpleResult = { success: boolean; error: string | null };

function useCreateSpace() {
  return useActionState(createSpaceAction, {
    success: false,
    message: "",
    fieldErrors: {},
  });
}

function useUpdateSpace(id: string) {
  return useActionState(updateSpaceAction.bind(null, id), {
    success: false,
    message: "",
  });
}

function useUpdateSpaceImages() {
  const [isPending, startTransition] = useTransition();

  function updateImages(
    id: string,
    images: string[],
    onResult?: (result: SimpleResult) => void
  ) {
    startTransition(async () => {
      const result = await updateSpaceImagesAction(id, images);
      onResult?.(result);
    });
  }

  return { updateImages, isPending };
}

function useDeactivateSpace() {
  const [isPending, startTransition] = useTransition();

  function deactivate(id: string, onResult?: (result: SimpleResult) => void) {
    startTransition(async () => {
      const result = await deactivateSpaceAction(id);
      onResult?.(result);
    });
  }

  return { deactivate, isPending };
}

function useReactivateSpace() {
  const [isPending, startTransition] = useTransition();

  function reactivate(id: string, onResult?: (result: SimpleResult) => void) {
    startTransition(async () => {
      const result = await reactivateSpaceAction(id);
      onResult?.(result);
    });
  }

  return { reactivate, isPending };
}

function useDeleteSpace() {
  const [isPending, startTransition] = useTransition();

  function deleteSpace(id: string, onResult?: (result: SimpleResult) => void) {
    startTransition(async () => {
      const result = await deleteSpaceAction(id);
      onResult?.(result);
    });
  }

  return { deleteSpace, isPending };
}

function useBulkDeactivateSpaces() {
  const [isPending, startTransition] = useTransition();

  function bulkDeactivate(
    ids: string[],
    onResult?: (result: BulkActionResult) => void
  ) {
    startTransition(async () => {
      const result = await bulkDeactivateSpacesAction(ids);
      onResult?.(result);
    });
  }

  return { bulkDeactivate, isPending };
}

function useBulkDeleteSpaces() {
  const [isPending, startTransition] = useTransition();

  function bulkDelete(
    ids: string[],
    onResult?: (result: BulkActionResult) => void
  ) {
    startTransition(async () => {
      const result = await bulkDeleteSpacesAction(ids);
      onResult?.(result);
    });
  }

  return { bulkDelete, isPending };
}

function useBlockDates() {
  const [isPending, startTransition] = useTransition();

  function blockDates(
    spaceId: string,
    dates: string[],
    onResult?: (result: SimpleResult) => void
  ) {
    startTransition(async () => {
      const result = await blockDatesAction(spaceId, dates);
      onResult?.(result);
    });
  }

  return { blockDates, isPending };
}

function useUnblockDates() {
  const [isPending, startTransition] = useTransition();

  function unblockDates(
    spaceId: string,
    dates: string[],
    onResult?: (result: SimpleResult) => void
  ) {
    startTransition(async () => {
      const result = await unblockDatesAction(spaceId, dates);
      onResult?.(result);
    });
  }

  return { unblockDates, isPending };
}

const listings = {
  useCreateSpace,
  useUpdateSpace,
  useUpdateSpaceImages,
  useDeactivateSpace,
  useReactivateSpace,
  useDeleteSpace,
  useBulkDeactivateSpaces,
  useBulkDeleteSpaces,
  useBlockDates,
  useUnblockDates,
};
export default listings;
