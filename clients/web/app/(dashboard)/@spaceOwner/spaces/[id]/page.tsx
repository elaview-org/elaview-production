// src/app/spaces/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../../../elaview-mvp/src/trpc/react";
import {
  MapPin,
  DollarSign,
  Calendar,
  Star,
  Edit,
  TrendingUp,
  Package,
  Ruler,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Users,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const SPACE_TYPE_LABELS = {
  BILLBOARD: "Billboard",
  STOREFRONT: "Storefront",
  TRANSIT: "Transit",
  DIGITAL_DISPLAY: "Digital Display",
  WINDOW_DISPLAY: "Window Display",
  VEHICLE_WRAP: "Vehicle Wrap",
  OTHER: "Other",
};

const STATUS_CONFIG = {
  ACTIVE: {
    icon: CheckCircle,
    color: "green",
    text: "Active",
    bgClass: "bg-green-500/10 border-green-500/20",
    textClass: "text-green-400",
  },
  INACTIVE: {
    icon: XCircle,
    color: "slate",
    text: "Inactive",
    bgClass: "bg-slate-500/10 border-slate-500/20",
    textClass: "text-slate-400",
  },
  PENDING_APPROVAL: {
    icon: Clock,
    color: "yellow",
    text: "Pending Approval",
    bgClass: "bg-yellow-500/10 border-yellow-500/20",
    textClass: "text-yellow-400",
  },
  SUSPENDED: {
    icon: AlertCircle,
    color: "red",
    text: "Suspended",
    bgClass: "bg-red-500/10 border-red-500/20",
    textClass: "text-red-400",
  },
  REJECTED: {
    icon: XCircle,
    color: "red",
    text: "Rejected",
    bgClass: "bg-red-500/10 border-red-500/20",
    textClass: "text-red-400",
  },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function SpaceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const spaceId = params.id as string;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: space, isLoading } = api.spaces.getById.useQuery({ id: spaceId });
  const { data: bookings } = api.bookings.getBookingsBySpace.useQuery({ spaceId });

  if (isLoading) {
    return (
      <div className="h-full w-full p-4">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
          <div className="flex-shrink-0 border-b border-slate-700 p-6">
            <h1 className="text-3xl font-bold text-white">Space Details</h1>
            <p className="mt-2 text-slate-400">Loading space information...</p>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-y-auto p-6">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-green-500" />
              <p className="text-sm text-slate-400">Loading space details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="h-full w-full p-4">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
          <div className="flex-shrink-0 border-b border-slate-700 p-6">
            <h1 className="text-3xl font-bold text-white">Space Not Found</h1>
            <p className="mt-2 text-slate-400">The space you're looking for doesn't exist</p>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-y-auto p-6">
            <div className="text-center">
              <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
              <h2 className="mb-2 text-2xl font-bold text-white">Space Not Found</h2>
              <p className="mb-6 text-slate-400">
                This space doesn't exist or you don't have access to it.
              </p>
              <Link
                href="/spaces"
                className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-white transition-all hover:bg-green-700"
              >
                Back to My Spaces
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[space.status as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusConfig.icon;

  const activeBookings = bookings?.filter((b) => ["CONFIRMED", "ACTIVE"].includes(b.status)) ?? [];
  const completedBookings = bookings?.filter((b) => b.status === "COMPLETED") ?? [];
  const totalRevenue = Number(space.totalRevenue);

  const nextImage = () => {
    if (space.images && space.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % space.images.length);
    }
  };

  const prevImage = () => {
    if (space.images && space.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + space.images.length) % space.images.length);
    }
  };

  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{space.title}</h1>
              <p className="mt-2 text-slate-400">
                {SPACE_TYPE_LABELS[space.type as keyof typeof SPACE_TYPE_LABELS]} • {space.city},{" "}
                {space.state}
              </p>
            </div>
            <Link
              href={`/src/app/(dashboard)/@spaceOwner/spaces/${space.id}/edit`}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Space
            </Link>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Status Banner */}
            <div className={`rounded-xl border-2 p-6 ${statusConfig.bgClass}`}>
              <div className="flex items-start gap-3">
                <StatusIcon className={`h-6 w-6 ${statusConfig.textClass} mt-0.5 flex-shrink-0`} />
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${statusConfig.textClass} mb-1`}>
                    Status: {statusConfig.text}
                  </h3>
                  {space.status === "REJECTED" && space.rejectionReason && (
                    <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                      <p className="mb-2 text-sm font-semibold text-red-400">Rejection Reason:</p>
                      <p className="text-sm text-slate-300">{space.rejectionReason}</p>
                      <p className="mt-3 text-xs text-slate-400">
                        Please review the feedback above and edit your space to address these
                        issues.
                      </p>
                    </div>
                  )}
                  {space.status === "PENDING_APPROVAL" && (
                    <p className="text-sm text-slate-300">
                      Your space is currently under review by our team. This usually takes 24-48
                      hours.
                    </p>
                  )}
                  {space.status === "ACTIVE" && (
                    <p className="text-sm text-slate-300">
                      Your space is live and available for advertisers to book.
                    </p>
                  )}
                  {space.status === "SUSPENDED" && (
                    <p className="text-sm text-slate-300">
                      This space has been suspended. Please contact support for more information.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            {space.images && space.images.length > 0 && (
              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                  <ImageIcon className="h-5 w-5" />
                  Images ({space.images.length})
                </h2>
                <div className="relative">
                  <div className="aspect-video overflow-hidden rounded-lg bg-slate-900">
                    <img
                      src={space.images[currentImageIndex]}
                      alt={`${space.title} - Image ${currentImageIndex + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800";
                      }}
                    />
                  </div>

                  {space.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full border border-slate-700 bg-slate-900/80 p-2 transition-all hover:bg-slate-900"
                      >
                        <ChevronLeft className="h-6 w-6 text-white" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full border border-slate-700 bg-slate-900/80 p-2 transition-all hover:bg-slate-900"
                      >
                        <ChevronRight className="h-6 w-6 text-white" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                        {space.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`h-2 rounded-full transition-all ${
                              idx === currentImageIndex
                                ? "w-8 bg-white"
                                : "w-2 bg-white/50 hover:bg-white/75"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-600 p-3">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-600 p-3">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Total Bookings</p>
                    <p className="text-2xl font-bold text-white">{space.bookingsCount}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-600 p-3">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Active Now</p>
                    <p className="text-2xl font-bold text-white">{activeBookings.length}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-yellow-600 p-3">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Rating</p>
                    <p className="text-2xl font-bold text-white">
                      {space.averageRating ? space.averageRating.toFixed(1) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Space Details */}
              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
                <h2 className="mb-6 text-xl font-semibold text-white">Space Details</h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-400">Description</label>
                    <p className="mt-1 text-sm leading-relaxed text-slate-300">
                      {space.description || "No description provided"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-400">Space Type</label>
                      <p className="mt-1 font-medium text-white">
                        {SPACE_TYPE_LABELS[space.type as keyof typeof SPACE_TYPE_LABELS]}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-400">Dimensions</label>
                      <p className="mt-1 font-medium text-white">
                        {space.dimensionsText || `${space.width}' × ${space.height}'`}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-400">
                      <MapPin className="mr-1 inline h-4 w-4" />
                      Location
                    </label>
                    <p className="mt-1 font-medium text-white">{space.address}</p>
                    <p className="text-sm text-slate-400">
                      {space.city}, {space.state} {space.zipCode}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-400">
                        <DollarSign className="mr-1 inline h-4 w-4" />
                        Daily Rate
                      </label>
                      <p className="mt-1 text-lg font-medium text-white">
                        {formatCurrency(Number(space.pricePerDay))}/day
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-400">Installation Fee</label>
                      <p className="mt-1 text-lg font-medium text-white">
                        {formatCurrency(Number(space.installationFee || 0))}
                      </p>
                    </div>
                  </div>

                  {space.traffic && (
                    <div>
                      <label className="text-sm font-medium text-slate-400">
                        <Users className="mr-1 inline h-4 w-4" />
                        Estimated Traffic
                      </label>
                      <p className="mt-1 font-medium text-white">{space.traffic}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking History */}
              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Booking History</h2>
                  <Link
                    href={`/src/app/(dashboard)/@spaceOwner/spaces/${space.id}/analytics`}
                    className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                  >
                    <TrendingUp className="h-4 w-4" />
                    View Analytics
                  </Link>
                </div>

                {!bookings || bookings.length === 0 ? (
                  <div className="py-8 text-center">
                    <Calendar className="mx-auto mb-3 h-12 w-12 text-slate-600" />
                    <p className="text-sm text-slate-400">No bookings yet</p>
                  </div>
                ) : (
                  <div className="max-h-96 space-y-3 overflow-y-auto">
                    {bookings.map((booking) => {
                      const isActive = ["CONFIRMED", "ACTIVE"].includes(booking.status);
                      return (
                        <div
                          key={booking.id}
                          className={`rounded-lg border p-4 ${
                            isActive
                              ? "border-green-500/20 bg-green-500/10"
                              : "border-slate-600 bg-slate-900/50"
                          }`}
                        >
                          <div className="mb-2 flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-white">
                                {booking.campaign.name}
                              </p>
                              <p className="text-xs text-slate-400">
                                {booking.campaign.advertiser.name}
                              </p>
                            </div>
                            <span
                              className={`rounded px-2 py-1 text-xs font-medium ${
                                isActive
                                  ? "bg-green-500/20 text-green-400"
                                  : booking.status === "COMPLETED"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-slate-600/20 text-slate-400"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar className="h-3 w-3" />
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <DollarSign className="h-3 w-3" />
                            {formatCurrency(Number(booking.totalAmount))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Link
                href="/spaces"
                className="rounded-lg border border-slate-600 bg-slate-900 px-6 py-2.5 font-medium text-white transition-all hover:bg-slate-900/70"
              >
                Back to My Spaces
              </Link>
              <Link
                href={`/src/app/(dashboard)/@spaceOwner/spaces/${space.id}/edit`}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-all hover:bg-blue-700"
              >
                <Edit className="h-4 w-4" />
                Edit Space
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
