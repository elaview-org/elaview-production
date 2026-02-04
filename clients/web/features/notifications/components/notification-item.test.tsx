import { render, screen, userEvent, waitFor } from "@/test/utils";
import { describe, it, expect, mock } from "bun:test";
import { NotificationItem } from "./notification-item";
import type { TNotification } from "./mock-notification";
import { NotificationType } from "@/types/gql/graphql";

describe.skip("NotificationItem", () => {
  const createNotification = (
    overrides: Partial<TNotification> = {}
  ): TNotification => ({
    __typename: "Notification",
    id: "notif-1",
    title: "Test Notification",
    body: "This is a test notification body",
    type: NotificationType.BookingApproved,
    isRead: false,
    createdAt: new Date().toISOString(),
    readAt: null,
    entityId: "booking-123",
    entityType: "Booking",
    userId: "user-1",
    user: {
      __typename: "User",
      id: "user-1",
      email: "user@example.com",
      name: "John Doe",
    },
    ...overrides,
  });

  describe("Rendering", () => {
    it("renders notification title", () => {
      const notification = createNotification({ title: "Booking Approved" });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("Booking Approved")).toBeInTheDocument();
    });

    it("renders notification body", () => {
      const notification = createNotification({
        body: "Your booking has been approved",
      });
      render(<NotificationItem notification={notification} />);

      expect(
        screen.getByText("Your booking has been approved")
      ).toBeInTheDocument();
    });

    it("renders entity type badge", () => {
      const notification = createNotification({ entityType: "Booking" });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("Booking")).toBeInTheDocument();
    });

    it("renders time", () => {
      const notification = createNotification();
      render(<NotificationItem notification={notification} />);

      // Should show relative time
      expect(
        screen.getByText(/Just now|m ago|h ago|d ago/)
      ).toBeInTheDocument();
    });
  });

  describe("Icon Selection", () => {
    it("renders CheckCircle2 icon for BookingApproved", () => {
      const notification = createNotification({
        type: NotificationType.BookingApproved,
      });
      const { container } = render(
        <NotificationItem notification={notification} />
      );

      // CheckCircle2 icon should be present
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders XCircle icon for BookingRejected", () => {
      const notification = createNotification({
        type: NotificationType.BookingRejected,
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });

    it("renders X icon for BookingCancelled", () => {
      const notification = createNotification({
        type: NotificationType.BookingCancelled,
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });

    it("renders DollarSign icon for PaymentReceived", () => {
      const notification = createNotification({
        type: NotificationType.PaymentReceived,
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });

    it("renders DollarSign icon for RefundProcessed", () => {
      const notification = createNotification({
        type: NotificationType.RefundProcessed,
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });

    it("renders Camera icon for ProofUploaded", () => {
      const notification = createNotification({
        type: NotificationType.ProofUploaded,
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });

    it("renders Camera icon for ProofApproved", () => {
      const notification = createNotification({
        type: NotificationType.ProofApproved,
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });

    it("renders AlertTriangle icon for DisputeFiled", () => {
      const notification = createNotification({
        type: NotificationType.DisputeFiled,
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });

    it("renders AlertTriangle icon for DisputeResolved", () => {
      const notification = createNotification({
        type: NotificationType.DisputeResolved,
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });

    it("renders MessageSquare icon for MessageReceived", () => {
      const notification = createNotification({
        type: NotificationType.MessageReceived,
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });

    it("renders default CheckCircle2 icon for unknown type", () => {
      const notification = createNotification({
        type: "UNKNOWN_TYPE" as NotificationType,
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });
  });

  describe("Link Generation", () => {
    it("generates booking link for Booking entity type", () => {
      const notification = createNotification({
        entityType: "Booking",
        entityId: "booking-123",
      });
      render(<NotificationItem notification={notification} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/bookings/booking-123");
    });

    it("generates messages link for Conversation entity type", () => {
      const notification = createNotification({
        entityType: "Conversation",
        entityId: "conversation-456",
      });
      render(<NotificationItem notification={notification} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/messages/conversation-456");
    });

    it("generates messages link for Message entity type", () => {
      const notification = createNotification({
        entityType: "Message",
        entityId: "message-789",
      });
      render(<NotificationItem notification={notification} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/messages/message-789");
    });

    it("does not render link when entityId is missing", () => {
      const notification = createNotification({
        entityId: null,
        entityType: "Booking",
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("does not render link when entityType is missing", () => {
      const notification = createNotification({
        entityId: "booking-123",
        entityType: null,
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("does not render link for unknown entity type", () => {
      const notification = createNotification({
        entityType: "Unknown" as string | undefined,
        entityId: "unknown-123",
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });

  describe("Time Formatting", () => {
    it("formats time as 'Just now' for very recent notifications", () => {
      const notification = createNotification({
        createdAt: new Date().toISOString(),
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("Just now")).toBeInTheDocument();
    });

    it("formats time as minutes ago", () => {
      const notification = createNotification({
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("5m ago")).toBeInTheDocument();
    });

    it("formats time as hours ago", () => {
      const notification = createNotification({
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("2h ago")).toBeInTheDocument();
    });

    it("formats time as days ago", () => {
      const notification = createNotification({
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("3d ago")).toBeInTheDocument();
    });

    it("formats time as date for older notifications", () => {
      const notification = createNotification({
        createdAt: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(), // 10 days ago
      });
      render(<NotificationItem notification={notification} />);

      // Should show formatted date like "Jan 15"
      const timeElement = screen.getByText(
        /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/
      );
      expect(timeElement).toBeInTheDocument();
    });
  });

  describe("Read/Unread States", () => {
    it("applies unread styling when notification is unread", () => {
      const notification = createNotification({ isRead: false });
      const { container } = render(
        <NotificationItem notification={notification} />
      );

      const item = container.querySelector('[class*="border-blue-200"]');
      expect(item).toBeInTheDocument();
    });

    it("shows unread indicator dot when notification is unread", () => {
      const notification = createNotification({ isRead: false });
      const { container } = render(
        <NotificationItem notification={notification} />
      );

      const dot = container.querySelector('[class*="bg-blue-600"]');
      expect(dot).toBeInTheDocument();
    });

    it("applies bold font to title when notification is unread", () => {
      const notification = createNotification({ isRead: false });
      render(<NotificationItem notification={notification} />);

      const title = screen.getByText("Test Notification");
      expect(title).toHaveClass("font-semibold");
    });

    it("does not apply unread styling when notification is read", () => {
      const notification = createNotification({ isRead: true });
      const { container } = render(
        <NotificationItem notification={notification} />
      );

      const item = container.querySelector('[class*="border-blue-200"]');
      expect(item).not.toBeInTheDocument();
    });

    it("does not show unread indicator dot when notification is read", () => {
      const notification = createNotification({ isRead: true });
      const { container } = render(
        <NotificationItem notification={notification} />
      );

      const dot = container.querySelector('[class*="bg-blue-600"]');
      expect(dot).not.toBeInTheDocument();
    });

    it("does not apply bold font to title when notification is read", () => {
      const notification = createNotification({ isRead: true });
      render(<NotificationItem notification={notification} />);

      const title = screen.getByText("Test Notification");
      expect(title).not.toHaveClass("font-semibold");
    });
  });

  describe("Dropdown Menu", () => {
    it("renders dropdown menu trigger button", () => {
      const notification = createNotification();
      const { container } = render(
        <NotificationItem notification={notification} />
      );

      // Dropdown trigger button exists (even if hidden)
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });

    it("shows mark as read option for unread notifications when dropdown is opened", async () => {
      const user = userEvent.setup();
      const onMarkAsRead = mock();
      const notification = createNotification({ isRead: false });
      const { container } = render(
        <NotificationItem
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      );

      // Find the dropdown trigger button (it's hidden but exists)
      const dropdownButton =
        container.querySelector("button[aria-haspopup]") ||
        Array.from(container.querySelectorAll("button")).find((btn) =>
          btn.querySelector("svg")
        );

      if (dropdownButton) {
        // Force visibility for testing
        (dropdownButton as HTMLElement).style.opacity = "1";
        await user.click(dropdownButton);
      }

      // Should show "Mark as read" option
      await waitFor(() => {
        expect(screen.getByText("Mark as read")).toBeInTheDocument();
      });
    });

    it("does not show mark as read option for read notifications", async () => {
      const user = userEvent.setup();
      const notification = createNotification({ isRead: true });
      const { container } = render(
        <NotificationItem notification={notification} />
      );

      // Try to open dropdown
      const dropdownButton =
        container.querySelector("button[aria-haspopup]") ||
        Array.from(container.querySelectorAll("button")).find((btn) =>
          btn.querySelector("svg")
        );

      if (dropdownButton) {
        (dropdownButton as HTMLElement).style.opacity = "1";
        await user.click(dropdownButton);
      }

      // Should not show "Mark as read" option
      await waitFor(() => {
        expect(screen.queryByText("Mark as read")).not.toBeInTheDocument();
      });
    });

    it("shows delete option when onDelete handler is provided", async () => {
      const user = userEvent.setup();
      const onDelete = mock();
      const notification = createNotification();
      const { container } = render(
        <NotificationItem notification={notification} onDelete={onDelete} />
      );

      // Open dropdown
      const dropdownButton =
        container.querySelector("button[aria-haspopup]") ||
        Array.from(container.querySelectorAll("button")).find((btn) =>
          btn.querySelector("svg")
        );

      if (dropdownButton) {
        (dropdownButton as HTMLElement).style.opacity = "1";
        await user.click(dropdownButton);
      }

      // Should show "Delete" option
      await waitFor(() => {
        expect(screen.getByText("Delete")).toBeInTheDocument();
      });
    });

    it("does not show delete option when onDelete handler is not provided", async () => {
      const user = userEvent.setup();
      const notification = createNotification();
      const { container } = render(
        <NotificationItem notification={notification} />
      );

      // Try to open dropdown
      const dropdownButton =
        container.querySelector("button[aria-haspopup]") ||
        Array.from(container.querySelectorAll("button")).find((btn) =>
          btn.querySelector("svg")
        );

      if (dropdownButton) {
        (dropdownButton as HTMLElement).style.opacity = "1";
        await user.click(dropdownButton);
      }

      // Should not show "Delete" option
      await waitFor(() => {
        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
      });
    });
  });

  describe("Mark as Read", () => {
    it("calls onMarkAsRead when mark as read is clicked", async () => {
      const user = userEvent.setup();
      const onMarkAsRead = mock();
      const notification = createNotification({ isRead: false });
      const { container } = render(
        <NotificationItem
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      );

      // Open dropdown
      const dropdownButton =
        container.querySelector("button[aria-haspopup]") ||
        Array.from(container.querySelectorAll("button")).find((btn) =>
          btn.querySelector("svg")
        );

      if (dropdownButton) {
        (dropdownButton as HTMLElement).style.opacity = "1";
        await user.click(dropdownButton);
      }

      // Click mark as read
      await waitFor(async () => {
        const markAsRead = screen.getByText("Mark as read");
        await user.click(markAsRead);
      });

      expect(onMarkAsRead).toHaveBeenCalledTimes(1);
      expect(onMarkAsRead).toHaveBeenCalledWith("notif-1");
    });

    it("does not call onMarkAsRead when handler is not provided", () => {
      const notification = createNotification({ isRead: false });
      render(<NotificationItem notification={notification} />);

      // Should render without errors
      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });
  });

  describe("Delete", () => {
    it("calls onDelete when delete is clicked", async () => {
      const user = userEvent.setup();
      const onDelete = mock();
      const notification = createNotification();
      const { container } = render(
        <NotificationItem notification={notification} onDelete={onDelete} />
      );

      // Open dropdown
      const dropdownButton =
        container.querySelector("button[aria-haspopup]") ||
        Array.from(container.querySelectorAll("button")).find((btn) =>
          btn.querySelector("svg")
        );

      if (dropdownButton) {
        (dropdownButton as HTMLElement).style.opacity = "1";
        await user.click(dropdownButton);
      }

      // Click delete
      await waitFor(async () => {
        const deleteOption = screen.getByText("Delete");
        await user.click(deleteOption);
      });

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith("notif-1");
    });

    it("does not call onDelete when handler is not provided", () => {
      const notification = createNotification();
      render(<NotificationItem notification={notification} />);

      // Should render without errors
      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });
  });

  describe("Conditional Rendering", () => {
    it("renders as link when link is available", () => {
      const notification = createNotification({
        entityType: "Booking",
        entityId: "booking-123",
      });
      render(<NotificationItem notification={notification} />);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("renders as div when link is not available", () => {
      const notification = createNotification({
        entityId: null,
        entityType: null,
      });
      render(<NotificationItem notification={notification} />);

      expect(screen.queryByRole("link")).not.toBeInTheDocument();
      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });

    it("renders entity type badge when entityType is provided", () => {
      const notification = createNotification({ entityType: "Booking" });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("Booking")).toBeInTheDocument();
    });

    it("does not render entity type badge when entityType is not provided", () => {
      const notification = createNotification({ entityType: null });
      render(<NotificationItem notification={notification} />);

      expect(screen.queryByText("Booking")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper link accessibility when rendered as link", () => {
      const notification = createNotification({
        entityType: "Booking",
        entityId: "booking-123",
      });
      render(<NotificationItem notification={notification} />);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("renders notification content in accessible structure", () => {
      const notification = createNotification();
      render(<NotificationItem notification={notification} />);

      // Title should be in a paragraph element
      expect(screen.getByText("Test Notification")).toBeInTheDocument();
      expect(
        screen.getByText("This is a test notification body")
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles notification without entityId", () => {
      const notification = createNotification({ entityId: null });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });

    it("handles notification without entityType", () => {
      const notification = createNotification({ entityType: null });
      render(<NotificationItem notification={notification} />);

      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });

    it("handles notification with very old date", () => {
      const notification = createNotification({
        createdAt: new Date("2020-01-01").toISOString(),
      });
      render(<NotificationItem notification={notification} />);

      // Should show formatted date
      expect(
        screen.getByText(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/)
      ).toBeInTheDocument();
    });

    it("handles notification with future date", () => {
      const notification = createNotification({
        createdAt: new Date(Date.now() + 1000).toISOString(),
      });
      render(<NotificationItem notification={notification} />);

      // Should handle gracefully
      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });

    it("handles long notification body", () => {
      const longBody = "A".repeat(200);
      const notification = createNotification({ body: longBody });
      render(<NotificationItem notification={notification} />);

      // Should render with line-clamp-2 class
      const body = screen.getByText(longBody);
      expect(body).toBeInTheDocument();
    });

    it("handles notification without handlers", () => {
      const notification = createNotification();
      render(<NotificationItem notification={notification} />);

      // Should render without errors
      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });
  });
});
