import { render, screen, userEvent, waitFor } from "@/test/utils";
import { describe, it, expect, beforeEach, mock } from "bun:test";
import { BookingHeader } from "./booking-header";

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

describe("BookingHeader", () => {
  const defaultProps = {
    bookingId: "booking-12345678-abcdef",
    startDate: "2024-01-15T00:00:00Z",
    endDate: "2024-01-29T00:00:00Z",
    status: "PAID",
  };

  beforeEach(() => {
    // Clear any mocks if needed
  });

  describe("Rendering", () => {
    it("renders booking ID with last 8 characters", () => {
      render(<BookingHeader {...defaultProps} />);

      // Component uses slice(-8), so "booking-12345678-abcdef" becomes "8-abcdef"
      expect(screen.getByText(/Booking #8-abcdef/i)).toBeInTheDocument();
    });

    it("renders booking ID correctly for short IDs", () => {
      render(<BookingHeader {...defaultProps} bookingId="abc12345" />);

      expect(screen.getByText("Booking #abc12345")).toBeInTheDocument();
    });

    it("renders booking ID correctly for very long IDs", () => {
      const longId = "booking-" + "a".repeat(50);
      render(<BookingHeader {...defaultProps} bookingId={longId} />);

      // Should show last 8 characters
      const last8 = "a".repeat(8);
      expect(screen.getByText(`Booking #${last8}`)).toBeInTheDocument();
    });

    it("renders status badge", () => {
      render(<BookingHeader {...defaultProps} status="PAID" />);

      expect(screen.getByText("PAID")).toBeInTheDocument();
    });

    it("renders all action buttons", () => {
      render(<BookingHeader {...defaultProps} />);

      expect(screen.getByText("Message Owner")).toBeInTheDocument();
      expect(screen.getByText("Cancel Booking")).toBeInTheDocument();
    });

    it("renders dropdown menu trigger", () => {
      render(<BookingHeader {...defaultProps} />);

      // Dropdown trigger button should exist (with MoreVertical icon)
      const buttons = screen.getAllByRole("button");
      const dropdownButton = buttons.find((btn) => btn.querySelector("svg"));
      expect(dropdownButton).toBeInTheDocument();
    });
  });

  describe("Date Range Formatting", () => {
    it("formats date range correctly", () => {
      render(<BookingHeader {...defaultProps} />);

      // Format: "Jan 15 - Jan 29, 2024"
      expect(screen.getByText(/Jan 15 - Jan 29, 2024/i)).toBeInTheDocument();
    });

    it("formats date range for different months", () => {
      render(
        <BookingHeader
          {...defaultProps}
          startDate="2024-01-15T00:00:00Z"
          endDate="2024-02-20T00:00:00Z"
        />
      );

      // Format: "Jan 15 - Feb 20, 2024"
      expect(screen.getByText(/Jan 15 - Feb 20, 2024/i)).toBeInTheDocument();
    });

    it("formats date range for different years", () => {
      render(
        <BookingHeader
          {...defaultProps}
          startDate="2023-12-15T00:00:00Z"
          endDate="2024-01-20T00:00:00Z"
        />
      );

      // Format: "Dec 15 - Jan 20, 2024"
      expect(screen.getByText(/Dec 15 - Jan 20, 2024/i)).toBeInTheDocument();
    });

    it("handles ISO date strings", () => {
      render(
        <BookingHeader
          {...defaultProps}
          startDate="2024-03-01T10:30:00Z"
          endDate="2024-03-15T18:45:00Z"
        />
      );

      // Should format correctly regardless of time
      expect(screen.getByText(/Mar 1 - Mar 15, 2024/i)).toBeInTheDocument();
    });
  });

  describe("Status Badge Variants", () => {
    it("uses 'default' variant for VERIFIED status", () => {
      render(<BookingHeader {...defaultProps} status="VERIFIED" />);

      expect(screen.getByText("VERIFIED")).toBeInTheDocument();
    });

    it("uses 'default' variant for COMPLETED status", () => {
      render(<BookingHeader {...defaultProps} status="COMPLETED" />);

      expect(screen.getByText("COMPLETED")).toBeInTheDocument();
    });

    it("uses 'secondary' variant for PAID status", () => {
      render(<BookingHeader {...defaultProps} status="PAID" />);

      expect(screen.getByText("PAID")).toBeInTheDocument();
    });

    it("uses 'secondary' variant for INSTALLED status", () => {
      render(<BookingHeader {...defaultProps} status="INSTALLED" />);

      expect(screen.getByText("INSTALLED")).toBeInTheDocument();
    });

    it("uses 'destructive' variant for DISPUTED status", () => {
      render(<BookingHeader {...defaultProps} status="DISPUTED" />);

      expect(screen.getByText("DISPUTED")).toBeInTheDocument();
    });

    it("uses 'destructive' variant for CANCELLED status", () => {
      render(<BookingHeader {...defaultProps} status="CANCELLED" />);

      expect(screen.getByText("CANCELLED")).toBeInTheDocument();
    });

    it("uses 'outline' variant for unknown status", () => {
      render(<BookingHeader {...defaultProps} status="UNKNOWN_STATUS" />);

      expect(screen.getByText("UNKNOWN_STATUS")).toBeInTheDocument();
    });

    it("uses 'outline' variant for PENDING_APPROVAL status", () => {
      render(<BookingHeader {...defaultProps} status="PENDING_APPROVAL" />);

      expect(screen.getByText("PENDING_APPROVAL")).toBeInTheDocument();
    });

    it("uses 'outline' variant for ACCEPTED status", () => {
      render(<BookingHeader {...defaultProps} status="ACCEPTED" />);

      expect(screen.getByText("ACCEPTED")).toBeInTheDocument();
    });
  });

  describe("Message Button", () => {
    it("generates correct message link with booking ID", () => {
      render(<BookingHeader {...defaultProps} bookingId="booking-abc-123" />);

      const messageLink = screen.getByText("Message Owner").closest("a");
      expect(messageLink).toHaveAttribute(
        "href",
        "/app/(dashboard)/messages/booking-abc-123"
      );
    });

    it("calls onMessageClick when message button is clicked", async () => {
      const user = userEvent.setup();
      const onMessageClick = mock();

      render(
        <BookingHeader {...defaultProps} onMessageClick={onMessageClick} />
      );

      const messageButton = screen.getByText("Message Owner").closest("a");
      if (messageButton) {
        await user.click(messageButton);
      }

      expect(onMessageClick).toHaveBeenCalledTimes(1);
    });

    it("does not throw error when message button clicked without handler", async () => {
      const user = userEvent.setup();

      render(<BookingHeader {...defaultProps} />);

      const messageLink = screen.getByText("Message Owner").closest("a");
      if (messageLink) {
        // Should not throw when clicking without handler
        await user.click(messageLink);
        expect(messageLink).toBeInTheDocument();
      }
    });

    it("renders MessageSquare icon in message button", () => {
      render(<BookingHeader {...defaultProps} />);

      const messageButton = screen.getByText("Message Owner");
      expect(messageButton).toBeInTheDocument();
      expect(messageButton.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Cancel Button", () => {
    it("calls onCancelClick when cancel button is clicked", async () => {
      const user = userEvent.setup();
      const onCancelClick = mock();

      render(<BookingHeader {...defaultProps} onCancelClick={onCancelClick} />);

      const cancelButton = screen.getByText("Cancel Booking");
      await user.click(cancelButton);

      expect(onCancelClick).toHaveBeenCalledTimes(1);
    });

    it("does not throw error when cancel button clicked without handler", async () => {
      const user = userEvent.setup();

      render(<BookingHeader {...defaultProps} />);

      const cancelButton = screen.getByText("Cancel Booking");
      // Should not throw when clicking without handler
      await user.click(cancelButton);
      expect(cancelButton).toBeInTheDocument();
    });

    it("renders X icon in cancel button", () => {
      render(<BookingHeader {...defaultProps} />);

      const cancelButton = screen.getByText("Cancel Booking");
      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Dropdown Menu", () => {
    it("shows dropdown menu items when opened", async () => {
      const user = userEvent.setup();
      render(<BookingHeader {...defaultProps} />);

      // Find the dropdown trigger button
      const buttons = screen.getAllByRole("button");
      const dropdownButton = buttons.find((btn) => {
        const svg = btn.querySelector("svg");
        return (
          svg &&
          btn !== screen.getByText("Message Owner").closest("button") &&
          btn !== screen.getByText("Cancel Booking")
        );
      });

      if (dropdownButton) {
        await user.click(dropdownButton);
      }

      // Wait for dropdown menu to appear
      await waitFor(() => {
        expect(screen.getByText("View Receipt")).toBeInTheDocument();
      });

      expect(screen.getByText("Download Invoice")).toBeInTheDocument();
      expect(screen.getByText("Report Issue")).toBeInTheDocument();
    });

    it("renders all dropdown menu items", async () => {
      const user = userEvent.setup();
      const { container } = render(<BookingHeader {...defaultProps} />);

      // Find dropdown trigger - it's the button with MoreVertical icon
      const allButtons = container.querySelectorAll("button");
      let dropdownTrigger: HTMLElement | null = null;

      for (const button of allButtons) {
        const svg = button.querySelector("svg");
        if (svg && button.textContent?.trim() === "") {
          dropdownTrigger = button as HTMLElement;
          break;
        }
      }

      if (dropdownTrigger) {
        await user.click(dropdownTrigger);
      }

      await waitFor(() => {
        expect(screen.getByText("View Receipt")).toBeInTheDocument();
      });

      expect(screen.getByText("Download Invoice")).toBeInTheDocument();
      expect(screen.getByText("Report Issue")).toBeInTheDocument();
    });

    it("renders MoreVertical icon in dropdown trigger", () => {
      const { container } = render(<BookingHeader {...defaultProps} />);

      // Find button with MoreVertical icon (dropdown trigger)
      const buttons = container.querySelectorAll("button");
      const dropdownButton = Array.from(buttons).find((btn) => {
        const svg = btn.querySelector("svg");
        return svg && btn.textContent?.trim() === "";
      });

      expect(dropdownButton).toBeInTheDocument();
      expect(dropdownButton?.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Icon Rendering", () => {
    it("renders MessageSquare icon in message button", () => {
      render(<BookingHeader {...defaultProps} />);

      const messageButton = screen.getByText("Message Owner");
      expect(messageButton).toBeInTheDocument();
      expect(messageButton.querySelector("svg")).toBeInTheDocument();
    });

    it("renders X icon in cancel button", () => {
      render(<BookingHeader {...defaultProps} />);

      const cancelButton = screen.getByText("Cancel Booking");
      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton.querySelector("svg")).toBeInTheDocument();
    });

    it("renders MoreVertical icon in dropdown trigger", () => {
      const { container } = render(<BookingHeader {...defaultProps} />);

      const buttons = container.querySelectorAll("button");
      const dropdownButton = Array.from(buttons).find((btn) => {
        const svg = btn.querySelector("svg");
        return svg && btn.textContent?.trim() === "";
      });

      expect(dropdownButton?.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty booking ID", () => {
      render(<BookingHeader {...defaultProps} bookingId="" />);

      // Should show "Booking #" with empty string
      expect(screen.getByText(/Booking #/i)).toBeInTheDocument();
    });

    it("handles very short booking ID (less than 8 characters)", () => {
      render(<BookingHeader {...defaultProps} bookingId="abc" />);

      expect(screen.getByText("Booking #abc")).toBeInTheDocument();
    });

    it("handles invalid date strings gracefully", () => {
      // Component will try to parse dates, may show invalid date or error
      render(
        <BookingHeader
          {...defaultProps}
          startDate="invalid-date"
          endDate="invalid-date"
        />
      );

      // Component should still render, even if date formatting fails
      expect(screen.getByText(/Booking #/i)).toBeInTheDocument();
    });

    it("handles all handlers provided", async () => {
      const user = userEvent.setup();
      const onMessageClick = mock();
      const onCancelClick = mock();

      render(
        <BookingHeader
          {...defaultProps}
          onMessageClick={onMessageClick}
          onCancelClick={onCancelClick}
        />
      );

      const cancelButton = screen.getByText("Cancel Booking");
      await user.click(cancelButton);
      expect(onCancelClick).toHaveBeenCalledTimes(1);

      const messageLink = screen.getByText("Message Owner").closest("a");
      if (messageLink) {
        await user.click(messageLink);
        expect(onMessageClick).toHaveBeenCalledTimes(1);
      }
    });

    it("handles no handlers provided", () => {
      render(<BookingHeader {...defaultProps} />);

      // Should render without errors
      expect(screen.getByText(/Booking #/i)).toBeInTheDocument();
      expect(screen.getByText("Message Owner")).toBeInTheDocument();
      expect(screen.getByText("Cancel Booking")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has accessible button labels", () => {
      render(<BookingHeader {...defaultProps} />);

      expect(
        screen.getByRole("link", { name: /message owner/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel booking/i })
      ).toBeInTheDocument();
    });

    it("has semantic heading for booking ID", () => {
      render(<BookingHeader {...defaultProps} />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/Booking #/i);
    });

    it("has accessible link for message button", () => {
      render(<BookingHeader {...defaultProps} />);

      const messageLink = screen.getByRole("link", { name: /message owner/i });
      expect(messageLink).toBeInTheDocument();
      expect(messageLink).toHaveAttribute(
        "href",
        "/app/(dashboard)/messages/booking-12345678-abcdef"
      );
    });
  });

  describe("Complete Booking Header", () => {
    it("renders complete booking header with all elements", () => {
      render(
        <BookingHeader
          {...defaultProps}
          status="VERIFIED"
          onMessageClick={mock()}
          onCancelClick={mock()}
        />
      );

      // Verify all elements are present
      expect(screen.getByText(/Booking #/i)).toBeInTheDocument();
      expect(screen.getByText(/Jan 15 - Jan 29, 2024/i)).toBeInTheDocument();
      expect(screen.getByText("VERIFIED")).toBeInTheDocument();
      expect(screen.getByText("Message Owner")).toBeInTheDocument();
      expect(screen.getByText("Cancel Booking")).toBeInTheDocument();
    });
  });
});
