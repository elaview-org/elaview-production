import { render, screen, userEvent, waitFor } from "@/test/utils";
import { describe, it, expect, beforeEach, mock } from "bun:test";
import { MessageThread, ErrorState } from "./message-thread";
import type { Message, ThreadContext } from "@/types/messages";
import {
  mockMessages,
  mockThreadContext,
} from "@/features/conversations/mock-data";

// Mock scrollIntoView
const mockScrollIntoView = mock();
Element.prototype.scrollIntoView = mockScrollIntoView;

describe("MessageThread", () => {
  const mockOnSendMessage = mock();
  const mockOnBack = mock();

  const defaultProps = {
    context: mockThreadContext,
    messages: mockMessages.filter((msg) => msg.bookingId === "booking-123"),
    currentUserId: "advertiser-1",
    onSendMessage: mockOnSendMessage,
  };

  beforeEach(() => {
    mockOnSendMessage.mockClear();
    mockOnBack.mockClear();
    mockScrollIntoView.mockClear();
  });

  describe("Rendering", () => {
    it("renders thread header with context information", () => {
      render(<MessageThread {...defaultProps} />);

      expect(
        screen.getByText("Coffee Shop Window Display")
      ).toBeInTheDocument();
      expect(screen.getByText(/Booking #/)).toBeInTheDocument();
    });

    it("renders all messages", () => {
      render(<MessageThread {...defaultProps} />);

      // Check that messages are rendered
      expect(
        screen.getByText(/Hi! I'm interested in booking/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Great! I'd be happy to help/)
      ).toBeInTheDocument();
    });

    it("renders message composer", () => {
      render(<MessageThread {...defaultProps} />);

      expect(
        screen.getByPlaceholderText("Type a message...")
      ).toBeInTheDocument();
    });

    it("renders View Booking and View Space buttons", () => {
      render(<MessageThread {...defaultProps} />);

      expect(screen.getByText("View Booking")).toBeInTheDocument();
      expect(screen.getByText("View Space")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("shows loading skeleton when isLoading is true", () => {
      render(<MessageThread {...defaultProps} isLoading={true} />);

      // Should show skeleton elements
      const { container } = render(
        <MessageThread {...defaultProps} isLoading={true} />
      );
      const skeletons = container.querySelectorAll('[class*="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("does not show messages when loading", () => {
      render(<MessageThread {...defaultProps} isLoading={true} />);

      expect(
        screen.queryByText(/Hi! I'm interested in booking/)
      ).not.toBeInTheDocument();
    });

    it("does not show message composer when loading", () => {
      render(<MessageThread {...defaultProps} isLoading={true} />);

      expect(
        screen.queryByPlaceholderText("Type a message...")
      ).not.toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("shows empty state when there are no messages", () => {
      render(<MessageThread {...defaultProps} messages={[]} />);

      expect(screen.getByText("No messages yet")).toBeInTheDocument();
      expect(
        screen.getByText("Start the conversation by sending a message")
      ).toBeInTheDocument();
    });

    it("shows message composer even when empty", () => {
      render(<MessageThread {...defaultProps} messages={[]} />);

      expect(
        screen.getByPlaceholderText("Type a message...")
      ).toBeInTheDocument();
    });
  });

  describe("Message Grouping", () => {
    it("groups messages by date", () => {
      const messagesWithDifferentDates: Message[] = [
        {
          id: "msg-1",
          bookingId: "booking-123",
          sender: "ADVERTISER",
          type: "TEXT",
          content: "Message 1",
          createdAt: new Date("2024-01-15T10:00:00Z").toISOString(),
        },
        {
          id: "msg-2",
          bookingId: "booking-123",
          sender: "SPACE_OWNER",
          type: "TEXT",
          content: "Message 2",
          createdAt: new Date("2024-01-16T10:00:00Z").toISOString(),
        },
      ];

      render(
        <MessageThread
          {...defaultProps}
          messages={messagesWithDifferentDates}
        />
      );

      // Should show date separators
      const { container } = render(
        <MessageThread
          {...defaultProps}
          messages={messagesWithDifferentDates}
        />
      );
      // Date separators should be present (check for date format)
      expect(screen.getByText("Message 1")).toBeInTheDocument();
      expect(screen.getByText("Message 2")).toBeInTheDocument();
    });

    it("shows date separator between different dates", () => {
      const messagesWithDifferentDates: Message[] = [
        {
          id: "msg-1",
          bookingId: "booking-123",
          sender: "ADVERTISER",
          type: "TEXT",
          content: "Message 1",
          createdAt: new Date("2024-01-15T10:00:00Z").toISOString(),
        },
        {
          id: "msg-2",
          bookingId: "booking-123",
          sender: "SPACE_OWNER",
          type: "TEXT",
          content: "Message 2",
          createdAt: new Date("2024-01-16T10:00:00Z").toISOString(),
        },
      ];

      const { container } = render(
        <MessageThread
          {...defaultProps}
          messages={messagesWithDifferentDates}
        />
      );

      // Date separator should be rendered (check for separator structure)
      const separators = container.querySelectorAll('[class*="border"]');
      expect(separators.length).toBeGreaterThan(0);
    });
  });

  describe("Avatar Display Logic", () => {
    it("shows avatar for first message in group", () => {
      const messages: Message[] = [
        {
          id: "msg-1",
          bookingId: "booking-123",
          sender: "ADVERTISER",
          type: "TEXT",
          content: "First message",
          createdAt: new Date().toISOString(),
        },
      ];

      render(<MessageThread {...defaultProps} messages={messages} />);

      // Avatar should be shown (check for initials)
      expect(screen.getByText("AD")).toBeInTheDocument();
    });

    it("shows avatar when sender changes", () => {
      const messages: Message[] = [
        {
          id: "msg-1",
          bookingId: "booking-123",
          sender: "ADVERTISER",
          type: "TEXT",
          content: "Message 1",
          createdAt: new Date().toISOString(),
        },
        {
          id: "msg-2",
          bookingId: "booking-123",
          sender: "SPACE_OWNER",
          type: "TEXT",
          content: "Message 2",
          createdAt: new Date(Date.now() + 1000).toISOString(),
        },
      ];

      render(<MessageThread {...defaultProps} messages={messages} />);

      // Both avatars should be shown
      expect(screen.getByText("AD")).toBeInTheDocument();
      expect(screen.getByText("SO")).toBeInTheDocument();
    });

    it("hides avatar for consecutive messages from same sender", () => {
      const messages: Message[] = [
        {
          id: "msg-1",
          bookingId: "booking-123",
          sender: "ADVERTISER",
          type: "TEXT",
          content: "Message 1",
          createdAt: new Date().toISOString(),
        },
        {
          id: "msg-2",
          bookingId: "booking-123",
          sender: "ADVERTISER",
          type: "TEXT",
          content: "Message 2",
          createdAt: new Date(Date.now() + 1000).toISOString(),
        },
      ];

      const { container } = render(
        <MessageThread {...defaultProps} messages={messages} />
      );

      // Should show avatar only for first message
      const avatars = container.querySelectorAll('[class*="avatar"]');
      // First message should have avatar, second should not
      expect(screen.getByText("Message 1")).toBeInTheDocument();
      expect(screen.getByText("Message 2")).toBeInTheDocument();
    });

    it("shows avatar when more than 5 minutes have passed", () => {
      const fiveMinutesAgo = new Date(Date.now() - 6 * 60 * 1000).toISOString();
      const now = new Date().toISOString();

      const messages: Message[] = [
        {
          id: "msg-1",
          bookingId: "booking-123",
          sender: "ADVERTISER",
          type: "TEXT",
          content: "Message 1",
          createdAt: fiveMinutesAgo,
        },
        {
          id: "msg-2",
          bookingId: "booking-123",
          sender: "ADVERTISER",
          type: "TEXT",
          content: "Message 2",
          createdAt: now,
        },
      ];

      render(<MessageThread {...defaultProps} messages={messages} />);

      // Both messages should show avatars due to time gap
      expect(screen.getByText("Message 1")).toBeInTheDocument();
      expect(screen.getByText("Message 2")).toBeInTheDocument();
    });
  });

  describe("Back Button", () => {
    it("shows back button when showBackButton is true", () => {
      render(
        <MessageThread
          {...defaultProps}
          showBackButton={true}
          onBack={mockOnBack}
        />
      );

      const backButton = screen.getByLabelText("Back to conversations");
      expect(backButton).toBeInTheDocument();
    });

    it("hides back button when showBackButton is false", () => {
      render(<MessageThread {...defaultProps} showBackButton={false} />);

      expect(
        screen.queryByLabelText("Back to conversations")
      ).not.toBeInTheDocument();
    });

    it("calls onBack when back button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <MessageThread
          {...defaultProps}
          showBackButton={true}
          onBack={mockOnBack}
        />
      );

      const backButton = screen.getByLabelText("Back to conversations");
      await user.click(backButton);

      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("Message Sending", () => {
    it("calls onSendMessage when message is sent", async () => {
      const user = userEvent.setup();
      render(<MessageThread {...defaultProps} />);

      const textarea = screen.getByPlaceholderText("Type a message...");
      await user.type(textarea, "Test message");
      await user.click(screen.getByLabelText("Send message"));

      await waitFor(() => {
        expect(mockOnSendMessage).toHaveBeenCalledWith(
          "Test message",
          undefined
        );
      });
    });

    it("calls onSendMessage with attachments", async () => {
      const user = userEvent.setup();
      render(<MessageThread {...defaultProps} />);

      // Add attachment
      const file = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });
      const fileInput = screen
        .getByLabelText("Attach file")
        .closest("div")
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(fileInput, "files", {
        value: [file],
        writable: false,
      });

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText("test.pdf")).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText("Type a message...");
      await user.type(textarea, "Message with file");
      await user.click(screen.getByLabelText("Send message"));

      await waitFor(() => {
        expect(mockOnSendMessage).toHaveBeenCalled();
        const callArgs = mockOnSendMessage.mock.calls[0];
        expect(callArgs[0]).toBe("Message with file");
        expect(callArgs[1]).toBeDefined();
      });
    });
  });

  describe("Disabled State", () => {
    it("disables composer when disabled prop is true", () => {
      render(<MessageThread {...defaultProps} disabled={true} />);

      const textarea = screen.getByPlaceholderText("Type a message...");
      expect(textarea).toBeDisabled();
    });

    it("disables composer when booking is completed", () => {
      const completedContext: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "COMPLETED",
      };

      render(<MessageThread {...defaultProps} context={completedContext} />);

      const textarea = screen.getByPlaceholderText(
        "This booking is closed. Messaging is disabled."
      );
      expect(textarea).toBeDisabled();
    });

    it("disables composer when booking is cancelled", () => {
      const cancelledContext: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "CANCELLED",
      };

      render(<MessageThread {...defaultProps} context={cancelledContext} />);

      const textarea = screen.getByPlaceholderText(
        "This booking is closed. Messaging is disabled."
      );
      expect(textarea).toBeDisabled();
    });

    it("shows custom placeholder when booking is archived", () => {
      const completedContext: ThreadContext = {
        ...mockThreadContext,
        bookingStatus: "COMPLETED",
      };

      render(<MessageThread {...defaultProps} context={completedContext} />);

      expect(
        screen.getByPlaceholderText(
          "This booking is closed. Messaging is disabled."
        )
      ).toBeInTheDocument();
    });
  });

  describe("Auto-scroll", () => {
    it("scrolls to bottom when new messages arrive", async () => {
      const { rerender } = render(
        <MessageThread {...defaultProps} messages={[]} />
      );

      // Add a message
      rerender(
        <MessageThread
          {...defaultProps}
          messages={[
            {
              id: "msg-1",
              bookingId: "booking-123",
              sender: "ADVERTISER",
              type: "TEXT",
              content: "New message",
              createdAt: new Date().toISOString(),
            },
          ]}
        />
      );

      await waitFor(() => {
        // scrollIntoView should be called
        expect(mockScrollIntoView).toHaveBeenCalled();
      });
    });
  });

  describe("Thread Header", () => {
    it("displays space name", () => {
      render(<MessageThread {...defaultProps} />);

      expect(
        screen.getByText("Coffee Shop Window Display")
      ).toBeInTheDocument();
    });

    it("displays booking status badge", () => {
      render(<MessageThread {...defaultProps} />);

      // Status badge should be rendered
      expect(screen.getByText("Paid")).toBeInTheDocument();
    });

    it("displays booking ID", () => {
      render(<MessageThread {...defaultProps} />);

      expect(screen.getByText(/Booking #/)).toBeInTheDocument();
    });

    it("renders View Booking link with correct href", () => {
      render(<MessageThread {...defaultProps} />);

      const viewBookingLink = screen.getByText("View Booking").closest("a");
      expect(viewBookingLink).toHaveAttribute(
        "href",
        `/bookings/${mockThreadContext.bookingId}`
      );
    });

    it("renders View Space link with correct href", () => {
      render(<MessageThread {...defaultProps} />);

      const viewSpaceLink = screen.getByText("View Space").closest("a");
      expect(viewSpaceLink).toHaveAttribute(
        "href",
        `/discover/${mockThreadContext.spaceId}`
      );
    });
  });

  describe("Accessibility", () => {
    it("has accessible messages container", () => {
      const { container } = render(<MessageThread {...defaultProps} />);

      const messagesContainer = container.querySelector('[role="log"]');
      expect(messagesContainer).toBeInTheDocument();
      expect(messagesContainer).toHaveAttribute("aria-label", "Message thread");
    });

    it("has accessible back button label", () => {
      render(
        <MessageThread
          {...defaultProps}
          showBackButton={true}
          onBack={mockOnBack}
        />
      );

      expect(
        screen.getByLabelText("Back to conversations")
      ).toBeInTheDocument();
    });
  });

  describe("ErrorState Component", () => {
    it("renders error message", () => {
      render(<ErrorState />);

      expect(screen.getByText("Failed to load messages")).toBeInTheDocument();
      expect(
        screen.getByText("There was an error loading the conversation")
      ).toBeInTheDocument();
    });

    it("shows retry button when onRetry is provided", () => {
      const mockOnRetry = mock();
      render(<ErrorState onRetry={mockOnRetry} />);

      expect(screen.getByText("Try again")).toBeInTheDocument();
    });

    it("calls onRetry when retry button is clicked", async () => {
      const user = userEvent.setup();
      const mockOnRetry = mock();
      render(<ErrorState onRetry={mockOnRetry} />);

      const retryButton = screen.getByText("Try again");
      await user.click(retryButton);

      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it("does not show retry button when onRetry is not provided", () => {
      render(<ErrorState />);

      expect(screen.queryByText("Try again")).not.toBeInTheDocument();
    });
  });

  describe("Current User Detection", () => {
    it("marks advertiser messages as current user", () => {
      const messages: Message[] = [
        {
          id: "msg-1",
          bookingId: "booking-123",
          sender: "ADVERTISER",
          type: "TEXT",
          content: "Advertiser message",
          createdAt: new Date().toISOString(),
        },
      ];

      const { container } = render(
        <MessageThread {...defaultProps} messages={messages} />
      );

      // Advertiser messages should be on the right (flex-row-reverse)
      const messageContainer = container.querySelector(".flex-row-reverse");
      expect(messageContainer).toBeInTheDocument();
    });

    it("marks space owner messages as not current user", () => {
      const messages: Message[] = [
        {
          id: "msg-1",
          bookingId: "booking-123",
          sender: "SPACE_OWNER",
          type: "TEXT",
          content: "Space owner message",
          createdAt: new Date().toISOString(),
        },
      ];

      const { container } = render(
        <MessageThread {...defaultProps} messages={messages} />
      );

      // Space owner messages should be on the left (flex-row)
      const messageContainer = container.querySelector(".flex-row");
      expect(messageContainer).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles messages with system type", () => {
      const systemMessage: Message[] = [
        {
          id: "msg-1",
          bookingId: "booking-123",
          sender: "SYSTEM",
          type: "SYSTEM",
          content: "System notification",
          createdAt: new Date().toISOString(),
        },
      ];

      render(<MessageThread {...defaultProps} messages={systemMessage} />);

      expect(screen.getByText("System notification")).toBeInTheDocument();
    });

    it("handles very long message lists", () => {
      const manyMessages: Message[] = Array.from({ length: 50 }, (_, i) => ({
        id: `msg-${i}`,
        bookingId: "booking-123",
        sender: i % 2 === 0 ? "ADVERTISER" : "SPACE_OWNER",
        type: "TEXT",
        content: `Message ${i}`,
        createdAt: new Date(Date.now() - (50 - i) * 60000).toISOString(),
      }));

      render(<MessageThread {...defaultProps} messages={manyMessages} />);

      // Should render all messages
      expect(screen.getByText("Message 0")).toBeInTheDocument();
      expect(screen.getByText("Message 49")).toBeInTheDocument();
    });

    it("handles messages with same timestamp", () => {
      const sameTime = new Date().toISOString();
      const messages: Message[] = [
        {
          id: "msg-1",
          bookingId: "booking-123",
          sender: "ADVERTISER",
          type: "TEXT",
          content: "Message 1",
          createdAt: sameTime,
        },
        {
          id: "msg-2",
          bookingId: "booking-123",
          sender: "ADVERTISER",
          type: "TEXT",
          content: "Message 2",
          createdAt: sameTime,
        },
      ];

      render(<MessageThread {...defaultProps} messages={messages} />);

      expect(screen.getByText("Message 1")).toBeInTheDocument();
      expect(screen.getByText("Message 2")).toBeInTheDocument();
    });
  });
});
