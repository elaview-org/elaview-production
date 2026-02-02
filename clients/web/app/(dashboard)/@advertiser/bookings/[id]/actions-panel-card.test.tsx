import { render, screen, userEvent } from "@/test/utils";
import { describe, it, expect, beforeEach, mock } from "bun:test";
import { ActionsPanelCard } from "./actions-panel-card";

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

describe("ActionsPanelCard", () => {
  const defaultProps = {
    bookingId: "booking-123",
    status: "PAID",
  };

  beforeEach(() => {
    // Clear any mocks if needed
  });

  describe("Rendering", () => {
    it("renders card with title", () => {
      render(<ActionsPanelCard {...defaultProps} />);

      expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    it("renders status badge with correct status", () => {
      render(<ActionsPanelCard {...defaultProps} status="VERIFIED" />);

      expect(screen.getByText("VERIFIED")).toBeInTheDocument();
    });

    it("renders all secondary action buttons", () => {
      render(<ActionsPanelCard {...defaultProps} />);

      expect(screen.getByText("Message Owner")).toBeInTheDocument();
      expect(screen.getByText("View Receipt")).toBeInTheDocument();
    });

    it("generates correct message link with booking ID", () => {
      render(<ActionsPanelCard {...defaultProps} bookingId="booking-abc-123" />);

      const messageLink = screen.getByText("Message Owner").closest("a");
      expect(messageLink).toHaveAttribute("href", "/messages/booking-abc-123");
    });
  });

  describe("Status-Based Action Hints", () => {
    it("shows 'Approve or Dispute' hint for VERIFIED status", () => {
      render(<ActionsPanelCard {...defaultProps} status="VERIFIED" />);

      expect(screen.getByText(/Next: Approve or Dispute/i)).toBeInTheDocument();
    });

    it("shows 'Waiting for file download' hint for PAID status", () => {
      render(<ActionsPanelCard {...defaultProps} status="PAID" />);

      expect(screen.getByText(/Next: Waiting for file download/i)).toBeInTheDocument();
    });

    it("shows 'Waiting for installation' hint for FILE_DOWNLOADED status", () => {
      render(<ActionsPanelCard {...defaultProps} status="FILE_DOWNLOADED" />);

      expect(screen.getByText(/Next: Waiting for installation/i)).toBeInTheDocument();
    });

    it("shows 'Waiting for verification' hint for INSTALLED status", () => {
      render(<ActionsPanelCard {...defaultProps} status="INSTALLED" />);

      expect(screen.getByText(/Next: Waiting for verification/i)).toBeInTheDocument();
    });

    it("shows 'Booking completed' hint for COMPLETED status", () => {
      render(<ActionsPanelCard {...defaultProps} status="COMPLETED" />);

      expect(screen.getByText(/Next: Booking completed/i)).toBeInTheDocument();
    });

    it("shows 'Dispute in progress' hint for DISPUTED status", () => {
      render(<ActionsPanelCard {...defaultProps} status="DISPUTED" />);

      expect(screen.getByText(/Next: Dispute in progress/i)).toBeInTheDocument();
    });

    it("shows 'No action required' hint for unknown status", () => {
      render(<ActionsPanelCard {...defaultProps} status="UNKNOWN_STATUS" />);

      expect(screen.getByText(/Next: No action required/i)).toBeInTheDocument();
    });

    it("shows 'No action required' hint for PENDING_APPROVAL status", () => {
      render(<ActionsPanelCard {...defaultProps} status="PENDING_APPROVAL" />);

      expect(screen.getByText(/Next: No action required/i)).toBeInTheDocument();
    });

    it("shows 'No action required' hint for ACCEPTED status", () => {
      render(<ActionsPanelCard {...defaultProps} status="ACCEPTED" />);

      expect(screen.getByText(/Next: No action required/i)).toBeInTheDocument();
    });
  });

  describe("Approve/Dispute Actions (VERIFIED status only)", () => {
    it("shows approve and dispute buttons for VERIFIED status", () => {
      render(<ActionsPanelCard {...defaultProps} status="VERIFIED" />);

      expect(screen.getByText("Approve Installation")).toBeInTheDocument();
      expect(screen.getByText("Open Dispute")).toBeInTheDocument();
    });

    it("does not show approve/dispute buttons for PAID status", () => {
      render(<ActionsPanelCard {...defaultProps} status="PAID" />);

      expect(screen.queryByText("Approve Installation")).not.toBeInTheDocument();
      expect(screen.queryByText("Open Dispute")).not.toBeInTheDocument();
    });

    it("does not show approve/dispute buttons for FILE_DOWNLOADED status", () => {
      render(<ActionsPanelCard {...defaultProps} status="FILE_DOWNLOADED" />);

      expect(screen.queryByText("Approve Installation")).not.toBeInTheDocument();
      expect(screen.queryByText("Open Dispute")).not.toBeInTheDocument();
    });

    it("does not show approve/dispute buttons for INSTALLED status", () => {
      render(<ActionsPanelCard {...defaultProps} status="INSTALLED" />);

      expect(screen.queryByText("Approve Installation")).not.toBeInTheDocument();
      expect(screen.queryByText("Open Dispute")).not.toBeInTheDocument();
    });

    it("does not show approve/dispute buttons for COMPLETED status", () => {
      render(<ActionsPanelCard {...defaultProps} status="COMPLETED" />);

      expect(screen.queryByText("Approve Installation")).not.toBeInTheDocument();
      expect(screen.queryByText("Open Dispute")).not.toBeInTheDocument();
    });

    it("calls onApproveClick when approve button is clicked", async () => {
      const user = userEvent.setup();
      const onApproveClick = mock();

      render(
        <ActionsPanelCard
          {...defaultProps}
          status="VERIFIED"
          onApproveClick={onApproveClick}
        />
      );

      const approveButton = screen.getByText("Approve Installation");
      await user.click(approveButton);

      expect(onApproveClick).toHaveBeenCalledTimes(1);
    });

    it("calls onDisputeClick when dispute button is clicked", async () => {
      const user = userEvent.setup();
      const onDisputeClick = mock();

      render(
        <ActionsPanelCard
          {...defaultProps}
          status="VERIFIED"
          onDisputeClick={onDisputeClick}
        />
      );

      const disputeButton = screen.getByText("Open Dispute");
      await user.click(disputeButton);

      expect(onDisputeClick).toHaveBeenCalledTimes(1);
    });

    it("does not throw error when approve button clicked without handler", async () => {
      const user = userEvent.setup();

      render(<ActionsPanelCard {...defaultProps} status="VERIFIED" />);

      const approveButton = screen.getByText("Approve Installation");
      // Should not throw when clicking without handler
      await user.click(approveButton);
      expect(approveButton).toBeInTheDocument();
    });

    it("does not throw error when dispute button clicked without handler", async () => {
      const user = userEvent.setup();

      render(<ActionsPanelCard {...defaultProps} status="VERIFIED" />);

      const disputeButton = screen.getByText("Open Dispute");
      // Should not throw when clicking without handler
      await user.click(disputeButton);
      expect(disputeButton).toBeInTheDocument();
    });
  });

  describe("Cancel Button Visibility", () => {
    it("shows cancel button for PENDING_APPROVAL status", () => {
      render(<ActionsPanelCard {...defaultProps} status="PENDING_APPROVAL" />);

      expect(screen.getByText("Cancel Booking")).toBeInTheDocument();
    });

    it("shows cancel button for ACCEPTED status", () => {
      render(<ActionsPanelCard {...defaultProps} status="ACCEPTED" />);

      expect(screen.getByText("Cancel Booking")).toBeInTheDocument();
    });

    it("shows cancel button for PAID status", () => {
      render(<ActionsPanelCard {...defaultProps} status="PAID" />);

      expect(screen.getByText("Cancel Booking")).toBeInTheDocument();
    });

    it("does not show cancel button for FILE_DOWNLOADED status", () => {
      render(<ActionsPanelCard {...defaultProps} status="FILE_DOWNLOADED" />);

      expect(screen.queryByText("Cancel Booking")).not.toBeInTheDocument();
    });

    it("does not show cancel button for INSTALLED status", () => {
      render(<ActionsPanelCard {...defaultProps} status="INSTALLED" />);

      expect(screen.queryByText("Cancel Booking")).not.toBeInTheDocument();
    });

    it("does not show cancel button for VERIFIED status", () => {
      render(<ActionsPanelCard {...defaultProps} status="VERIFIED" />);

      expect(screen.queryByText("Cancel Booking")).not.toBeInTheDocument();
    });

    it("does not show cancel button for COMPLETED status", () => {
      render(<ActionsPanelCard {...defaultProps} status="COMPLETED" />);

      expect(screen.queryByText("Cancel Booking")).not.toBeInTheDocument();
    });

    it("does not show cancel button for DISPUTED status", () => {
      render(<ActionsPanelCard {...defaultProps} status="DISPUTED" />);

      expect(screen.queryByText("Cancel Booking")).not.toBeInTheDocument();
    });

    it("calls onCancelClick when cancel button is clicked", async () => {
      const user = userEvent.setup();
      const onCancelClick = mock();

      render(
        <ActionsPanelCard
          {...defaultProps}
          status="PAID"
          onCancelClick={onCancelClick}
        />
      );

      const cancelButton = screen.getByText("Cancel Booking");
      await user.click(cancelButton);

      expect(onCancelClick).toHaveBeenCalledTimes(1);
    });

    it("does not throw error when cancel button clicked without handler", async () => {
      const user = userEvent.setup();

      render(<ActionsPanelCard {...defaultProps} status="PAID" />);

      const cancelButton = screen.getByText("Cancel Booking");
      // Should not throw when clicking without handler
      await user.click(cancelButton);
      expect(cancelButton).toBeInTheDocument();
    });
  });

  describe("Icon Rendering", () => {
    it("renders CheckCircle2 icon in approve button", () => {
      const { container } = render(
        <ActionsPanelCard {...defaultProps} status="VERIFIED" />
      );

      // CheckCircle2 icon should be present (lucide-react icons render as SVGs)
      const approveButton = screen.getByText("Approve Installation");
      expect(approveButton).toBeInTheDocument();
      // Icon is rendered inside the button
      expect(approveButton.querySelector("svg")).toBeInTheDocument();
    });

    it("renders AlertTriangle icon in dispute button", () => {
      const { container } = render(
        <ActionsPanelCard {...defaultProps} status="VERIFIED" />
      );

      const disputeButton = screen.getByText("Open Dispute");
      expect(disputeButton).toBeInTheDocument();
      expect(disputeButton.querySelector("svg")).toBeInTheDocument();
    });

    it("renders MessageSquare icon in message button", () => {
      render(<ActionsPanelCard {...defaultProps} />);

      const messageButton = screen.getByText("Message Owner");
      expect(messageButton).toBeInTheDocument();
      expect(messageButton.querySelector("svg")).toBeInTheDocument();
    });

    it("renders FileText icon in receipt button", () => {
      render(<ActionsPanelCard {...defaultProps} />);

      const receiptButton = screen.getByText("View Receipt");
      expect(receiptButton).toBeInTheDocument();
      expect(receiptButton.querySelector("svg")).toBeInTheDocument();
    });

    it("renders X icon in cancel button", () => {
      render(<ActionsPanelCard {...defaultProps} status="PAID" />);

      const cancelButton = screen.getByText("Cancel Booking");
      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty booking ID", () => {
      render(<ActionsPanelCard bookingId="" status="PAID" />);

      const messageLink = screen.getByText("Message Owner").closest("a");
      expect(messageLink).toHaveAttribute("href", "/messages/");
    });

    it("handles very long booking ID", () => {
      const longBookingId = "booking-" + "a".repeat(100);
      render(<ActionsPanelCard bookingId={longBookingId} status="PAID" />);

      const messageLink = screen.getByText("Message Owner").closest("a");
      expect(messageLink).toHaveAttribute("href", `/messages/${longBookingId}`);
    });

    it("handles status with extra whitespace", () => {
      // Component should handle status as-is (no trimming in component)
      render(<ActionsPanelCard {...defaultProps} status=" VERIFIED " />);

      // Status badge shows the status (may be normalized by Badge component)
      // The badge component may trim whitespace, so we check for the normalized text
      const statusBadge = screen.getByText(/VERIFIED/i);
      expect(statusBadge).toBeInTheDocument();
      // But action hint will use default case since it doesn't match exactly
      expect(screen.getByText(/Next: No action required/i)).toBeInTheDocument();
    });

    it("handles all handlers provided", async () => {
      const user = userEvent.setup();
      const onApproveClick = mock();
      const onDisputeClick = mock();
      const onCancelClick = mock();

      render(
        <ActionsPanelCard
          {...defaultProps}
          status="VERIFIED"
          onApproveClick={onApproveClick}
          onDisputeClick={onDisputeClick}
          onCancelClick={onCancelClick}
        />
      );

      // Cancel button should not be visible for VERIFIED
      expect(screen.queryByText("Cancel Booking")).not.toBeInTheDocument();

      // But approve and dispute should work
      await user.click(screen.getByText("Approve Installation"));
      expect(onApproveClick).toHaveBeenCalledTimes(1);

      await user.click(screen.getByText("Open Dispute"));
      expect(onDisputeClick).toHaveBeenCalledTimes(1);
    });

    it("handles no handlers provided", () => {
      render(<ActionsPanelCard {...defaultProps} status="VERIFIED" />);

      // Should render without errors
      expect(screen.getByText("Actions")).toBeInTheDocument();
      expect(screen.getByText("Approve Installation")).toBeInTheDocument();
      expect(screen.getByText("Open Dispute")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has accessible button labels", () => {
      render(<ActionsPanelCard {...defaultProps} status="VERIFIED" />);

      expect(screen.getByRole("button", { name: /approve installation/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /open dispute/i })).toBeInTheDocument();
      // Message Owner is a link, not a button
      expect(screen.getByRole("link", { name: /message owner/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /view receipt/i })).toBeInTheDocument();
    });

    it("has accessible cancel button when visible", () => {
      render(<ActionsPanelCard {...defaultProps} status="PAID" />);

      expect(screen.getByRole("button", { name: /cancel booking/i })).toBeInTheDocument();
    });

    it("has accessible link for message button", () => {
      render(<ActionsPanelCard {...defaultProps} />);

      const messageLink = screen.getByRole("link", { name: /message owner/i });
      expect(messageLink).toBeInTheDocument();
      expect(messageLink).toHaveAttribute("href", "/messages/booking-123");
    });
  });
});
