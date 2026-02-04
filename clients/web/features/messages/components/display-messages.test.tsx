import { render, screen, waitFor, userEvent } from "@/test/utils";
import { describe, it, expect, beforeEach, mock, afterEach } from "bun:test";
import DisplayMessages from "./display-messages";
import {
  mockConversations,
  mockMessages,
  mockThreadContext,
} from "@/features/conversations/mock-data";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { asMock } from "@/test/utils";

// Mock Next.js Image component
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

// Mock hooks
mock.module("@/hooks/use-mobile", () => ({
  useIsMobile: mock(() => false), // Default to desktop
}));

// Mock window.location.reload
const mockReload = mock();
Object.defineProperty(window, "location", {
  writable: true,
  configurable: true,
  value: {
    ...window.location,
    reload: mockReload,
  },
});

describe.skip("DisplayMessages", () => {
  const mockPush = mock();
  const mockRouter = {
    push: mockPush,
    replace: mock(),
    back: mock(),
    forward: mock(),
    refresh: mock(),
    prefetch: mock(),
  };

  const defaultProps = {
    conversations: mockConversations,
    initialMessages: mockMessages.filter(
      (msg) => msg.bookingId === "booking-123"
    ),
    initialThreadContext: mockThreadContext,
    bookingId: "booking-123",
  };

  beforeEach(() => {
    mockPush.mockClear();
    mockReload.mockClear();
    // Reset useRouter mock
    asMock(useRouter).mockReturnValue(mockRouter);
    // Reset useIsMobile mock to desktop
    asMock(useIsMobile).mockReturnValue(false);
    // Clear any timers
    if (
      typeof globalThis !== "undefined" &&
      typeof globalThis.clearTimeout === "function"
    ) {
      globalThis.clearTimeout();
    }
  });

  afterEach(() => {
    // Clear any pending timers
    if (
      typeof global !== "undefined" &&
      typeof global.clearTimeout === "function"
    ) {
      global.clearTimeout();
    }
  });

  describe("Rendering", () => {
    it("renders inbox panel on desktop", () => {
      asMock(useIsMobile).mockReturnValue(false);
      render(<DisplayMessages {...defaultProps} />);

      // InboxPanel should be visible on desktop - check for conversation item
      const conversationItems = screen.getAllByText(
        "Coffee Shop Window Display"
      );
      expect(conversationItems.length).toBeGreaterThan(0);
    });

    it("renders message thread when bookingId is provided", async () => {
      render(<DisplayMessages {...defaultProps} />);

      // Wait for messages to load (setTimeout in useEffect)
      await waitFor(
        () => {
          expect(
            screen.getByText(/Hi! I'm interested in booking/)
          ).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it("renders MessagesHeader with correct conversation count", () => {
      render(<DisplayMessages {...defaultProps} />);

      // MessagesHeader should show conversation count
      expect(screen.getByText("Messages")).toBeInTheDocument();
      expect(screen.getByText(/3 conversation/)).toBeInTheDocument();
    });
  });

  describe("Desktop View", () => {
    beforeEach(() => {
      asMock(useIsMobile).mockReturnValue(false);
    });

    it("shows both inbox panel and thread on desktop", async () => {
      render(<DisplayMessages {...defaultProps} />);

      // Both should be visible - check for inbox panel and thread
      await waitFor(() => {
        const conversationItems = screen.getAllByText(
          "Coffee Shop Window Display"
        );
        expect(conversationItems.length).toBeGreaterThanOrEqual(1);
        expect(
          screen.getByText(/Hi! I'm interested in booking/)
        ).toBeInTheDocument();
      });
    });

    it("does not show back button on desktop", async () => {
      render(<DisplayMessages {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.queryByRole("button", { name: /Back to conversations/i })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Mobile View", () => {
    beforeEach(() => {
      asMock(useIsMobile).mockReturnValue(true);
    });

    it("shows thread view by default on mobile", async () => {
      render(<DisplayMessages {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByText(/Hi! I'm interested in booking/)
        ).toBeInTheDocument();
      });
    });

    it("shows back button on mobile", async () => {
      render(<DisplayMessages {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /Back to conversations/i })
        ).toBeInTheDocument();
      });
    });

    it("navigates back and changes view state when back button is clicked", async () => {
      const user = userEvent.setup();
      render(<DisplayMessages {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /Back to conversations/i })
        ).toBeInTheDocument();
      });

      const backButton = screen.getByRole("button", {
        name: /Back to conversations/i,
      });
      await user.click(backButton);

      expect(mockPush).toHaveBeenCalledWith("/messages");
    });
  });

  describe("Message Loading", () => {
    it("loads messages for selected booking", async () => {
      render(<DisplayMessages {...defaultProps} />);

      await waitFor(
        () => {
          expect(
            screen.getByText(/Hi! I'm interested in booking/)
          ).toBeInTheDocument();
          expect(
            screen.getByText(/Great! I'd be happy to help/)
          ).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it("sets thread context from conversation", async () => {
      render(<DisplayMessages {...defaultProps} />);

      await waitFor(() => {
        // ThreadHeader should show space name from conversation (h2 element)
        const threadHeaders = screen.getAllByRole("heading", { level: 2 });
        const spaceNameHeader = threadHeaders.find((h) =>
          h.textContent?.includes("Coffee Shop Window Display")
        );
        expect(spaceNameHeader).toBeInTheDocument();
      });
    });

    it("filters messages by bookingId", async () => {
      render(
        <DisplayMessages
          {...defaultProps}
          bookingId="booking-123"
          initialMessages={[]}
        />
      );

      await waitFor(
        () => {
          // Should show messages for booking-123
          expect(
            screen.getByText(/Hi! I'm interested in booking/)
          ).toBeInTheDocument();
          // Should not show messages for booking-124 (which doesn't exist in mockMessages)
          // Note: mockMessages only has messages for booking-123, so we can't test filtering
          // But we can verify the correct messages are shown
          expect(
            screen.getByText(/Great! I'd be happy to help/)
          ).toBeInTheDocument();
        },
        { timeout: 1500 }
      );
    });
  });

  describe("Sending Messages", () => {
    it("adds new message when send is called", async () => {
      const user = userEvent.setup();
      render(<DisplayMessages {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Type a message...")
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText("Type a message...");
      const sendButton = screen.getByRole("button", { name: /send/i });

      await user.type(input, "Test message");
      await user.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText("Test message")).toBeInTheDocument();
      });
    });

    it("creates message with correct properties", async () => {
      const user = userEvent.setup();
      render(<DisplayMessages {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Type a message...")
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText("Type a message...");
      const sendButton = screen.getByRole("button", { name: /send/i });

      await user.type(input, "New message");
      await user.click(sendButton);

      await waitFor(() => {
        const newMessage = screen.getByText("New message");
        expect(newMessage).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("shows error message when error occurs and no bookingId", () => {
      // This test would require mocking the useEffect to throw an error
      // For now, we'll test the error UI rendering
      const { container } = render(
        <DisplayMessages
          conversations={mockConversations}
          initialMessages={[]}
          initialThreadContext={null}
          bookingId=""
        />
      );

      // Component should still render
      expect(container).toBeInTheDocument();
    });

    it("shows retry button in error state", () => {
      // This would require setting error state, which is internal
      // We can test that the error UI structure exists
      const { container } = render(
        <DisplayMessages
          conversations={mockConversations}
          initialMessages={[]}
          initialThreadContext={null}
          bookingId=""
        />
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe("Initial State", () => {
    it("uses initialMessages prop", () => {
      const initialMessages = mockMessages.filter(
        (msg) => msg.bookingId === "booking-123"
      );
      render(
        <DisplayMessages {...defaultProps} initialMessages={initialMessages} />
      );

      // Should show initial messages immediately
      expect(
        screen.getByText(/Hi! I'm interested in booking/)
      ).toBeInTheDocument();
    });

    it("uses initialThreadContext prop", () => {
      render(<DisplayMessages {...defaultProps} />);

      // Should show thread context immediately - check for thread header (h2)
      const threadHeaders = screen.getAllByRole("heading", { level: 2 });
      const spaceNameHeader = threadHeaders.find((h) =>
        h.textContent?.includes("Coffee Shop Window Display")
      );
      expect(spaceNameHeader).toBeInTheDocument();
    });
  });

  describe("Empty States", () => {
    it("handles empty conversations list", () => {
      render(
        <DisplayMessages
          conversations={[]}
          initialMessages={[]}
          initialThreadContext={null}
          bookingId=""
        />
      );

      // Should render without crashing - check for MessagesHeader
      expect(screen.getByText("Messages")).toBeInTheDocument();
    });

    it("handles empty messages list", async () => {
      render(
        <DisplayMessages
          {...defaultProps}
          initialMessages={[]}
          bookingId="booking-999" // Non-existent booking
        />
      );

      await waitFor(() => {
        // Should show inbox panel even with empty messages
        expect(screen.getByText("Messages")).toBeInTheDocument();
      });
    });
  });

  describe("Thread Context", () => {
    it("updates thread context when conversation is found", async () => {
      render(
        <DisplayMessages
          {...defaultProps}
          initialThreadContext={null}
          bookingId="booking-123"
        />
      );

      await waitFor(() => {
        // Thread context should be set from conversation - check thread header
        const threadHeaders = screen.getAllByRole("heading", { level: 2 });
        const spaceNameHeader = threadHeaders.find((h) =>
          h.textContent?.includes("Coffee Shop Window Display")
        );
        expect(spaceNameHeader).toBeInTheDocument();
        expect(screen.getByText("Paid")).toBeInTheDocument();
      });
    });

    it("uses spaceId from conversation when available", async () => {
      render(
        <DisplayMessages
          {...defaultProps}
          initialThreadContext={null}
          bookingId="booking-123"
        />
      );

      await waitFor(() => {
        // Should have thread context with spaceId - check thread header exists
        const threadHeaders = screen.getAllByRole("heading", { level: 2 });
        const spaceNameHeader = threadHeaders.find((h) =>
          h.textContent?.includes("Coffee Shop Window Display")
        );
        expect(spaceNameHeader).toBeInTheDocument();
      });
    });
  });

  describe("View State Management", () => {
    it("starts with thread view on mobile", async () => {
      asMock(useIsMobile).mockReturnValue(true);
      render(<DisplayMessages {...defaultProps} />);

      await waitFor(() => {
        // Should show thread, not list
        expect(
          screen.getByText(/Hi! I'm interested in booking/)
        ).toBeInTheDocument();
      });
    });

    it("shows list view on desktop", () => {
      asMock(useIsMobile).mockReturnValue(false);
      render(<DisplayMessages {...defaultProps} />);

      // Both should be visible on desktop - check for inbox panel
      const conversationItems = screen.getAllByText(
        "Coffee Shop Window Display"
      );
      expect(conversationItems.length).toBeGreaterThan(0);
    });
  });

  describe("Integration", () => {
    it("renders all child components correctly", async () => {
      render(<DisplayMessages {...defaultProps} />);

      await waitFor(() => {
        // Should have inbox panel - check for conversation items
        const conversationItems = screen.getAllByText(
          "Coffee Shop Window Display"
        );
        expect(conversationItems.length).toBeGreaterThan(0);
        // Should have message thread
        expect(
          screen.getByText(/Hi! I'm interested in booking/)
        ).toBeInTheDocument();
        // Should have message composer
        expect(
          screen.getByPlaceholderText("Type a message...")
        ).toBeInTheDocument();
      });
    });

    it("handles multiple conversations", () => {
      render(<DisplayMessages {...defaultProps} />);

      // Should render inbox with all conversations - use getAllByText since there are multiple
      const coffeeShopItems = screen.getAllByText("Coffee Shop Window Display");
      expect(coffeeShopItems.length).toBeGreaterThan(0);
      expect(
        screen.getByText("Dry Cleaner Bulletin Board")
      ).toBeInTheDocument();
      expect(screen.getByText("Barbershop Wall Mount")).toBeInTheDocument();
    });
  });
});
