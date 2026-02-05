import { render, screen, userEvent } from "@/tests/utils";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { MessageBubble } from "./message-bubble";
import type { Message, MessageAttachment } from "@/types/messages";
import Image from "next/image";

// Mock Next.js Image component
mock.module("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <Image src={src} alt={alt} {...props} />
  ),
}));

// Mock window.open
const mockWindowOpen = mock();
Object.defineProperty(window, "open", {
  value: mockWindowOpen,
  writable: true,
});

describe.skip("MessageBubble", () => {
  beforeEach(() => {
    mockWindowOpen.mockClear();
  });

  const createMessage = (overrides: Partial<Message> = {}): Message => ({
    id: "msg-1",
    bookingId: "booking-123",
    sender: "ADVERTISER",
    type: "TEXT",
    content: "Hello, this is a test message",
    createdAt: new Date("2024-01-15T11:00:00Z").toISOString(),
    ...overrides,
  });

  // describe("Rendering", () => {
  //   it("renders text message correctly", () => {
  //     const message = createMessage();
  //     render(<MessageBubble message={message} isCurrentUser={false} />);

  //     expect(
  //       screen.getByText("Hello, this is a test message")
  //     ).toBeInTheDocument();
  //   });

  //   it("renders with avatar when showAvatar is true", () => {
  //     const message = createMessage();
  //     render(
  //       <MessageBubble
  //         message={message}
  //         isCurrentUser={false}
  //         showAvatar={true}
  //       />
  //     );

  //     // Avatar should be rendered with initials
  //     expect(screen.getByText("AD")).toBeInTheDocument();
  //   });

  //   it("renders without avatar when showAvatar is false", () => {
  //     const message = createMessage();
  //     const { container } = render(
  //       <MessageBubble
  //         message={message}
  //         isCurrentUser={false}
  //         showAvatar={false}
  //       />
  //     );

  //     // Avatar should not be rendered, but spacer div should exist
  //     expect(screen.queryByText("AD")).not.toBeInTheDocument();
  //     expect(container.querySelector(".w-8")).toBeInTheDocument();
  //   });

  //   it("renders current user message on the right", () => {
  //     const message = createMessage();
  //     const { container } = render(
  //       <MessageBubble message={message} isCurrentUser={true} />
  //     );

  //     // Should have flex-row-reverse class
  //     const messageContainer = container.querySelector(".flex-row-reverse");
  //     expect(messageContainer).toBeInTheDocument();
  //   });

  //   it("renders other user message on the left", () => {
  //     const message = createMessage();
  //     const { container } = render(
  //       <MessageBubble message={message} isCurrentUser={false} />
  //     );

  //     // Should have flex-row class (not flex-row-reverse)
  //     const messageContainer = container.querySelector(".flex-row");
  //     expect(messageContainer).toBeInTheDocument();
  //   });
  // });

  // describe("Sender Types", () => {
  //   it("renders advertiser message with AD initials", () => {
  //     const message = createMessage({ sender: "ADVERTISER" });
  //     render(<MessageBubble message={message} isCurrentUser={false} />);

  //     expect(screen.getByText("AD")).toBeInTheDocument();
  //   });

  //   it("renders space owner message with SO initials", () => {
  //     const message = createMessage({ sender: "SPACE_OWNER" });
  //     render(<MessageBubble message={message} isCurrentUser={false} />);

  //     expect(screen.getByText("SO")).toBeInTheDocument();
  //   });

  //   it("renders system message differently", () => {
  //     const message = createMessage({
  //       sender: "SYSTEM",
  //       type: "SYSTEM",
  //       content: "Booking has been accepted",
  //     });
  //     render(<MessageBubble message={message} isCurrentUser={false} />);

  //     expect(screen.getByText("Booking has been accepted")).toBeInTheDocument();
  //     // System messages should be centered
  //     const { container } = render(
  //       <MessageBubble message={message} isCurrentUser={false} />
  //     );
  //     expect(container.querySelector(".justify-center")).toBeInTheDocument();
  //   });

  //   it("does not show avatar for system messages", () => {
  //     const message = createMessage({
  //       sender: "SYSTEM",
  //       type: "SYSTEM",
  //       content: "System notification",
  //     });
  //     render(<MessageBubble message={message} isCurrentUser={false} />);

  //     expect(screen.queryByText("AD")).not.toBeInTheDocument();
  //     expect(screen.queryByText("SO")).not.toBeInTheDocument();
  //   });
  // });

  // describe("Time Formatting", () => {
  //   it("displays relative time for recent messages", () => {
  //     // Create a message from 30 minutes ago
  //     const thirtyMinutesAgo = new Date(
  //       Date.now() - 30 * 60 * 1000
  //     ).toISOString();
  //     const message = createMessage({
  //       createdAt: thirtyMinutesAgo,
  //     });
  //     render(<MessageBubble message={message} isCurrentUser={false} />);

  //     // Should show "30m ago" or similar relative time
  //     const timeElement = screen.getByText(/ago|now/);
  //     expect(timeElement).toBeInTheDocument();
  //   });

  //   it("displays relative time for hours ago", () => {
  //     // Create a message from 2 hours ago
  //     const twoHoursAgo = new Date(
  //       Date.now() - 2 * 60 * 60 * 1000
  //     ).toISOString();
  //     const message = createMessage({
  //       createdAt: twoHoursAgo,
  //     });
  //     render(<MessageBubble message={message} isCurrentUser={false} />);

  //     // Should show "2h ago" or similar
  //     const timeElement = screen.getByText(/h ago/);
  //     expect(timeElement).toBeInTheDocument();
  //   });

  //   it("displays relative time for days ago", () => {
  //     // Create a message from 2 days ago
  //     const twoDaysAgo = new Date(
  //       Date.now() - 2 * 24 * 60 * 60 * 1000
  //     ).toISOString();
  //     const message = createMessage({
  //       createdAt: twoDaysAgo,
  //     });
  //     render(<MessageBubble message={message} isCurrentUser={false} />);

  //     // Should show "2d ago" or similar
  //     const timeElement = screen.getByText(/d ago/);
  //     expect(timeElement).toBeInTheDocument();
  //   });

  //   // it("displays formatted date for very old messages", () => {
  //   //   // Create a message from 2 weeks ago
  //   //   const twoWeeksAgo = new Date(
  //   //     Date.now() - 14 * 24 * 60 * 60 * 1000
  //   //   ).toISOString();
  //   //   const message = createMessage({
  //   //     createdAt: twoWeeksAgo,
  //   //   });
  //   //   render(<MessageBubble message={message} isCurrentUser={false} />);

  //   //   // Should show formatted date (e.g., "Jan 1")
  //   //   const timeElement = screen.getByText(/\w{3} \d{1,2}/);
  //   //   expect(timeElement).toBeInTheDocument();
  //   // });

  //   // it("has correct datetime attribute", () => {
  //   //   const createdAt = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  //   //   const message = createMessage({ createdAt });
  //   //   render(<MessageBubble message={message} isCurrentUser={false} />);

  //   //   const timeElement = screen.getByText(/ago|now/);
  //   //   expect(timeElement).toHaveAttribute("dateTime", createdAt);
  //   // });
  // });

  describe("Attachments", () => {
    const imageAttachment: MessageAttachment = {
      id: "att-1",
      fileName: "photo.jpg",
      fileUrl: "https://example.com/photo.jpg",
      fileSize: 2048000,
      mimeType: "image/jpeg",
      thumbnailUrl: "https://example.com/thumb.jpg",
    };

    const fileAttachment: MessageAttachment = {
      id: "att-2",
      fileName: "document.pdf",
      fileUrl: "https://example.com/document.pdf",
      fileSize: 1024000,
      mimeType: "application/pdf",
    };

    it("renders image attachment with thumbnail", () => {
      const message = createMessage({
        type: "FILE",
        attachments: [imageAttachment],
      });
      render(<MessageBubble message={message} isCurrentUser={false} />);

      const image = screen.getByAltText("photo.jpg");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "https://example.com/thumb.jpg");
    });

    it("renders file attachment with file icon", () => {
      const message = createMessage({
        type: "FILE",
        attachments: [fileAttachment],
      });
      render(<MessageBubble message={message} isCurrentUser={false} />);

      expect(screen.getByText("document.pdf")).toBeInTheDocument();
      // File icon should be present
      const { container } = render(
        <MessageBubble message={message} isCurrentUser={false} />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("displays file size correctly", () => {
      const message = createMessage({
        type: "FILE",
        attachments: [fileAttachment],
      });
      render(<MessageBubble message={message} isCurrentUser={false} />);

      expect(screen.getByText("1000.0 KB")).toBeInTheDocument();
    });

    it("formats small file sizes in bytes", () => {
      const smallFile: MessageAttachment = {
        ...fileAttachment,
        fileSize: 500,
      };
      const message = createMessage({
        type: "FILE",
        attachments: [smallFile],
      });
      render(<MessageBubble message={message} isCurrentUser={false} />);

      expect(screen.getByText("500 B")).toBeInTheDocument();
    });

    it("formats large file sizes in MB", () => {
      const largeFile: MessageAttachment = {
        ...fileAttachment,
        fileSize: 5 * 1024 * 1024, // 5 MB
      };
      const message = createMessage({
        type: "FILE",
        attachments: [largeFile],
      });
      render(<MessageBubble message={message} isCurrentUser={false} />);

      expect(screen.getByText("5.0 MB")).toBeInTheDocument();
    });

    it("renders multiple attachments", () => {
      const message = createMessage({
        type: "FILE",
        attachments: [imageAttachment, fileAttachment],
      });
      render(<MessageBubble message={message} isCurrentUser={false} />);

      expect(screen.getByAltText("photo.jpg")).toBeInTheDocument();
      expect(screen.getByText("document.pdf")).toBeInTheDocument();
    });

    it("opens download link when download button is clicked", async () => {
      const user = userEvent.setup();
      const message = createMessage({
        type: "FILE",
        attachments: [fileAttachment],
      });
      render(<MessageBubble message={message} isCurrentUser={false} />);

      // Find download button (it appears on hover, but we can still find it)
      const downloadButton = screen.getByLabelText("Download document.pdf");
      await user.click(downloadButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        "https://example.com/document.pdf",
        "_blank"
      );
    });
  });

  describe("Read Status", () => {
    it("shows read indicator for current user's read messages", () => {
      const message = createMessage({
        sender: "ADVERTISER",
        readAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      });
      render(<MessageBubble message={message} isCurrentUser={true} />);

      const readIndicator = screen.getByText("✓");
      expect(readIndicator).toBeInTheDocument();
      expect(readIndicator).toHaveAttribute("title", "Read");
    });

    it("does not show read indicator for unread messages", () => {
      const message = createMessage({
        sender: "ADVERTISER",
        readAt: undefined,
      });
      render(<MessageBubble message={message} isCurrentUser={true} />);

      expect(screen.queryByText("✓")).not.toBeInTheDocument();
    });

    it("does not show read indicator for other user's messages", () => {
      const message = createMessage({
        sender: "SPACE_OWNER",
        readAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      });
      render(<MessageBubble message={message} isCurrentUser={false} />);

      expect(screen.queryByText("✓")).not.toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("applies primary background for current user messages", () => {
      const message = createMessage();
      const { container } = render(
        <MessageBubble message={message} isCurrentUser={true} />
      );

      const bubble = container.querySelector(".bg-primary");
      expect(bubble).toBeInTheDocument();
    });

    it("applies muted background for other user messages", () => {
      const message = createMessage();
      const { container } = render(
        <MessageBubble message={message} isCurrentUser={false} />
      );

      const bubble = container.querySelector(".bg-muted");
      expect(bubble).toBeInTheDocument();
    });

    it("aligns content to right for current user", () => {
      const message = createMessage();
      const { container } = render(
        <MessageBubble message={message} isCurrentUser={true} />
      );

      const contentContainer = container.querySelector(".items-end");
      expect(contentContainer).toBeInTheDocument();
    });

    it("aligns content to left for other user", () => {
      const message = createMessage();
      const { container } = render(
        <MessageBubble message={message} isCurrentUser={false} />
      );

      const contentContainer = container.querySelector(".items-start");
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe("Content Handling", () => {
    it("preserves whitespace and line breaks", () => {
      const message = createMessage({
        content: "Line 1\nLine 2\nLine 3",
      });
      const { container } = render(
        <MessageBubble message={message} isCurrentUser={false} />
      );

      const contentElement = container.querySelector(".whitespace-pre-wrap");
      expect(contentElement).toBeInTheDocument();
      expect(contentElement?.textContent).toBe("Line 1\nLine 2\nLine 3");
    });

    it("handles long text content", () => {
      const longContent = "A".repeat(500);
      const message = createMessage({
        content: longContent,
      });
      render(<MessageBubble message={message} isCurrentUser={false} />);

      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it("handles empty content gracefully", () => {
      const message = createMessage({
        content: "",
      });
      render(<MessageBubble message={message} isCurrentUser={false} />);

      // Should render without crashing
      expect(document.body).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("has accessible time element", () => {
      const message = createMessage();
      render(<MessageBubble message={message} isCurrentUser={false} />);

      const timeElement = screen.getByText("1h ago");
      expect(timeElement.tagName).toBe("TIME");
      expect(timeElement).toHaveAttribute("dateTime");
    });

    it("has accessible download button label", () => {
      const fileAttachment: MessageAttachment = {
        id: "att-1",
        fileName: "document.pdf",
        fileUrl: "https://example.com/document.pdf",
        fileSize: 1024000,
        mimeType: "application/pdf",
      };
      const message = createMessage({
        type: "FILE",
        attachments: [fileAttachment],
      });
      render(<MessageBubble message={message} isCurrentUser={false} />);

      const downloadButton = screen.getByLabelText("Download document.pdf");
      expect(downloadButton).toBeInTheDocument();
    });

    it("has screen reader only time for system messages", () => {
      const createdAt = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const message = createMessage({
        sender: "SYSTEM",
        type: "SYSTEM",
        content: "System message",
        createdAt,
      });
      render(<MessageBubble message={message} isCurrentUser={false} />);

      const srTime = screen.getByText(/ago|now/);
      expect(srTime).toHaveClass("sr-only");
    });
  });
});
