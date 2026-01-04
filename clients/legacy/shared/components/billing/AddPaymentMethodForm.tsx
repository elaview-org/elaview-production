// src/components/billing/AddPaymentMethodForm.tsx
"use client";

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { api } from '../../../../elaview-mvp/src/trpc/react';
import { toast } from 'sonner';

interface AddPaymentMethodFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddPaymentMethodForm({ onSuccess, onCancel }: AddPaymentMethodFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPaymentMethodMutation = api.billing.addPaymentMethod.useMutation({
    onSuccess: () => {
      toast.success('Payment method added successfully');
      onSuccess();
    },
    onError: (error) => {
      setError(error.message || 'Failed to add payment method');
      toast.error(error.message || 'Failed to add payment method');
      setLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method with Stripe
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Failed to create payment method');
      }

      if (!paymentMethod) {
        throw new Error('No payment method returned from Stripe');
      }

      console.log('Payment method created:', paymentMethod.id);

      // Send payment method to backend
      await addPaymentMethodMutation.mutateAsync({
        paymentMethodId: paymentMethod.id,
      });

    } catch (err: any) {
      console.error('Error adding payment method:', err);
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Card Element */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Card Information
        </label>
        <div className="border border-slate-700 bg-slate-800 rounded-lg p-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#ffffff',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  '::placeholder': {
                    color: '#64748b',
                  },
                },
                invalid: {
                  color: '#f87171',
                  iconColor: '#f87171',
                },
              },
              hidePostalCode: false,
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-400">Payment Error</h3>
              <p className="text-sm text-red-300 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info Message */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start">
          <ShieldCheck className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-400 mb-1">Secure Payment</h4>
            <p className="text-xs text-blue-300">
              Your card information is encrypted and secure. We use Stripe for payment processing and never store your full card details.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Adding...
            </>
          ) : (
            'Add Payment Method'
          )}
        </button>
      </div>
    </form>
  );
}