// src/app/spaces/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  MapPin,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Star,
  Calendar,
  TrendingUp,
  Loader2,
} from "lucide-react";
import useSpacesDelete from "@/shared/hooks/api/actions/useSpacesDelete/useSpacesDelete";
import useSpaces from "@/shared/hooks/api/getters/useSpaces/useSpaces";

// type Space = RouterOutputs["spaces"]["getMySpaces"][number];
type Space = any;
const SPACE_TYPE_LABELS = {
  BILLBOARD: "Billboard",
  STOREFRONT: "Storefront",
  TRANSIT: "Transit",
  DIGITAL_DISPLAY: "Digital Display",
  WINDOW_DISPLAY: "Window Display",
  VEHICLE_WRAP: "Vehicle Wrap",
  OTHER: "Other",
};

export default function MySpacesPage() {
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {spaces, isLoading, refetch} = useSpaces();
  const {deleteSpace, isPending:deleteSpaceMutationPending} = useSpacesDelete();
  const handleDeleteSpace = (spaceId: string) => {
    setSelectedSpace(spaceId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedSpace) {
      deleteSpace();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "INACTIVE":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "PENDING_APPROVAL":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "SUSPENDED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "REJECTED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full p-4">
        <div className="flex h-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-green-500" />
            <p className="text-sm text-slate-400">Loading your spaces...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">My Spaces</h1>
              <p className="mt-2 text-slate-400">
                Manage your advertising locations and track performance.
              </p>
            </div>
            <Link
              href="/spaces/new"
              className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 font-medium text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Space
            </Link>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats Summary */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg transition-all hover:border-slate-600">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-600 p-3">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-400">Total Spaces</h3>
                  <p className="mt-1 text-2xl font-bold text-white">{spaces?.length || 0}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg transition-all hover:border-slate-600">
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-600 p-3">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-400">Total Revenue</h3>
                  <p className="mt-1 text-2xl font-bold text-white">
                    $
                    {spaces
                      ?.reduce((sum, space) => {
                        const revenue =
                          typeof space.totalRevenue === "number"
                            ? space.totalRevenue
                            : Number(space.totalRevenue);
                        return sum + revenue;
                      }, 0)
                      .toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg transition-all hover:border-slate-600">
              <div className="flex items-center">
                <div className="rounded-lg bg-purple-600 p-3">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-400">Total Bookings</h3>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {spaces?.reduce((sum, space) => sum + space.bookingsCount, 0) || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg transition-all hover:border-slate-600">
              <div className="flex items-center">
                <div className="rounded-lg bg-yellow-600 p-3">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-400">Avg Rating</h3>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {spaces && spaces.length > 0
                      ? (
                          spaces.reduce((sum, space) => sum + (space.averageRating || 0), 0) /
                          spaces.length
                        ).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Spaces List */}
          {!spaces || spaces.length === 0 ? (
            <div className="rounded-xl border border-slate-700 bg-slate-800 shadow-lg">
              <div className="p-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-700">
                  <MapPin className="h-7 w-7 text-slate-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">No spaces yet</h3>
                <p className="mb-6 text-slate-400">
                  Start by adding your first advertising space to begin earning revenue.
                </p>
                <Link
                  href="/spaces/new"
                  className="inline-flex items-center rounded-lg bg-green-600 px-6 py-3 font-medium text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Space
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-lg">
              <div className="border-b border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-white">Your Spaces</h2>
              </div>
              <div className="divide-y divide-slate-700">
                {spaces.map((space) => (
                  <SpaceCard
                    key={space.id}
                    space={space}
                    onDelete={() => handleDeleteSpace(space.id)}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
              onClick={() => setShowDeleteModal(false)}
            ></div>
            <div className="inline-block transform overflow-hidden rounded-xl border border-slate-800 bg-slate-900 text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-semibold text-white">Delete Space</h3>
                    <div className="mt-2">
                      <p className="text-sm text-slate-400">
                        Are you sure you want to delete this space? This action cannot be undone and
                        will remove all associated data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-800 bg-slate-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm transition-all hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                  disabled={deleteSpaceMutationPending}
                >
                  {deleteSpaceMutationPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-base font-medium text-slate-300 shadow-sm transition-all hover:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SpaceCard({
  space,
  onDelete,
  getStatusColor,
}: {
  space: Space;
  onDelete: () => void;
  getStatusColor: (status: string) => string;
}) {
  const [showActions, setShowActions] = useState(false);

  const pricePerDay =
    typeof space.pricePerDay === "number" ? space.pricePerDay : Number(space.pricePerDay);

  const totalRevenue =
    typeof space.totalRevenue === "number" ? space.totalRevenue : Number(space.totalRevenue);

  return (
    <div className="p-6 transition-colors hover:bg-slate-700/30">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start space-x-4">
            {/* Space Image */}
            <div className="relative flex-shrink-0">
              {space.images && space.images.length > 0 ? (
                <div className="relative">
                  <img
                    src={space.images[0]}
                    alt={space.title}
                    className="h-16 w-16 rounded-lg border border-slate-600 object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400";
                    }}
                  />
                  {space.images.length > 1 && (
                    <div className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-800 bg-green-600">
                      <span className="text-[10px] font-bold text-white">
                        {space.images.length}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-slate-600 bg-slate-700">
                  <MapPin className="h-6 w-6 text-slate-500" />
                </div>
              )}
            </div>

            {/* Space Info */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center space-x-2">
                <h3 className="truncate text-lg font-semibold text-white">{space.title}</h3>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(space.status)}`}
                >
                  {space.status.replace("_", " ")}
                </span>
              </div>

              <p className="mb-2 text-sm text-slate-400">
                {SPACE_TYPE_LABELS[space.type as keyof typeof SPACE_TYPE_LABELS]} • {space.city},{" "}
                {space.state}
              </p>

              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <span className="flex items-center">
                  <DollarSign className="mr-1 h-4 w-4" />${pricePerDay.toLocaleString()}/day
                </span>
                <span className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {space.bookingsCount} bookings
                </span>
                {space.averageRating && (
                  <span className="flex items-center">
                    <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {space.averageRating.toFixed(1)} ({space.reviewsCount})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-slate-600 bg-slate-700/50 p-3 text-center">
              <p className="text-sm font-semibold text-white">${totalRevenue.toLocaleString()}</p>
              <p className="mt-1 text-xs text-slate-400">Total Revenue</p>
            </div>
            <div className="rounded-lg border border-slate-600 bg-slate-700/50 p-3 text-center">
              <p className="text-sm font-semibold text-white">{space.activeBookings}</p>
              <p className="mt-1 text-xs text-slate-400">Active Campaigns</p>
            </div>
            <div className="rounded-lg border border-slate-600 bg-slate-700/50 p-3 text-center">
              <p className="text-sm font-semibold text-white">{space.pendingBookings}</p>
              <p className="mt-1 text-xs text-slate-400">Pending Requests</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="relative ml-4">
          <button
            type="button"
            className="rounded-lg p-2 transition-colors hover:bg-slate-700"
            onClick={() => setShowActions(!showActions)}
          >
            <MoreVertical className="h-5 w-5 text-slate-400" />
          </button>

          {showActions && (
            <div className="ring-opacity-5 absolute right-0 z-10 mt-2 w-48 rounded-lg border border-slate-600 bg-slate-700 shadow-2xl ring-1 ring-black">
              <div className="py-1">
                <Link
                  href={`/spaces/${space.id}`}
                  className="flex items-center px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-600 hover:text-white"
                  onClick={() => setShowActions(false)}
                >
                  <Eye className="mr-3 h-4 w-4" />
                  View Details
                </Link>
                <Link
                  href={`/spaces/${space.id}/edit`}
                  className="flex items-center px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-600 hover:text-white"
                  onClick={() => setShowActions(false)}
                >
                  <Edit className="mr-3 h-4 w-4" />
                  Edit Space
                </Link>
                <Link
                  href={`/spaces/${space.id}/analytics`}
                  className="flex items-center px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-600 hover:text-white"
                  onClick={() => setShowActions(false)}
                >
                  <TrendingUp className="mr-3 h-4 w-4" />
                  View Analytics
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                  onClick={() => {
                    setShowActions(false);
                    onDelete();
                  }}
                >
                  <Trash2 className="mr-3 h-4 w-4" />
                  Delete Space
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

