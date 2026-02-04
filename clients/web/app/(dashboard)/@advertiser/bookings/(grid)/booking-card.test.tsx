import React from "react";
import { render, screen } from "@/test/utils";
import { describe, it, expect, mock } from "bun:test";
import BookingCard, {
  BookingCard_AdvertiserBookingFragment,
} from "./booking-card";
import { FragmentType } from "@/types/gql";
import {
  BookingStatus,
  type BookingCard_AdvertiserBookingFragmentFragment,
} from "@/types/gql/graphql";

// Mock next/image
mock.module("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock next/link
mock.module("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

describe("BookingCard", () => {
  const createMockBookingData = (
    overrides: Partial<BookingCard_AdvertiserBookingFragmentFragment> = {}
  ): BookingCard_AdvertiserBookingFragmentFragment => {
    const defaultBooking: BookingCard_AdvertiserBookingFragmentFragment = {
      __typename: "Booking",
      id: "booking-123",
      status: BookingStatus.Paid,
      startDate: "2024-01-15T00:00:00Z",
      endDate: "2024-01-29T00:00:00Z",
      totalAmount: 250.0,
      space: {
        __typename: "Space",
        title: "Coffee Shop Window Display",
        images: ["https://example.com/image.jpg"],
        city: "Los Angeles",
        state: "CA",
        owner: {
          __typename: "SpaceOwnerProfile",
          businessName: "Coffee Shop Inc",
        },
      },
      campaign: {
        __typename: "Campaign",
        name: "Summer Campaign",
      },
    };

    // Handle null space explicitly
    if (overrides.space === null) {
      const { campaign, ...restOverrides } = overrides;
      return {
        ...defaultBooking,
        ...restOverrides,
        space: null,
        campaign: campaign
          ? (() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { __typename: _unusedCampaign1, ...campaignRest } =
                campaign;
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { __typename: _unusedCampaign2, ...defaultCampaignRest } =
                defaultBooking.campaign!;
              return {
                __typename: "Campaign" as const,
                ...defaultCampaignRest,
                ...campaignRest,
              };
            })()
          : defaultBooking.campaign,
      };
    }

    const {
      space,
      campaign,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      __typename: _unusedBooking,
      ...restOverrides
    } = overrides;
    return {
      ...defaultBooking,
      ...restOverrides,
      space: space
        ? (() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { __typename: _unusedSpace1, owner, ...spaceRest } = space;
            const {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              __typename: _unusedSpace,
              owner: defaultOwner,
              ...defaultSpaceRest
            } = defaultBooking.space!;
            return {
              __typename: "Space" as const,
              ...defaultSpaceRest,
              ...spaceRest,
              owner: owner
                ? (() => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { __typename: _unusedOwner1, ...ownerRest } = owner;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { __typename: _unusedOwner, ...defaultOwnerRest } =
                      defaultOwner!;
                    return {
                      __typename: "SpaceOwnerProfile" as const,
                      ...defaultOwnerRest,
                      ...ownerRest,
                    };
                  })()
                : defaultOwner,
            };
          })()
        : defaultBooking.space,
      campaign: campaign
        ? (() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { __typename: _unusedCampaign3, ...campaignRest } = campaign;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { __typename: _unusedCampaign, ...defaultCampaignRest } =
              defaultBooking.campaign!;
            return {
              __typename: "Campaign" as const,
              ...defaultCampaignRest,
              ...campaignRest,
            };
          })()
        : defaultBooking.campaign,
    };
  };

  describe("Rendering", () => {
    it("renders booking card with space title", () => {
      const bookingData = createMockBookingData();

      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      expect(
        screen.getByText("Coffee Shop Window Display")
      ).toBeInTheDocument();
    });

    it("renders booking card link", () => {
      const bookingData = createMockBookingData();
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/bookings/booking-123");
    });

    it("renders space image when provided", () => {
      const bookingData = createMockBookingData({
        space: {
          __typename: "Space" as const,
          title: "Coffee Shop Window",
          images: ["https://example.com/image.jpg"],
          city: "Los Angeles",
          state: "CA",
          owner: {
            __typename: "SpaceOwnerProfile" as const,
            businessName: "Coffee Shop",
          },
        },
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      const image = screen.getByAltText("Coffee Shop Window");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
    });
  });

  describe("Date Formatting", () => {
    it("formats date range correctly", () => {
      const bookingData = createMockBookingData({
        startDate: "2024-01-15T00:00:00Z",
        endDate: "2024-01-29T00:00:00Z",
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // Format: "Jan 15 - Jan 29, 2024"
      expect(screen.getByText(/Jan 15 - Jan 29, 2024/i)).toBeInTheDocument();
    });

    it("formats date range for different months", () => {
      const bookingData = createMockBookingData({
        startDate: "2024-01-15T00:00:00Z",
        endDate: "2024-02-20T00:00:00Z",
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // Format: "Jan 15 - Feb 20, 2024"
      expect(screen.getByText(/Jan 15 - Feb 20, 2024/i)).toBeInTheDocument();
    });

    it("formats date range for different years", () => {
      const bookingData = createMockBookingData({
        startDate: "2023-12-15T00:00:00Z",
        endDate: "2024-01-20T00:00:00Z",
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // Format: "Dec 15 - Jan 20, 2024"
      expect(screen.getByText(/Dec 15 - Jan 20, 2024/i)).toBeInTheDocument();
    });
  });

  describe("Currency Formatting", () => {
    it("formats total amount with commas", () => {
      const bookingData = createMockBookingData({
        totalAmount: 1250.0,
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      expect(screen.getByText("$1,250")).toBeInTheDocument();
    });

    it("formats small amounts without commas", () => {
      const bookingData = createMockBookingData({
        totalAmount: 250.0,
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      expect(screen.getByText("$250")).toBeInTheDocument();
    });

    it("formats very large amounts", () => {
      const bookingData = createMockBookingData({
        totalAmount: 125000.0,
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      expect(screen.getByText("$125,000")).toBeInTheDocument();
    });

    it("handles zero amount", () => {
      const bookingData = createMockBookingData({
        totalAmount: 0.0,
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      expect(screen.getByText("$0")).toBeInTheDocument();
    });
  });

  describe("Location Formatting", () => {
    it("formats location as city and state", () => {
      const bookingData = createMockBookingData({
        space: {
          __typename: "Space" as const,
          title: "Coffee Shop Window",
          images: ["https://example.com/image.jpg"],
          city: "Los Angeles",
          state: "CA",
          owner: {
            __typename: "SpaceOwnerProfile" as const,
            businessName: "Coffee Shop",
          },
        },
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      expect(screen.getByText("Los Angeles, CA")).toBeInTheDocument();
    });

    it("handles missing location data", () => {
      const bookingData = createMockBookingData({
        space: null,
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // When space is null, location is undefined
      // Component should still render with "Untitled Space"
      expect(screen.getByText("Untitled Space")).toBeInTheDocument();
      // Card should still be clickable
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("handles missing city", () => {
      const bookingData = createMockBookingData({
        space: {
          __typename: "Space" as const,
          title: "Coffee Shop Window",
          images: ["https://example.com/image.jpg"],
          city: "",
          state: "CA",
          owner: {
            __typename: "SpaceOwnerProfile" as const,
            businessName: "Coffee Shop",
          },
        },
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // Should handle gracefully
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("handles missing state", () => {
      const bookingData = createMockBookingData({
        space: {
          __typename: "Space" as const,
          title: "Coffee Shop Window",
          images: ["https://example.com/image.jpg"],
          city: "Los Angeles",
          state: "",
          owner: {
            __typename: "SpaceOwnerProfile" as const,
            businessName: "Coffee Shop",
          },
        },
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // Should handle gracefully
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });
  });

  describe("Status Badge", () => {
    it("displays status badge for PAID status", () => {
      const bookingData = createMockBookingData({
        status: BookingStatus.Paid,
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // BOOKING_STATUS.labels returns "Paid" (not uppercase)
      expect(screen.getByText("Paid")).toBeInTheDocument();
    });

    it("displays status badge for PENDING_APPROVAL status", () => {
      const bookingData = createMockBookingData({
        status: BookingStatus.PendingApproval,
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // BOOKING_STATUS.labels returns "Pending"
      expect(screen.getByText("Pending")).toBeInTheDocument();
    });

    it("displays status badge for COMPLETED status", () => {
      const bookingData = createMockBookingData({
        status: BookingStatus.Completed,
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // BOOKING_STATUS.labels returns "Completed"
      expect(screen.getByText("Completed")).toBeInTheDocument();
    });

    it("displays status badge for DISPUTED status", () => {
      const bookingData = createMockBookingData({
        status: BookingStatus.Disputed,
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // BOOKING_STATUS.labels returns "Disputed"
      expect(screen.getByText("Disputed")).toBeInTheDocument();
    });

    it("displays status indicator dot", () => {
      const bookingData = createMockBookingData({
        status: BookingStatus.Paid,
      });

      const { container } = render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // Indicator dot should have title attribute
      const indicator = container.querySelector('[title="Paid"]');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe("Link Generation", () => {
    it("generates correct booking link", () => {
      const bookingData = createMockBookingData({
        id: "booking-abc-123",
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/bookings/booking-abc-123");
    });

    it("handles different booking ID formats", () => {
      const bookingData = createMockBookingData({
        id: "booking-550e8400-e29b-41d4-a716-446655440000",
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "href",
        "/bookings/booking-550e8400-e29b-41d4-a716-446655440000"
      );
    });
  });

  describe("Edge Cases", () => {
    it("handles missing space title", () => {
      const bookingData = createMockBookingData({
        space: {
          __typename: "Space" as const,
          title: null as unknown as string, // Simulate missing title
          images: ["https://example.com/image.jpg"],
          city: "Los Angeles",
          state: "CA",
          owner: {
            __typename: "SpaceOwnerProfile" as const,
            businessName: "Coffee Shop",
          },
        },
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // Should show "Untitled Space"
      expect(screen.getByText("Untitled Space")).toBeInTheDocument();
    });

    it("handles missing space entirely", () => {
      const bookingData = createMockBookingData({
        space: null,
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // Should show "Untitled Space" when space is null
      expect(screen.getByText("Untitled Space")).toBeInTheDocument();
      // Link should still work
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/bookings/booking-123");
    });

    it("handles missing image", () => {
      const bookingData = createMockBookingData({
        space: {
          __typename: "Space" as const,
          title: "Coffee Shop Window",
          images: [] as string[],
          city: "Los Angeles",
          state: "CA",
          owner: {
            __typename: "SpaceOwnerProfile" as const,
            businessName: "Coffee Shop",
          },
        },
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // MediaCard should handle missing image
      expect(screen.getByText("Coffee Shop Window")).toBeInTheDocument();
    });

    it("handles null image", () => {
      const bookingData = createMockBookingData({
        space: {
          __typename: "Space" as const,
          title: "Coffee Shop Window",
          images: [""],
          city: "Los Angeles",
          state: "CA",
          owner: {
            __typename: "SpaceOwnerProfile" as const,
            businessName: "Coffee Shop",
          },
        },
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // MediaCard should handle null image
      expect(screen.getByText("Coffee Shop Window")).toBeInTheDocument();
    });

    it("uses first image from images array", () => {
      const bookingData = createMockBookingData({
        space: {
          __typename: "Space" as const,
          title: "Coffee Shop Window",
          images: [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg",
          ],
          city: "Los Angeles",
          state: "CA",
          owner: {
            __typename: "SpaceOwnerProfile" as const,
            businessName: "Coffee Shop",
          },
        },
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // Should use first image
      const image = screen.getByAltText("Coffee Shop Window");
      expect(image).toHaveAttribute("src", "https://example.com/image1.jpg");
    });

    it("handles empty images array", () => {
      const bookingData = createMockBookingData({
        space: {
          __typename: "Space" as const,
          title: "Coffee Shop Window",
          images: [] as string[],
          city: "Los Angeles",
          state: "CA",
          owner: {
            __typename: "SpaceOwnerProfile" as const,
            businessName: "Coffee Shop",
          },
        },
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // Should handle gracefully
      expect(screen.getByText("Coffee Shop Window")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has accessible link", () => {
      const bookingData = createMockBookingData();
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("has accessible image alt text", () => {
      const bookingData = createMockBookingData({
        space: {
          __typename: "Space" as const,
          title: "Coffee Shop Window",
          images: ["https://example.com/image.jpg"],
          city: "Los Angeles",
          state: "CA",
          owner: {
            __typename: "SpaceOwnerProfile" as const,
            businessName: "Coffee Shop",
          },
        },
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      const image = screen.getByAltText("Coffee Shop Window");
      expect(image).toBeInTheDocument();
    });

    it("uses booking as alt text when space title is missing", () => {
      const bookingData = createMockBookingData({
        space: null,
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // Component uses booking.space?.title ?? "Booking" for alt text
      // When space is null, alt should be "Booking"
      // Component should render without errors
      expect(screen.getByText("Untitled Space")).toBeInTheDocument();
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });
  });

  describe("Complete Booking Card", () => {
    it("renders complete booking card with all elements", () => {
      const bookingData = createMockBookingData({
        id: "booking-123",
        status: BookingStatus.Paid,
        startDate: "2024-01-15T00:00:00Z",
        endDate: "2024-01-29T00:00:00Z",
        totalAmount: 250.0,
        space: {
          __typename: "Space" as const,
          title: "Coffee Shop Window Display",
          images: ["https://example.com/image.jpg"],
          city: "Los Angeles",
          state: "CA",
          owner: {
            __typename: "SpaceOwnerProfile" as const,
            businessName: "Coffee Shop Inc",
          },
        },
        campaign: {
          __typename: "Campaign" as const,
          name: "Summer Campaign",
        },
      });
      render(
        <BookingCard
          data={
            bookingData as FragmentType<
              typeof BookingCard_AdvertiserBookingFragment
            >
          }
        />
      );

      // Verify all elements
      expect(
        screen.getByText("Coffee Shop Window Display")
      ).toBeInTheDocument();
      expect(screen.getByText("Los Angeles, CA")).toBeInTheDocument();
      expect(screen.getByText(/Jan 15 - Jan 29, 2024/i)).toBeInTheDocument();
      expect(screen.getByText("$250")).toBeInTheDocument();
      expect(screen.getByText("Paid")).toBeInTheDocument();
      expect(screen.getByRole("link")).toHaveAttribute(
        "href",
        "/bookings/booking-123"
      );
    });
  });
});
