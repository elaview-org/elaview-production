import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "bun:test";
import { ConversationItem } from "./conversation-item";
import type { Conversation } from "@/types/messages";

describe.skip("ConversationItem", () => {
  const createConversation = (
    overrides: Partial<Conversation> = {}
  ): Conversation => ({
    bookingId: "booking-123",
    spaceName: "Coffee Shop Window Display",
    bookingStatus: "PAID",
    unreadCount: 2,
    updatedAt: new Date().toISOString(),
    lastMessage: {
      id: "msg-1",
      bookingId: "booking-123",
      sender: "SPACE_OWNER",
      type: "TEXT",
      content:
        "I've uploaded the verification photos. Please review when you have a chance.",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
    },
    ...overrides,
  });

  describe("Rendering", () => {
    it("renders space name", () => {
      const conversation = createConversation();
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      expect(
        screen.getByText("Coffee Shop Window Display")
      ).toBeInTheDocument();
    });

    it("renders last message preview", () => {
      const conversation = createConversation();
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      expect(
        screen.getByText(/I've uploaded the verification photos/)
      ).toBeInTheDocument();
    });

    it("renders booking ID badge", () => {
      const conversation = createConversation();
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      expect(screen.getByText("Booking #123")).toBeInTheDocument();
    });

    it("renders as a link", () => {
      const conversation = createConversation();
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/messages/booking-123");
    });
  });

  describe("Avatar", () => {
    it("renders avatar with initials from space name", () => {
      const conversation = createConversation({
        spaceName: "Coffee Shop Window Display",
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      expect(screen.getByText("CS")).toBeInTheDocument();
    });

    it("generates initials from first letters of words", () => {
      const conversation = createConversation({
        spaceName: "Dry Cleaner Bulletin Board",
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      expect(screen.getByText("DC")).toBeInTheDocument();
    });

    it("limits initials to 2 characters", () => {
      const conversation = createConversation({
        spaceName: "A B C D E F G",
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      expect(screen.getByText("AB")).toBeInTheDocument();
    });

    it("converts initials to uppercase", () => {
      const conversation = createConversation({
        spaceName: "coffee shop window",
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      expect(screen.getByText("CS")).toBeInTheDocument();
    });
  });

  describe("Last Message", () => {
    it("shows last message preview when available", () => {
      const conversation = createConversation({
        lastMessage: {
          id: "msg-1",
          bookingId: "booking-123",
          sender: "ADVERTISER",
          type: "TEXT",
          content: "Hello, this is a test message",
          createdAt: new Date().toISOString(),
        },
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      expect(
        screen.getByText("Hello, this is a test message")
      ).toBeInTheDocument();
    });

    it("shows 'No messages yet' when no last message", () => {
      const conversation = createConversation({
        lastMessage: undefined,
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      expect(screen.getByText("No messages yet")).toBeInTheDocument();
    });

    it("truncates long messages to 60 characters", () => {
      const longMessage = "A".repeat(100);
      const conversation = createConversation({
        lastMessage: {
          id: "msg-1",
          bookingId: "booking-123",
          sender: "ADVERTISER",
          type: "TEXT",
          content: longMessage,
          createdAt: new Date().toISOString(),
        },
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      // Should show truncated version (60 chars + "...")
      const preview = screen.getByText(/^A{60}/);
      expect(preview).toBeInTheDocument();
    });

    it("shows timestamp when last message exists", () => {
      const conversation = createConversation({
        lastMessage: {
          id: "msg-1",
          bookingId: "booking-123",
          sender: "ADVERTISER",
          type: "TEXT",
          content: "Test message",
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      const timeElement = screen.getByText(/ago|now/);
      expect(timeElement).toBeInTheDocument();
      expect(timeElement.tagName).toBe("TIME");
    });

    it("does not show timestamp when no last message", () => {
      const conversation = createConversation({
        lastMessage: undefined,
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      const timeElements = screen.queryAllByRole("time");
      expect(timeElements.length).toBe(0);
    });

    it("has correct datetime attribute on timestamp", () => {
      const createdAt = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const conversation = createConversation({
        lastMessage: {
          id: "msg-1",
          bookingId: "booking-123",
          sender: "ADVERTISER",
          type: "TEXT",
          content: "Test message",
          createdAt,
        },
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      const timeElement = screen.getByText(/ago|now/);
      expect(timeElement).toHaveAttribute("dateTime", createdAt);
    });
  });

  describe("Unread Count", () => {
    it("shows unread count badge when count is greater than 0", () => {
      const conversation = createConversation({
        unreadCount: 5,
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("does not show unread badge when count is 0", () => {
      const conversation = createConversation({
        unreadCount: 0,
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      // Badge should not be rendered (only booking ID badge should exist)
      const badges = screen.getAllByText(/Booking #|^\d+$/);
      expect(badges.length).toBe(1); // Only booking badge
    });

    it("shows correct unread count", () => {
      const conversation = createConversation({
        unreadCount: 99,
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      expect(screen.getByText("99")).toBeInTheDocument();
    });

    it("handles large unread counts", () => {
      const conversation = createConversation({
        unreadCount: 999,
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      expect(screen.getByText("999")).toBeInTheDocument();
    });
  });

  describe("Selected State", () => {
    it("applies selected styling when isSelected is true", () => {
      const conversation = createConversation();
      const { container } = render(
        <ConversationItem conversation={conversation} isSelected={true} />
      );

      const link = container.querySelector("a");
      expect(link).toHaveClass("bg-muted");
    });

    it("does not apply selected styling when isSelected is false", () => {
      const conversation = createConversation();
      const { container } = render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      const link = container.querySelector("a");
      expect(link).not.toHaveClass("bg-muted");
    });
  });

  describe("Booking ID Badge", () => {
    it("extracts booking ID correctly from booking-123 format", () => {
      const conversation = createConversation({
        bookingId: "booking-123",
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      expect(screen.getByText("Booking #123")).toBeInTheDocument();
    });

    it("extracts booking ID correctly from booking-abc-456 format", () => {
      const conversation = createConversation({
        bookingId: "booking-abc-456",
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      expect(screen.getByText("Booking #abc")).toBeInTheDocument();
    });

    it("handles booking ID without hyphen", () => {
      const conversation = createConversation({
        bookingId: "booking123",
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      // Should handle gracefully
      expect(screen.getByText(/Booking #/)).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("links to correct conversation route", () => {
      const conversation = createConversation({
        bookingId: "booking-456",
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/messages/booking-456");
    });

    it("updates href when booking ID changes", () => {
      const conversation1 = createConversation({
        bookingId: "booking-111",
      });
      const { rerender } = render(
        <ConversationItem conversation={conversation1} isSelected={false} />
      );

      expect(screen.getByRole("link")).toHaveAttribute(
        "href",
        "/messages/booking-111"
      );

      const conversation2 = createConversation({
        bookingId: "booking-222",
      });
      rerender(
        <ConversationItem conversation={conversation2} isSelected={false} />
      );

      expect(screen.getByRole("link")).toHaveAttribute(
        "href",
        "/messages/booking-222"
      );
    });
  });

  describe("Accessibility", () => {
    it("has accessible link label", () => {
      const conversation = createConversation({
        spaceName: "Coffee Shop Window Display",
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      const link = screen.getByLabelText(
        "Open conversation for Coffee Shop Window Display"
      );
      expect(link).toBeInTheDocument();
    });

    it("has focus-visible styles", () => {
      const conversation = createConversation();
      const { container } = render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      const link = container.querySelector("a");
      expect(link).toHaveClass("focus-visible:bg-muted/50");
      expect(link).toHaveClass("focus-visible:outline-none");
    });

    it("has hover styles", () => {
      const conversation = createConversation();
      const { container } = render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      const link = container.querySelector("a");
      expect(link).toHaveClass("hover:bg-muted/50");
    });
  });

  describe("Styling", () => {
    it("has correct layout classes", () => {
      const conversation = createConversation();
      const { container } = render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      const link = container.querySelector("a");
      expect(link).toHaveClass("block");
      expect(link).toHaveClass("w-full");
      expect(link).toHaveClass("text-left");
      expect(link).toHaveClass("transition-colors");
    });

    it("has correct flex layout for content", () => {
      const conversation = createConversation();
      const { container } = render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      const contentDiv = container.querySelector(".flex.items-start");
      expect(contentDiv).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty space name", () => {
      const conversation = createConversation({
        spaceName: "",
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      // Should render without crashing
      expect(screen.getByText(/Booking #/)).toBeInTheDocument();
    });

    it("handles conversation with only spaces in name", () => {
      const conversation = createConversation({
        spaceName: "   ",
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      // Should render without crashing
      expect(screen.getByText(/Booking #/)).toBeInTheDocument();
    });

    it("handles very long booking ID", () => {
      const conversation = createConversation({
        bookingId: "booking-" + "x".repeat(100),
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      // Should render without crashing
      expect(screen.getByText(/Booking #/)).toBeInTheDocument();
    });

    it("handles system messages in last message", () => {
      const conversation = createConversation({
        lastMessage: {
          id: "msg-1",
          bookingId: "booking-123",
          sender: "SYSTEM",
          type: "SYSTEM",
          content: "Booking has been completed",
          createdAt: new Date().toISOString(),
        },
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      expect(
        screen.getByText("Booking has been completed")
      ).toBeInTheDocument();
    });

    it("handles file messages in last message", () => {
      const conversation = createConversation({
        lastMessage: {
          id: "msg-1",
          bookingId: "booking-123",
          sender: "SPACE_OWNER",
          type: "FILE",
          content: "Here's the installation photo",
          createdAt: new Date().toISOString(),
        },
      });
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      expect(
        screen.getByText("Here's the installation photo")
      ).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("renders all required elements", () => {
      const conversation = createConversation();
      render(
        <ConversationItem conversation={conversation} isSelected={false} />
      );

      // Space name
      expect(
        screen.getByText("Coffee Shop Window Display")
      ).toBeInTheDocument();
      // Last message preview
      expect(screen.getByText(/I've uploaded/)).toBeInTheDocument();
      // Booking ID badge
      expect(screen.getByText("Booking #123")).toBeInTheDocument();
      // Unread count badge
      expect(screen.getByText("2")).toBeInTheDocument();
      // Avatar with initials
      expect(screen.getByText("CS")).toBeInTheDocument();
    });
  });
});
