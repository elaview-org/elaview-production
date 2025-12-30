"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { api, type RouterOutputs } from "../../../../../elaview-mvp/src/trpc/react";
import {
  AlertCircle,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  ExternalLink,
  Loader2,
  MapPin,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { DashboardStatCard } from "../../../../../elaview-mvp/src/components/molecules/DashboardStatCard";
import Image from "next/image";

type PendingSpace =
  RouterOutputs["admin"]["spaces"]["getPendingSpaces"]["spaces"][number];

const SPACE_TYPE_LABELS = {
  BILLBOARD: "Billboard",
  STOREFRONT: "Storefront",
  TRANSIT: "Transit",
  DIGITAL_DISPLAY: "Digital Display",
  WINDOW_DISPLAY: "Window Display",
  VEHICLE_WRAP: "Vehicle Wrap",
  OTHER: "Other",
};

function AdminSpacesContent() {
  const { user, isLoaded } = useUser();
  const [selectedSpace, setSelectedSpace] = useState<PendingSpace | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING_APPROVAL");

  // TRPC Queries
  const {
    data: spacesData,
    isLoading,
    error,
    refetch,
  } = api.admin.spaces.getPendingSpaces.useQuery(
    {
      status:
        statusFilter === "ALL"
          ? undefined
          : (statusFilter as
              | "ACTIVE"
              | "SUSPENDED"
              | "REJECTED"
              | "PENDING_APPROVAL"
              | undefined),
      search: searchTerm || undefined,
    },
    { enabled: isLoaded && !!user }
  );

  const { data: adminStats } = api.admin.spaces.getSpaceStats.useQuery(
    undefined,
    {
      enabled: isLoaded && !!user,
    }
  );

  // TRPC Mutations
  const approveSpace = api.admin.spaces.approveSpace.useMutation({
    onSuccess: () => {
      void refetch();
      setSelectedSpace(null);
    },
    onError: (error) => {
      alert(`Error approving space: ${error.message}`);
    },
  });

  const rejectSpace = api.admin.spaces.rejectSpace.useMutation({
    onSuccess: () => {
      void refetch();
      setSelectedSpace(null);
      setShowRejectModal(false);
      setRejectReason("");
    },
    onError: (error) => {
      alert(`Error rejecting space: ${error.message}`);
    },
  });

  const handleApprove = async (space: PendingSpace) => {
    if (
      confirm(
        `Approve "${space.title}"? This will make it visible to advertisers.`
      )
    ) {
      await approveSpace.mutateAsync({
        spaceId: space.id,
        notes: "Approved by admin",
      });
    }
  };

  const handleReject = async () => {
    if (!selectedSpace || !rejectReason.trim()) return;

    await rejectSpace.mutateAsync({
      spaceId: selectedSpace.id,
      reason: rejectReason,
      notes: "Rejected by admin",
    });
  };

  const openRejectModal = (space: PendingSpace) => {
    setSelectedSpace(space);
    setShowRejectModal(true);
  };

  const openMapsLocation = (space: PendingSpace) => {
    const url = `https://www.google.com/maps?q=${space.latitude},${space.longitude}`;
    window.open(url, "_blank");
  };

  // Check if user is admin
  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
        <h2 className="mb-2 text-lg font-semibold text-white">
          Authentication Required
        </h2>
        <p className="mb-4 text-slate-400">
          Please sign in to access the admin panel.
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="py-12 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
        <h2 className="mb-2 text-lg font-semibold text-white">
          Error Loading Spaces
        </h2>
        <p className="mb-4 text-slate-400">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const spaces = spacesData?.spaces ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Space Approvals</h1>
        <p className="mt-1 text-slate-400">
          Review and approve new advertising spaces
        </p>
      </div>

      {/* Stats Cards */}
      {adminStats && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[
            {
              label: "Pending Approval",
              value: `${adminStats.pendingSpaces}`,
              icon: Clock,
              iconColor: "text-yellow-400",
            },
            {
              label: "Active Spaces",
              value: `${adminStats.activeSpaces}`,
              icon: CheckCircle,
              iconColor: "text-green-400",
            },
            {
              label: "Rejected",
              value: `${adminStats.rejectedSpaces}`,
              icon: XCircle,
              iconColor: "text-red-400",
            },
            {
              label: "Total Spaces",
              value: `${adminStats.totalSpaces}`,
              icon: Building,
              iconColor: "text-blue-400",
            },
          ].map((card, index) => (
            <DashboardStatCard
              key={index}
              {...card}
              backgroundColor="bg-slate-900"
            />
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
            <input
              type="text"
              placeholder="Search spaces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pr-4 pl-10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="ACTIVE">Active</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="ALL">All Statuses</option>
          </select>
        </div>
      </div>

      {/* Spaces List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-slate-400">Loading spaces...</span>
        </div>
      ) : spaces.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-12 text-center">
          <Building className="mx-auto mb-3 h-12 w-12 text-slate-600" />
          <h3 className="mb-2 text-lg font-medium text-white">
            No spaces found
          </h3>
          <p className="text-slate-400">
            No spaces match your current filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {spaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              onApprove={() => handleApprove(space)}
              onReject={() => openRejectModal(space)}
              onViewLocation={() => openMapsLocation(space)}
              isLoading={approveSpace.isPending || rejectSpace.isPending}
            />
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedSpace && (
        <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center">
              <XCircle className="mr-3 h-6 w-6 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Reject Space</h2>
            </div>

            <p className="mb-4 text-slate-400">
              Rejecting &#34;{selectedSpace.title}&#34;. Please provide a reason
              for rejection:
            </p>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Rejection Reason *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Please explain why this space cannot be approved..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedSpace(null);
                  setRejectReason("");
                }}
                className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition-colors hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || rejectSpace.isPending}
                className="flex items-center rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {rejectSpace.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  "Reject Space"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SpaceCard({
  space,
  onApprove,
  onReject,
  onViewLocation,
  isLoading,
}: {
  space: PendingSpace;
  onApprove: () => void;
  onReject: () => void;
  onViewLocation: () => void;
  isLoading: boolean;
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      case "ACTIVE":
        return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "REJECTED":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "SUSPENDED":
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  const pricePerDay =
    typeof space.pricePerDay === "number"
      ? space.pricePerDay
      : Number(space.pricePerDay);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Images */}
        <div className="lg:w-1/3">
          {space.images && space.images.length > 0 ? (
            <div>
              <Image
                src={space.images[selectedImageIndex]!}
                alt={`${space.title} - Image ${selectedImageIndex + 1}`}
                className="h-48 w-full rounded-lg border border-slate-700 object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400";
                }}
              />
              {space.images.length > 1 && (
                <div className="mt-2 flex space-x-2 overflow-x-auto">
                  {space.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded border-2 ${
                        index === selectedImageIndex
                          ? "border-blue-500"
                          : "border-slate-700"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-48 w-full items-center justify-center rounded-lg border border-slate-700 bg-slate-800">
              <Building className="h-12 w-12 text-slate-600" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4 lg:w-2/3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-1 flex items-center space-x-2">
                <h3 className="text-xl font-semibold text-white">
                  {space.title}
                </h3>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(space.status)}`}
                >
                  {space.status.replace("_", " ")}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                {
                  SPACE_TYPE_LABELS[
                    space.type as keyof typeof SPACE_TYPE_LABELS
                  ]
                }{" "}
                • Submitted {new Date(space.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Description */}
          {space.description && (
            <div>
              <h4 className="mb-1 text-sm font-medium text-slate-300">
                Description
              </h4>
              <p className="text-sm text-slate-400">{space.description}</p>
            </div>
          )}

          {/* Location & Details */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <h4 className="mb-1 text-sm font-medium text-slate-300">
                  Location
                </h4>
                <div className="flex items-start space-x-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  <div className="text-sm text-slate-400">
                    <p>{space.address}</p>
                    <p>
                      {space.city}, {space.state} {space.zipCode}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onViewLocation}
                  className="mt-1 flex items-center text-xs text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  View on Maps
                </button>
              </div>

              <div>
                <h4 className="mb-1 text-sm font-medium text-slate-300">
                  Owner
                </h4>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <div className="text-sm text-slate-400">
                    <p>{space.owner.name ?? "No name provided"}</p>
                    <p className="text-xs text-slate-500">
                      {space.owner.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="mb-1 text-sm font-medium text-slate-300">
                  Pricing
                </h4>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-400">
                    ${pricePerDay}/day
                  </span>
                </div>
              </div>

              <div>
                <h4 className="mb-1 text-sm font-medium text-slate-300">
                  Duration
                </h4>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-400">
                    Min: {space.minDuration} days
                    {space.maxDuration && ` • Max: ${space.maxDuration} days`}
                  </span>
                </div>
              </div>

              {space.dimensions && (
                <div>
                  <h4 className="mb-1 text-sm font-medium text-slate-300">
                    Dimensions
                  </h4>
                  <p className="text-sm text-slate-400">{space.dimensions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {space.status === "PENDING_APPROVAL" && (
            <div className="flex items-center space-x-3 border-t border-slate-800 pt-4">
              <button
                onClick={onApprove}
                disabled={isLoading}
                className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </button>
              <button
                onClick={onReject}
                disabled={isLoading}
                className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminSpacesPage() {
  return <AdminSpacesContent />;
}
