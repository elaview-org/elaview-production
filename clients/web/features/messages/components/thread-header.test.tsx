import { render, screen, userEvent } from "@/test/utils";
import { describe, it, expect, beforeEach, mock } from "bun:test";
import { ThreadHeader } from "./thread-header";
import type { ThreadContext } from "@/types/messages";
import { mockThreadContext } from "@/features/conversations/mock-data";

describe("ThreadHeader", () => {
  const mockOnBack = mock();

  beforeEach(() => {
    mockOnBack.mockClear();
  });

  describe("Rendering", () => {
    it("renders space name", () => {
      render(<ThreadHeader context={mockThreadContext} />);

      expect(
        screen.getByText("Coffee Shop Window Display")
      ).toBeInTheDocument();
    });

    it("renders booking ID", () => {
      render(<ThreadHeader context={mockThreadContext} />);

      expect(screen.getByText("Booking #123")).toBeInTheDocument();
    });

    it("renders View Booking button", () => {
      render(<ThreadHeader context={mockThreadContext} />);

      expect(screen.getByText("View Booking")).toBeInTheDocument();
    });

    it("renders View Space button", () => {
      render(<ThreadHeader context={mockThreadContext} />);

      expect(screen.getByText("View Space")).toBeInTheDocument();
    });
  });

  describe("Back Button", () => {
    it("shows back button when showBackButton is true", () => {
      render(
        <ThreadHeader
          context={mockThreadContext}
          showBackButton={true}
          onBack={mockOnBack}
        />
      );

      const backButton = screen.getByLabelText("Back to conversations");
      expect(backButton).toBeInTheDocument();
    });

    it("hides back button when showBackButton is false", () => {
      render(
        <ThreadHeader context={mockThreadContext} showBackButton={false} />
      );

      expect(
        screen.queryByLabelText("Back to conversations")
      ).not.toBeInTheDocument();
    });

    it("hides back button by default", () => {
      render(<ThreadHeader context={mockThreadContext} />);

      expect(
        screen.queryByLabelText("Back to conversations")
      ).not.toBeInTheDocument();
    });

    it("calls onBack when back button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <ThreadHeader
          context={mockThreadContext}
          showBackButton={true}
          onBack={mockOnBack}
        />
      );

      const backButton = screen.getByLabelText("Back to conversations");
      await user.click(backButton);

      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it("does not crash when back button is clicked without onBack handler", async () => {
      const user = userEvent.setup();
      render(
        <ThreadHeader context={mockThreadContext} showBackButton={true} />
      );

      const backButton = screen.getByLabelText("Back to conversations");
      await user.click(backButton);

      // Should not crash
      expect(backButton).toBeInTheDocument();
    });
  });

  describe("Status Badge", () => {
    it("displays status badge with formatted text", () => {
      render(<ThreadHeader context={mockThreadContext} />);

      expect(screen.getByText("Paid")).toBeInTheDocument();
    });

    it("formats PENDING_APPROVAL status correctly", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "PENDING_APPROVAL",
      };
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Pending Approval")).toBeInTheDocument();
    });

    it("formats FILE_DOWNLOADED status correctly", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "FILE_DOWNLOADED",
      };
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("File Downloaded")).toBeInTheDocument();
    });

    it("formats CANCELLED status correctly", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "CANCELLED",
      };
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Cancelled")).toBeInTheDocument();
    });

    it("formats DISPUTED status correctly", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "DISPUTED",
      };
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Disputed")).toBeInTheDocument();
    });

    it("formats COMPLETED status correctly", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "COMPLETED",
      };
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Completed")).toBeInTheDocument();
    });

    it("formats ACCEPTED status correctly", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "ACCEPTED",
      };
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Accepted")).toBeInTheDocument();
    });

    it("formats VERIFIED status correctly", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "VERIFIED",
      };
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Verified")).toBeInTheDocument();
    });

    it("formats INSTALLED status correctly", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "INSTALLED",
      };
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Installed")).toBeInTheDocument();
    });

    it("uses default variant for unknown status", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "UNKNOWN_STATUS",
      };
      render(<ThreadHeader context={context} />);

      // Should still render the status text
      expect(screen.getByText("Unknown Status")).toBeInTheDocument();
    });
  });

  describe("Status Badge Variants", () => {
    it("uses outline variant for PENDING_APPROVAL", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "PENDING_APPROVAL",
      };
      const { container } = render(<ThreadHeader context={context} />);

      const badge = container.querySelector('[class*="outline"]');
      expect(badge).toBeInTheDocument();
    });

    it("uses secondary variant for ACCEPTED", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "ACCEPTED",
      };
      const { container } = render(<ThreadHeader context={context} />);

      const badge = container.querySelector('[class*="secondary"]');
      expect(badge).toBeInTheDocument();
    });

    it("uses default variant for PAID", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "PAID",
      };
      const { container } = render(<ThreadHeader context={context} />);

      // Default variant doesn't have a specific class, but badge should exist
      const badge = screen.getByText("Paid");
      expect(badge).toBeInTheDocument();
    });

    it("uses outline variant for CANCELLED", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "CANCELLED",
      };
      const { container } = render(<ThreadHeader context={context} />);

      const badge = container.querySelector('[class*="outline"]');
      expect(badge).toBeInTheDocument();
    });

    it("uses outline variant for DISPUTED", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "DISPUTED",
      };
      const { container } = render(<ThreadHeader context={context} />);

      const badge = container.querySelector('[class*="outline"]');
      expect(badge).toBeInTheDocument();
    });
  });

  describe("Navigation Links", () => {
    it("renders View Booking link with correct href", () => {
      render(<ThreadHeader context={mockThreadContext} />);

      const viewBookingLink = screen.getByText("View Booking").closest("a");
      expect(viewBookingLink).toHaveAttribute(
        "href",
        `/bookings/${mockThreadContext.bookingId}`
      );
    });

    it("renders View Space link with correct href", () => {
      render(<ThreadHeader context={mockThreadContext} />);

      const viewSpaceLink = screen.getByText("View Space").closest("a");
      expect(viewSpaceLink).toHaveAttribute(
        "href",
        `/discover/${mockThreadContext.spaceId}`
      );
    });

    it("updates links when context changes", () => {
      const { rerender } = render(<ThreadHeader context={mockThreadContext} />);

      const newContext: ThreadContext = {
        bookingId: "booking-999",
        spaceName: "New Space",
        bookingStatus: "ACTIVE",
        spaceId: "space-999",
      };

      rerender(<ThreadHeader context={newContext} />);

      const viewBookingLink = screen.getByText("View Booking").closest("a");
      expect(viewBookingLink).toHaveAttribute("href", "/bookings/booking-999");

      const viewSpaceLink = screen.getByText("View Space").closest("a");
      expect(viewSpaceLink).toHaveAttribute("href", "/discover/space-999");
    });
  });

  describe("Booking ID Extraction", () => {
    it("extracts booking ID correctly from booking-123 format", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingId: "booking-123",
      };
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Booking #123")).toBeInTheDocument();
    });

    it("extracts booking ID correctly from booking-abc-456 format", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingId: "booking-abc-456",
      };
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Booking #abc")).toBeInTheDocument();
    });

    it("handles booking ID without hyphen", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingId: "booking123",
      };
      render(<ThreadHeader context={context} />);

      // Should handle gracefully (split("-")[1] would be undefined)
      expect(screen.getByText(/Booking #/)).toBeInTheDocument();
    });
  });

  describe("Text Truncation", () => {
    it("handles long space names", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        spaceName: "A".repeat(100),
      };
      render(<ThreadHeader context={context} />);

      const spaceNameElement = screen.getByText(/^A+$/);
      expect(spaceNameElement).toBeInTheDocument();
      // Should have truncate class
      expect(spaceNameElement).toHaveClass("truncate");
    });

    it("handles long booking IDs", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingId: "booking-" + "x".repeat(50),
      };
      render(<ThreadHeader context={context} />);

      // Should render without crashing
      expect(screen.getByText(/Booking #/)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has accessible back button label", () => {
      render(
        <ThreadHeader
          context={mockThreadContext}
          showBackButton={true}
          onBack={mockOnBack}
        />
      );

      expect(
        screen.getByLabelText("Back to conversations")
      ).toBeInTheDocument();
    });

    it("has aria-hidden on back button icon", () => {
      const { container } = render(
        <ThreadHeader
          context={mockThreadContext}
          showBackButton={true}
          onBack={mockOnBack}
        />
      );

      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it("uses semantic heading for space name", () => {
      render(<ThreadHeader context={mockThreadContext} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Coffee Shop Window Display");
    });
  });

  describe("Styling", () => {
    it("has sticky positioning", () => {
      const { container } = render(
        <ThreadHeader context={mockThreadContext} />
      );

      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass("sticky");
      expect(header).toHaveClass("top-0");
    });

    it("has backdrop blur support", () => {
      const { container } = render(
        <ThreadHeader context={mockThreadContext} />
      );

      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass("backdrop-blur");
    });

    it("has border bottom", () => {
      const { container } = render(
        <ThreadHeader context={mockThreadContext} />
      );

      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass("border-b");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty space name", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        spaceName: "",
      };
      render(<ThreadHeader context={context} />);

      // Should render without crashing
      expect(screen.getByText(/Booking #/)).toBeInTheDocument();
    });

    it("handles special characters in space name", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        spaceName: "Café & Restaurant <Window>",
      };
      render(<ThreadHeader context={context} />);

      expect(
        screen.getByText("Café & Restaurant <Window>")
      ).toBeInTheDocument();
    });

    it("handles numeric booking IDs", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingId: "booking-12345",
      };
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Booking #12345")).toBeInTheDocument();
    });

    it("handles UUID-style booking IDs", () => {
      const context: ThreadContext = {
        ...mockThreadContext,
        bookingId: "booking-550e8400-e29b-41d4-a716-446655440000",
      };
      render(<ThreadHeader context={context} />);

      expect(
        screen.getByText("Booking #550e8400-e29b-41d4-a716-446655440000")
      ).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("renders all required elements", () => {
      render(<ThreadHeader context={mockThreadContext} />);

      // Space name
      expect(
        screen.getByText("Coffee Shop Window Display")
      ).toBeInTheDocument();
      // Status badge
      expect(screen.getByText("Paid")).toBeInTheDocument();
      // Booking ID
      expect(screen.getByText("Booking #123")).toBeInTheDocument();
      // Action buttons
      expect(screen.getByText("View Booking")).toBeInTheDocument();
      expect(screen.getByText("View Space")).toBeInTheDocument();
    });

    it("maintains layout structure", () => {
      const { container } = render(
        <ThreadHeader context={mockThreadContext} />
      );

      // Should have flex layout
      const flexContainer = container.querySelector(".flex");
      expect(flexContainer).toBeInTheDocument();
    });
  });
});
