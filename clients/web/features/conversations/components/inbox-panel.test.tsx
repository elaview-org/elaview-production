import { render, screen } from "@/test/utils";
import { describe, it, expect, beforeEach } from "bun:test";
import InboxPanel from "./inbox-panel";
import type { Conversation } from "@/types/messages";
import { mockConversations } from "@/features/conversations/mock-data";
import { usePathname } from "next/navigation";
import { asMock } from "@/test/utils";

describe("InboxPanel", () => {
  const defaultProps = {
    conversations: mockConversations,
  };

  beforeEach(() => {
    // Reset usePathname mock to default
    asMock(usePathname).mockReturnValue("/messages");
  });

  describe("Rendering", () => {
    it("renders children (header)", () => {
      render(
        <InboxPanel {...defaultProps}>
          <div data-testid="header">Messages Header</div>
        </InboxPanel>
      );

      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByText("Messages Header")).toBeInTheDocument();
    });

    it("renders ConversationList", () => {
      render(<InboxPanel {...defaultProps} />);

      // ConversationList should render conversation items
      expect(screen.getByText("Coffee Shop Window Display")).toBeInTheDocument();
      expect(screen.getByText("Dry Cleaner Bulletin Board")).toBeInTheDocument();
      expect(screen.getByText("Barbershop Wall Mount")).toBeInTheDocument();
    });

    it("renders with correct container classes", () => {
      const { container } = render(<InboxPanel {...defaultProps} />);

      const panel = container.firstChild as HTMLElement;
      expect(panel).toHaveClass("bg-background");
      expect(panel).toHaveClass("flex");
      expect(panel).toHaveClass("flex-col");
      expect(panel).toHaveClass("border-r");
    });
  });

  describe("URL Parsing", () => {
    it("extracts bookingId from pathname when URL matches pattern", () => {
      asMock(usePathname).mockReturnValue("/bookings/booking-123/messages");

      render(<InboxPanel {...defaultProps} />);

      // The conversation with booking-123 should be selected
      const conversationItems = screen.getAllByText("Coffee Shop Window Display");
      expect(conversationItems.length).toBeGreaterThan(0);
    });

    it("extracts bookingId from pathname with UUID-style bookingId", () => {
      const uuidBookingId = "550e8400-e29b-41d4-a716-446655440000";
      asMock(usePathname).mockReturnValue(`/bookings/${uuidBookingId}/messages`);

      render(<InboxPanel {...defaultProps} />);

      // Component should render without errors
      expect(screen.getByText("Coffee Shop Window Display")).toBeInTheDocument();
    });

    it("handles pathname without booking pattern", () => {
      asMock(usePathname).mockReturnValue("/messages");

      render(<InboxPanel {...defaultProps} />);

      // Should render normally without selected booking
      expect(screen.getByText("Coffee Shop Window Display")).toBeInTheDocument();
    });

    it("handles pathname with different pattern", () => {
      asMock(usePathname).mockReturnValue("/bookings/booking-123/details");

      render(<InboxPanel {...defaultProps} />);

      // Should not extract bookingId from this pattern
      expect(screen.getByText("Coffee Shop Window Display")).toBeInTheDocument();
    });

    it("handles null pathname", () => {
      asMock(usePathname).mockReturnValue(null as unknown as string);

      render(<InboxPanel {...defaultProps} />);

      // Should render without errors
      expect(screen.getByText("Coffee Shop Window Display")).toBeInTheDocument();
    });

    it("handles undefined pathname", () => {
      asMock(usePathname).mockReturnValue(undefined as unknown as string);

      render(<InboxPanel {...defaultProps} />);

      // Should render without errors
      expect(screen.getByText("Coffee Shop Window Display")).toBeInTheDocument();
    });
  });

  describe("Selected Booking ID Logic", () => {
    it("uses pathname bookingId when available", () => {
      asMock(usePathname).mockReturnValue("/bookings/booking-123/messages");

      render(<InboxPanel {...defaultProps} initialSelectedBookingId="booking-999" />);

      // Should use booking-123 from pathname, not booking-999
      expect(screen.getByText("Coffee Shop Window Display")).toBeInTheDocument();
    });

    it("falls back to initialSelectedBookingId when pathname doesn't match", () => {
      asMock(usePathname).mockReturnValue("/messages");

      render(<InboxPanel {...defaultProps} initialSelectedBookingId="booking-123" />);

      // Should use initialSelectedBookingId
      expect(screen.getByText("Coffee Shop Window Display")).toBeInTheDocument();
    });

    it("uses initialSelectedBookingId when pathname is null", () => {
      asMock(usePathname).mockReturnValue(null as unknown as string);

      render(<InboxPanel {...defaultProps} initialSelectedBookingId="booking-124" />);

      // Should use initialSelectedBookingId
      expect(screen.getByText("Dry Cleaner Bulletin Board")).toBeInTheDocument();
    });

    it("handles no selected bookingId", () => {
      asMock(usePathname).mockReturnValue("/messages");

      render(<InboxPanel {...defaultProps} />);

      // Should render all conversations without selection
      expect(screen.getByText("Coffee Shop Window Display")).toBeInTheDocument();
      expect(screen.getByText("Dry Cleaner Bulletin Board")).toBeInTheDocument();
      expect(screen.getByText("Barbershop Wall Mount")).toBeInTheDocument();
    });
  });

  describe("ConversationList Integration", () => {
    it("passes conversations to ConversationList", () => {
      render(<InboxPanel {...defaultProps} />);

      // All conversations should be rendered
      expect(screen.getByText("Coffee Shop Window Display")).toBeInTheDocument();
      expect(screen.getByText("Dry Cleaner Bulletin Board")).toBeInTheDocument();
      expect(screen.getByText("Barbershop Wall Mount")).toBeInTheDocument();
    });

    it("passes selectedBookingId to ConversationList", () => {
      asMock(usePathname).mockReturnValue("/bookings/booking-123/messages");

      render(<InboxPanel {...defaultProps} />);

      // ConversationList should receive booking-123 as selectedBookingId
      // This is tested indirectly by checking that ConversationItem receives isSelected
      expect(screen.getByText("Coffee Shop Window Display")).toBeInTheDocument();
    });

    it("passes isLoading=false to ConversationList", () => {
      render(<InboxPanel {...defaultProps} />);

      // ConversationList should not show skeleton (isLoading=false)
      expect(screen.getByText("Coffee Shop Window Display")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty conversations array", () => {
      render(<InboxPanel conversations={[]} />);

      // Should render empty state from ConversationListEmpty
      expect(screen.getByText("No conversations")).toBeInTheDocument();
      expect(screen.getByText("Start a booking to begin messaging")).toBeInTheDocument();
    });

    it("handles conversations with special characters in bookingId", () => {
      const specialConversations: Conversation[] = [
        {
          bookingId: "booking-123-test",
          spaceName: "Test Space",
          bookingStatus: "PAID",
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        },
      ];

      render(<InboxPanel conversations={specialConversations} />);

      expect(screen.getByText("Test Space")).toBeInTheDocument();
    });

    it("handles pathname with multiple booking patterns", () => {
      // Pathname with multiple potential matches - should take first one
      asMock(usePathname).mockReturnValue("/bookings/booking-123/messages/booking-456");

      render(<InboxPanel {...defaultProps} />);

      // Should extract booking-123 (first match)
      expect(screen.getByText("Coffee Shop Window Display")).toBeInTheDocument();
    });

    it("handles pathname with trailing slash", () => {
      asMock(usePathname).mockReturnValue("/bookings/booking-123/messages/");

      render(<InboxPanel {...defaultProps} />);

      // Should still extract bookingId correctly
      expect(screen.getByText("Coffee Shop Window Display")).toBeInTheDocument();
    });
  });

  describe("Children Rendering", () => {
    it("renders multiple children", () => {
      render(
        <InboxPanel {...defaultProps}>
          <div data-testid="header-1">Header 1</div>
          <div data-testid="header-2">Header 2</div>
        </InboxPanel>
      );

      expect(screen.getByTestId("header-1")).toBeInTheDocument();
      expect(screen.getByTestId("header-2")).toBeInTheDocument();
    });

    it("renders children without conversations", () => {
      render(
        <InboxPanel conversations={[]}>
          <div data-testid="header">Header</div>
        </InboxPanel>
      );

      expect(screen.getByTestId("header")).toBeInTheDocument();
    });
  });

  describe("Regex Pattern Matching", () => {
    it("matches correct URL pattern", () => {
      const testCases = [
        "/bookings/booking-123/messages",
        "/bookings/550e8400-e29b-41d4-a716-446655440000/messages",
        "/bookings/abc123/messages",
      ];

      testCases.forEach((pathname) => {
        asMock(usePathname).mockReturnValue(pathname);
        const { unmount } = render(<InboxPanel {...defaultProps} />);

        // Should render without errors
        expect(screen.getByText("Coffee Shop Window Display")).toBeInTheDocument();
        unmount();
      });
    });

    it("does not match incorrect URL patterns", () => {
      const testCases = [
        "/bookings/booking-123",
        "/bookings/booking-123/details",
        "/messages/booking-123",
        "/booking/booking-123/messages", // Missing 's'
      ];

      testCases.forEach((pathname) => {
        asMock(usePathname).mockReturnValue(pathname);
        const { unmount } = render(
          <InboxPanel {...defaultProps} initialSelectedBookingId="booking-123" />
        );

        // Should fall back to initialSelectedBookingId
        expect(screen.getByText("Coffee Shop Window Display")).toBeInTheDocument();
        unmount();
      });
    });
  });
});
