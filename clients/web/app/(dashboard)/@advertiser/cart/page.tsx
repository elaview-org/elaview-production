// src/app/cart/page.tsx - DARK THEME STYLED
"use client";

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Trash2,
  MapPin,
  Clock,
  AlertCircle,
  Loader2,
  Edit3,
  Plus,
  ArrowRight,
  Send,
  Megaphone
} from 'lucide-react';
import { api, type RouterOutputs } from '../../../../../elaview-mvp/src/trpc/react';
import { formatDate } from '../../../../../elaview-mvp/src/lib/dates';

// TRPC inferred types
type CartData = RouterOutputs['cart']['getCart'];
type CartItem = CartData['items'][number];
type CartSummary = CartData['summary'];

export default function CartPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [editingItem, setEditingItem] = useState<string | null>(null);

  // TRPC queries and mutations
  const { data: cartData, isLoading, error, refetch } = api.cart.getCart.useQuery(undefined, {
    enabled: isLoaded,
    refetchInterval: 30000, // Refresh every 30 seconds to update timers
    refetchIntervalInBackground: false, // Stop refetching when tab is in background
  });

  // Fetch campaigns to check if user has any
  const { data: campaigns } = api.campaigns.getAdvertiserCampaigns.useQuery(undefined, {
    enabled: isLoaded,
  });

  const removeItemMutation = api.cart.removeItem.useMutation({
    onSuccess: () => {
      void refetch();
    },
    onError: (error) => {
      alert(`Failed to remove item: ${error.message}`);
    }
  });

  const updateItemMutation = api.cart.updateItem.useMutation({
    onSuccess: () => {
      void refetch();
      setEditingItem(null);
    },
    onError: (error) => {
      alert(`Failed to update booking: ${error.message}`);
    }
  });

  const checkoutMutation = api.cart.checkout.useMutation({
    onSuccess: (data) => {
      router.push(data.redirectUrl || '/campaigns');
    },
    onError: (error) => {
      alert(`Checkout failed: ${error.message}`);
    }
  });

  const cartItems = cartData?.items || [];
  const cartSummary = cartData?.summary;

  // Remove item from cart
  const removeFromCart = (bookingId: string) => {
    if (confirm('Remove this space from your cart?')) {
      removeItemMutation.mutate({ bookingId });
    }
  };

  // Update booking dates
  const updateBookingDates = (bookingId: string, startDate: Date, endDate: Date) => {
    updateItemMutation.mutate({
      bookingId,
      startDate,
      endDate
    });
  };

  // Submit for approval (NOT payment)
  const submitForApproval = () => {
    if (!cartItems.length) return;
    if (confirm(`Submit ${cartItems.length} space${cartItems.length !== 1 ? 's' : ''} to space owners for approval?`)) {
      checkoutMutation.mutate({});
    }
  };

  // Format remaining time for reservations
  const getTimeRemaining = (reservedUntil: Date | null) => {
    if (!reservedUntil) return 'No expiration';

    const now = new Date();
    const expiry = new Date(reservedUntil);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isLoaded) {
    return (
      <div className="h-full w-full p-4">
        <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full p-4">
        <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-full">
              <div className="max-w-md mx-auto bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 mx-auto mb-4">
                  <AlertCircle className="h-7 w-7 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Error Loading Cart</h2>
                <p className="text-slate-400 mb-6">{error.message}</p>
                <button
                  onClick={() => void refetch()}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No campaigns exist - show special state
  if (campaigns?.length === 0) {
    return (
      <div className="h-full w-full p-4">
        <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-full">
              <div className="max-w-2xl mx-auto">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-8 text-center">
                  <Megaphone className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Oops! No Campaign Yet
                  </h2>
                  <p className="text-slate-300 mb-6 text-lg">
                    Looks like you haven't set up a campaign yet. Let's create one to get started!
                  </p>
                  <button
                    onClick={() => router.push('/campaigns/new')}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-4">
      <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <ShoppingCart className="h-7 w-7 mr-3" />
                Review & Submit
              </h1>
              <p className="text-slate-400 mt-2">
                {cartItems.length > 0
                  ? `${cartItems.length} space${cartItems.length !== 1 ? 's' : ''} selected for your campaign`
                  : 'Your cart is empty'
                }
              </p>
            </div>

            {cartItems.length > 0 && (
              <button
                onClick={() => router.push('/browse')}
                className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-600/10 transition-all font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add More Spaces
              </button>
            )}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2 text-slate-400">Loading cart...</span>
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="text-center py-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 mx-auto mb-4">
                <ShoppingCart className="h-7 w-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Your cart is empty</h3>
              <p className="text-slate-400 mb-6">
                Browse advertising spaces and add them to your campaign to get started.
              </p>
              <button
                onClick={() => router.push('/browse')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                Browse Spaces
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          ) : (
            /* Cart Items */
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    isEditing={editingItem === item.id}
                    isRemoving={removeItemMutation.isPending}
                    isUpdating={updateItemMutation.isPending}
                    onEdit={() => setEditingItem(item.id)}
                    onCancelEdit={() => setEditingItem(null)}
                    onSaveEdit={updateBookingDates}
                    onRemove={() => removeFromCart(item.id)}
                    getTimeRemaining={getTimeRemaining}
                  />
                ))}
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 sticky top-6 shadow-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>

                  {cartSummary && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Subtotal ({cartSummary.itemCount} items)</span>
                        <span className="font-medium text-white">${cartSummary.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Platform fees</span>
                        <span className="font-medium text-white">${cartSummary.platformFees.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Processing fees</span>
                        <span className="font-medium text-white">${cartSummary.stripeFees.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-slate-600 pt-3">
                        <div className="flex justify-between">
                          <span className="text-base font-medium text-white">Total</span>
                          <span className="text-lg font-bold text-white">${cartSummary.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-300">
                      <strong>Next steps:</strong> Space owners will review your request. You'll complete payment after they approve.
                    </p>
                  </div>

                  <button
                    onClick={submitForApproval}
                    disabled={checkoutMutation.isPending || cartItems.length === 0}
                    className="w-full mt-4 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {checkoutMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit for Approval
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-500 mt-3 text-center">
                    No payment required until space owner approval
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Cart Item Card Component
interface CartItemCardProps {
  item: CartItem;
  isEditing: boolean;
  isRemoving: boolean;
  isUpdating: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: (bookingId: string, startDate: Date, endDate: Date) => void;
  onRemove: () => void;
  getTimeRemaining: (reservedUntil: Date | null) => string;
}

function CartItemCard({
  item,
  isEditing,
  isRemoving,
  isUpdating,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onRemove,
  getTimeRemaining
}: CartItemCardProps) {
  const [editStartDate, setEditStartDate] = useState(
    new Date(item.startDate).toISOString().split('T')[0]
  );
  const [editEndDate, setEditEndDate] = useState(
    new Date(item.endDate).toISOString().split('T')[0]
  );

  const timeRemaining = getTimeRemaining(item.reservedUntil);
  const isExpired = timeRemaining === 'Expired';

  const pricePerDay = typeof item.pricePerDay === 'number'
    ? item.pricePerDay
    : Number(item.pricePerDay);

  const totalAmount = typeof item.totalAmount === 'number'
    ? item.totalAmount
    : Number(item.totalAmount);

  const platformFee = typeof item.platformFee === 'number'
    ? item.platformFee
    : Number(item.platformFee);

  const handleSaveEdit = () => {
    if (!editStartDate || !editEndDate) {
      alert('Please select both start and end dates');
      return;
    }

    const startDate = new Date(editStartDate);
    const endDate = new Date(editEndDate);

    if (endDate <= startDate) {
      alert('End date must be after start date');
      return;
    }

    onSaveEdit(item.id, startDate, endDate);
  };

  return (
    <div className={`bg-slate-800 rounded-xl border-2 p-6 transition-all shadow-xl ${
      isExpired ? 'border-red-500/20 bg-red-500/5' : 'border-slate-700 hover:border-slate-600'
    }`}>
      {/* Space Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex space-x-4">
          {/* Space Image */}
          <div className="w-16 h-16 bg-slate-900 rounded-lg overflow-hidden shrink-0 relative">
            <img
              src={item.space.images?.[0] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400'}
              alt={item.space.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400';
              }}
            />
            {item.space.images && item.space.images.length > 1 && (
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-blue-600 rounded text-[10px] font-bold text-white">
                {item.space.images.length}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white">{item.space.title}</h3>
            <p className="text-sm text-slate-400 flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {item.space.address}, {item.space.city}
            </p>
            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-slate-900/50 text-slate-300 rounded">
              {item.space.type.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Reservation Timer */}
        <div className="text-right">
          <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
            isExpired
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
          }`}>
            <Clock className="h-3 w-3 mr-1" />
            {isExpired ? 'Reservation Expired' : `${timeRemaining} left`}
          </div>
        </div>
      </div>

      {/* Booking Details */}
      {isEditing ? (
        <div className="border border-slate-600 rounded-lg p-4 mb-4 bg-slate-900/50">
          <h4 className="font-medium text-white mb-3">Edit Campaign Dates</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
              <input
                type="date"
                value={editStartDate}
                onChange={(e) => setEditStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">End Date</label>
              <input
                type="date"
                value={editEndDate}
                onChange={(e) => setEditEndDate(e.target.value)}
                min={editStartDate}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={onCancelEdit}
              disabled={isUpdating}
              className="px-3 py-1.5 text-sm text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-900 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={isUpdating}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div>
            <p className="text-slate-400">Start Date</p>
            <p className="font-medium text-white">{formatDate(item.startDate)}</p>
          </div>
          <div>
            <p className="text-slate-400">End Date</p>
            <p className="font-medium text-white">{formatDate(item.endDate)}</p>
          </div>
          <div>
            <p className="text-slate-400">Duration</p>
            <p className="font-medium text-white">{item.totalDays} days</p>
          </div>
          <div>
            <p className="text-slate-400">Daily Rate</p>
            <p className="font-medium text-white">${pricePerDay.toFixed(2)}/day</p>
          </div>
        </div>
      )}

      {/* Pricing and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-600">
        <div className="text-right">
          <p className="text-sm text-slate-400">Campaign: {item.campaign.name}</p>
          <p className="text-lg font-bold text-white">${totalAmount.toFixed(2)}</p>
          <p className="text-xs text-slate-500">+ ${platformFee.toFixed(2)} platform fee</p>
        </div>

        <div className="flex items-center space-x-2">
          {!isEditing && (
            <button
              onClick={onEdit}
              disabled={isUpdating}
              className="p-2 text-slate-400 hover:text-blue-400 transition-colors disabled:opacity-50 rounded-lg hover:bg-slate-900/50"
              title="Edit dates"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onRemove}
            disabled={isRemoving}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50 rounded-lg hover:bg-slate-900/50"
            title="Remove from cart"
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
