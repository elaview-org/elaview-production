// src/hooks/useSpaceOwnerOnboarding.ts
"use client";

import { useState, useEffect } from 'react';
import { api } from '../../../elaview-mvp/src/trpc/react';

interface OnboardingState {
  shouldShowOnboarding: boolean;
  isLoading: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  markComplete: () => void;
}

/**
 * Hook to manage first-time space owner onboarding flow.
 * Automatically detects if user needs onboarding and provides controls.
 *
 * Usage:
 * ```tsx
 * const onboarding = useSpaceOwnerOnboarding();
 *
 * return (
 *   <>
 *     {onboarding.shouldShowOnboarding && (
 *       <FirstTimeSpaceOwnerOnboarding
 *         open={onboarding.shouldShowOnboarding}
 *         onComplete={onboarding.markComplete}
 *         onClose={onboarding.closeOnboarding}
 *       />
 *     )}
 *   </>
 * );
 * ```
 */
export function useSpaceOwnerOnboarding(): OnboardingState {
  const [shouldShow, setShouldShow] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  // Get current user data
  const { data: currentUser, isLoading: userLoading } =
    api.user.getCurrentUser.useQuery();

  // Get Stripe account status
  const { data: accountStatus, isLoading: accountLoading } =
    api.billing.getConnectAccountStatus.useQuery(undefined, {
      enabled: currentUser?.role === 'SPACE_OWNER',
    });

  // Check if user needs onboarding
  useEffect(() => {
    if (userLoading || accountLoading || hasChecked) {
      return;
    }

    // Only show for space owners
    if (currentUser?.role !== 'SPACE_OWNER') {
      setHasChecked(true);
      return;
    }

    // Check if they've already completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('spaceOwnerOnboardingComplete');
    if (hasCompletedOnboarding === 'true') {
      setHasChecked(true);
      return;
    }

    // Show onboarding if they haven't completed Stripe setup
    const needsOnboarding = !accountStatus?.onboardingComplete;

    console.log('[ONBOARDING HOOK] Check result:', {
      role: currentUser?.role,
      onboardingComplete: accountStatus?.onboardingComplete,
      needsOnboarding,
    });

    setShouldShow(needsOnboarding);
    setHasChecked(true);
  }, [currentUser, accountStatus, userLoading, accountLoading, hasChecked]);

  const openOnboarding = () => {
    console.log('[ONBOARDING HOOK] Opening onboarding modal');
    setShouldShow(true);
  };

  const closeOnboarding = () => {
    console.log('[ONBOARDING HOOK] Closing onboarding modal');
    setShouldShow(false);
  };

  const markComplete = () => {
    console.log('[ONBOARDING HOOK] Marking onboarding as complete');
    localStorage.setItem('spaceOwnerOnboardingComplete', 'true');
    setShouldShow(false);
  };

  return {
    shouldShowOnboarding: shouldShow,
    isLoading: userLoading || accountLoading,
    openOnboarding,
    closeOnboarding,
    markComplete,
  };
}

/**
 * Hook specifically for triggering onboarding when user switches to space owner role.
 * Use this in the role switcher component.
 */
export function useRoleSwitchOnboarding() {
  const [justSwitched, setJustSwitched] = useState(false);

  const handleRoleSwitch = (newRole: string) => {
    if (newRole === 'SPACE_OWNER') {
      // Clear any existing completion flag when switching to space owner
      localStorage.removeItem('spaceOwnerOnboardingComplete');
      setJustSwitched(true);
    }
  };

  const resetSwitchFlag = () => {
    setJustSwitched(false);
  };

  return {
    justSwitchedToSpaceOwner: justSwitched,
    handleRoleSwitch,
    resetSwitchFlag,
  };
}
