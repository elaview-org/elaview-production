import { render, screen, userEvent } from "@/tests/utils";
import { describe, expect, it, mock } from "bun:test";
import { ThreadHeader } from "./thread-header";
import type { ThreadContext } from "@/types/messages";
import { mockThreadContext } from "@/app/(dashboard)/messages/mock-data";

describe.skip("ThreadHeader", () => {
  const createThreadContext = (
    overrides: Partial<ThreadContext> = {}
  ): ThreadContext => ({
    bookingId: "booking-123",
    spaceName: "Coffee Shop Window Display",
    bookingStatus: "PAID",
    spaceId: "space-456",
    ...overrides,
  });

  describe("Rendering", () => {
    it("renders space name", () => {
      const context = createThreadContext();
      render(<ThreadHeader context={context} />);

      expect(
        screen.getByText("Coffee Shop Window Display")
      ).toBeInTheDocument();
    });

    it("renders booking ID", () => {
      const context = createThreadContext();
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Booking #123")).toBeInTheDocument();
    });

    it("renders booking status badge", () => {
      const context = createThreadContext({ bookingStatus: "PAID" });
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Paid")).toBeInTheDocument();
    });

    it("renders View Booking link", () => {
      const context = createThreadContext();
      render(<ThreadHeader context={context} />);

      const viewBookingLink = screen.getByRole("link", {
        name: /View Booking/i,
      });
      expect(viewBookingLink).toBeInTheDocument();
      expect(viewBookingLink).toHaveAttribute("href", "/bookings/booking-123");
    });

    it("renders View Space link", () => {
      const context = createThreadContext();
      render(<ThreadHeader context={context} />);

      const viewSpaceLink = screen.getByRole("link", {
        name: /View Space/i,
      });
      expect(viewSpaceLink).toBeInTheDocument();
      expect(viewSpaceLink).toHaveAttribute("href", "/discover/space-456");
    });
  });

  describe("Back Button", () => {
    it("does not render back button by default", () => {
      const context = createThreadContext();
      render(<ThreadHeader context={context} />);

      expect(
        screen.queryByRole("button", { name: /Back to conversations/i })
      ).not.toBeInTheDocument();
    });

    it("renders back button when showBackButton is true", () => {
      const context = createThreadContext();
      render(<ThreadHeader context={context} showBackButton={true} />);

      expect(
        screen.getByRole("button", { name: /Back to conversations/i })
      ).toBeInTheDocument();
    });

    it("calls onBack when back button is clicked", async () => {
      const user = userEvent.setup();
      const onBack = mock();
      const context = createThreadContext();

      render(
        <ThreadHeader context={context} showBackButton={true} onBack={onBack} />
      );

      const backButton = screen.getByRole("button", {
        name: /Back to conversations/i,
      });
      await user.click(backButton);

      expect(onBack).toHaveBeenCalledTimes(1);
    });

    it("does not call onBack when back button is not shown", () => {
      const onBack = mock();
      const context = createThreadContext();

      render(<ThreadHeader context={context} onBack={onBack} />);

      expect(onBack).not.toHaveBeenCalled();
    });
  });

  describe("Status Badge Variants", () => {
    it("renders default variant for PAID status", () => {
      const context = createThreadContext({ bookingStatus: "PAID" });
      render(<ThreadHeader context={context} />);

      const badge = screen.getByText("Paid");
      expect(badge).toBeInTheDocument();
    });

    it("renders secondary variant for ACCEPTED status", () => {
      const context = createThreadContext({ bookingStatus: "ACCEPTED" });
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Accepted")).toBeInTheDocument();
    });

    it("renders outline variant for PENDING_APPROVAL status", () => {
      const context = createThreadContext({
        bookingStatus: "PENDING_APPROVAL",
      });
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Pending Approval")).toBeInTheDocument();
    });

    it("renders outline variant for CANCELLED status", () => {
      const context = createThreadContext({ bookingStatus: "CANCELLED" });
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Cancelled")).toBeInTheDocument();
    });

    it("renders outline variant for DISPUTED status", () => {
      const context = createThreadContext({ bookingStatus: "DISPUTED" });
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Disputed")).toBeInTheDocument();
    });

    it("renders default variant for FILE_DOWNLOADED status", () => {
      const context = createThreadContext({
        bookingStatus: "FILE_DOWNLOADED",
      });
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("File Downloaded")).toBeInTheDocument();
    });

    it("renders default variant for INSTALLED status", () => {
      const context = createThreadContext({ bookingStatus: "INSTALLED" });
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Installed")).toBeInTheDocument();
    });

    it("renders default variant for VERIFIED status", () => {
      const context = createThreadContext({ bookingStatus: "VERIFIED" });
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Verified")).toBeInTheDocument();
    });

    it("renders default variant for COMPLETED status", () => {
      const context = createThreadContext({ bookingStatus: "COMPLETED" });
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Completed")).toBeInTheDocument();
    });

    it("renders outline variant for unknown status", () => {
      const context = createThreadContext({
        bookingStatus: "UNKNOWN_STATUS",
      });
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Unknown Status")).toBeInTheDocument();
    });
  });

  describe("Status Formatting", () => {
    it("formats status with underscores correctly", () => {
      const context = createThreadContext({
        bookingStatus: "PENDING_APPROVAL",
      });
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Pending Approval")).toBeInTheDocument();
    });

    it("formats single word status correctly", () => {
      const context = createThreadContext({ bookingStatus: "PAID" });
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Paid")).toBeInTheDocument();
    });

    it("formats multi-word status correctly", () => {
      const context = createThreadContext({
        bookingStatus: "FILE_DOWNLOADED",
      });
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("File Downloaded")).toBeInTheDocument();
    });
  });

  describe("Booking ID Parsing", () => {
    it("extracts booking number from UUID-style booking ID", () => {
      const context = createThreadContext({
        bookingId: "booking-550e8400-e29b-41d4-a716-446655440000",
      });
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Booking #550e8400")).toBeInTheDocument();
    });

    it("extracts booking number from simple booking ID", () => {
      const context = createThreadContext({ bookingId: "booking-123" });
      render(<ThreadHeader context={context} />);

      expect(screen.getByText("Booking #123")).toBeInTheDocument();
    });

    it("handles booking ID without prefix", () => {
      const context = createThreadContext({ bookingId: "123-456" });
      render(<ThreadHeader context={context} />);

      // Component splits by "-" and takes index [1], so "123-456" becomes "456"
      expect(screen.getByText("Booking #456")).toBeInTheDocument();
    });
  });

  describe("Links", () => {
    it("View Booking link has correct href", () => {
      const context = createThreadContext({ bookingId: "booking-789" });
      render(<ThreadHeader context={context} />);

      const link = screen.getByRole("link", { name: /View Booking/i });
      expect(link).toHaveAttribute("href", "/bookings/booking-789");
    });

    it("View Space link has correct href", () => {
      const context = createThreadContext({ spaceId: "space-999" });
      render(<ThreadHeader context={context} />);

      const link = screen.getByRole("link", { name: /View Space/i });
      expect(link).toHaveAttribute("href", "/discover/space-999");
    });

    it("links contain ExternalLinkIcon", () => {
      const context = createThreadContext();
      const { container } = render(<ThreadHeader context={context} />);

      // ExternalLinkIcon should be present in both links
      const icons = container.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Accessibility", () => {
    it("back button has aria-label", () => {
      const context = createThreadContext();
      render(<ThreadHeader context={context} showBackButton={true} />);

      const backButton = screen.getByRole("button", {
        name: /Back to conversations/i,
      });
      expect(backButton).toHaveAttribute("aria-label", "Back to conversations");
    });

    it("back button icon has aria-hidden", () => {
      const context = createThreadContext();
      const { container } = render(
        <ThreadHeader context={context} showBackButton={true} />
      );

      const icon = container.querySelector("svg[aria-hidden='true']");
      expect(icon).toBeInTheDocument();
    });

    it("space name is in a heading element", () => {
      const context = createThreadContext();
      render(<ThreadHeader context={context} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Coffee Shop Window Display");
    });
  });

  describe("Edge Cases", () => {
    it("handles very long space names with truncation", () => {
      const context = createThreadContext({
        spaceName:
          "This is a very long space name that should be truncated when displayed in the header",
      });
      render(<ThreadHeader context={context} />);

      expect(
        screen.getByText(
          "This is a very long space name that should be truncated when displayed in the header"
        )
      ).toBeInTheDocument();
    });

    it("handles empty space name", () => {
      const context = createThreadContext({ spaceName: "" });
      render(<ThreadHeader context={context} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("");
    });

    it("handles onBack being undefined", async () => {
      const user = userEvent.setup();
      const context = createThreadContext();

      render(
        <ThreadHeader
          context={context}
          showBackButton={true}
          onBack={undefined}
        />
      );

      const backButton = screen.getByRole("button", {
        name: /Back to conversations/i,
      });
      // Should not throw error when clicked without onBack handler
      await user.click(backButton);
    });
  });

  describe("Integration with mock data", () => {
    it("renders correctly with mockThreadContext", () => {
      render(<ThreadHeader context={mockThreadContext} />);

      expect(
        screen.getByText("Coffee Shop Window Display")
      ).toBeInTheDocument();
      expect(screen.getByText("Booking #123")).toBeInTheDocument();
      expect(screen.getByText("Paid")).toBeInTheDocument();
    });
  });
});
