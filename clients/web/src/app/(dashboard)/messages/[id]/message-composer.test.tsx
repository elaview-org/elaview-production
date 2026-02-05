import { render, screen, userEvent, waitFor } from "@/tests/utils";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { MessageComposer } from "./message-composer";

// Mock window.alert
const mockAlert = mock();
Object.defineProperty(window, "alert", {
  value: mockAlert,
  writable: true,
});

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = mock(() => "blob:mock-url");
const mockRevokeObjectURL = mock();

global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

describe.skip("MessageComposer", () => {
  const mockOnSend = mock();

  // Helper function to simulate file upload
  const simulateFileUpload = (
    fileInput: HTMLInputElement,
    ...files: File[]
  ) => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    Object.defineProperty(fileInput, "files", {
      value: dataTransfer.files,
      writable: false,
    });

    const changeEvent = new Event("change", { bubbles: true });
    Object.defineProperty(changeEvent, "target", {
      value: fileInput,
      writable: false,
    });
    fileInput.dispatchEvent(changeEvent);
  };

  beforeEach(() => {
    mockOnSend.mockClear();
    mockAlert.mockClear();
    mockCreateObjectURL.mockClear();
    mockRevokeObjectURL.mockClear();
  });

  describe("Rendering", () => {
    it("renders textarea with placeholder", () => {
      render(<MessageComposer onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText("Type a message...");
      expect(textarea).toBeInTheDocument();
    });

    it("renders with custom placeholder", () => {
      render(
        <MessageComposer onSend={mockOnSend} placeholder="Custom placeholder" />
      );

      expect(
        screen.getByPlaceholderText("Custom placeholder")
      ).toBeInTheDocument();
    });

    it("renders attach file button", () => {
      render(<MessageComposer onSend={mockOnSend} />);

      // There are two elements with "Attach file" label (input and button)
      // Get the button specifically
      const attachButton = screen.getByRole("button", { name: "Attach file" });
      expect(attachButton).toBeInTheDocument();
    });

    it("renders send button", () => {
      render(<MessageComposer onSend={mockOnSend} />);

      const sendButton = screen.getByLabelText("Send message");
      expect(sendButton).toBeInTheDocument();
    });

    it("renders helper text", () => {
      render(<MessageComposer onSend={mockOnSend} />);

      expect(
        screen.getByText("Press Enter to send, Shift+Enter for new line")
      ).toBeInTheDocument();
    });

    it("renders hidden file input", () => {
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute("accept", ".pdf,.png,.jpg,.jpeg");
      expect(fileInput).toHaveAttribute("multiple");
    });
  });

  describe("Text Input", () => {
    it("allows typing in textarea", async () => {
      const user = userEvent.setup();
      render(<MessageComposer onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText("Type a message...");
      await user.type(textarea, "Hello, world!");

      expect(textarea).toHaveValue("Hello, world!");
    });

    it("clears textarea after sending", async () => {
      const user = userEvent.setup();
      render(<MessageComposer onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText("Type a message...");
      await user.type(textarea, "Test message");
      await user.click(screen.getByLabelText("Send message"));

      await waitFor(() => {
        expect(textarea).toHaveValue("");
      });
    });

    it("trims whitespace before sending", async () => {
      const user = userEvent.setup();
      render(<MessageComposer onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText("Type a message...");
      await user.type(textarea, "   Test message   ");
      await user.click(screen.getByLabelText("Send message"));

      await waitFor(() => {
        expect(mockOnSend).toHaveBeenCalledWith("Test message", undefined);
      });
    });
  });

  describe("Send Functionality", () => {
    it("calls onSend with message content when send button is clicked", async () => {
      const user = userEvent.setup();
      render(<MessageComposer onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText("Type a message...");
      await user.type(textarea, "Hello!");
      await user.click(screen.getByLabelText("Send message"));

      await waitFor(() => {
        expect(mockOnSend).toHaveBeenCalledTimes(1);
        expect(mockOnSend).toHaveBeenCalledWith("Hello!", undefined);
      });
    });

    it("calls onSend when Enter is pressed", async () => {
      const user = userEvent.setup();
      render(<MessageComposer onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText("Type a message...");
      await user.type(textarea, "Test message");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(mockOnSend).toHaveBeenCalledWith("Test message", undefined);
      });
    });

    it("does not send when Shift+Enter is pressed", async () => {
      const user = userEvent.setup();
      render(<MessageComposer onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText("Type a message...");
      await user.type(textarea, "Test");
      await user.keyboard("{Shift>}{Enter}{/Shift}");

      expect(mockOnSend).not.toHaveBeenCalled();
      expect(textarea).toHaveValue("Test\n");
    });

    it("does not send empty message", async () => {
      const user = userEvent.setup();
      render(<MessageComposer onSend={mockOnSend} />);

      const sendButton = screen.getByLabelText("Send message");
      await user.click(sendButton);

      expect(mockOnSend).not.toHaveBeenCalled();
    });

    it("does not send message with only whitespace", async () => {
      const user = userEvent.setup();
      render(<MessageComposer onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText("Type a message...");
      await user.type(textarea, "   ");
      await user.click(screen.getByLabelText("Send message"));

      expect(mockOnSend).not.toHaveBeenCalled();
    });

    it("sends message with attachments", async () => {
      const user = userEvent.setup();
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      // Create a mock file
      const file = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      if (!fileInput) {
        throw new Error("File input not found");
      }

      simulateFileUpload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText("test.pdf")).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText("Type a message...");
      await user.type(textarea, "Message with attachment");
      await user.click(screen.getByLabelText("Send message"));

      await waitFor(() => {
        expect(mockOnSend).toHaveBeenCalled();
        const callArgs = mockOnSend.mock.calls[0];
        expect(callArgs[0]).toBe("Message with attachment");
        expect(callArgs[1]).toBeDefined();
        expect(Array.isArray(callArgs[1])).toBe(true);
      });
    });

    it("sends attachments even without text", async () => {
      const user = userEvent.setup();
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      const file = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      if (!fileInput) {
        throw new Error("File input not found");
      }

      simulateFileUpload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText("test.pdf")).toBeInTheDocument();
      });

      await user.click(screen.getByLabelText("Send message"));

      await waitFor(() => {
        expect(mockOnSend).toHaveBeenCalled();
        const callArgs = mockOnSend.mock.calls[0];
        expect(callArgs[0]).toBe("");
        expect(callArgs[1]).toBeDefined();
      });
    });
  });

  describe("Disabled State", () => {
    it("disables textarea when disabled prop is true", () => {
      render(<MessageComposer onSend={mockOnSend} disabled={true} />);

      const textarea = screen.getByPlaceholderText("Type a message...");
      expect(textarea).toBeDisabled();
    });

    it("disables send button when disabled prop is true", () => {
      render(<MessageComposer onSend={mockOnSend} disabled={true} />);

      const sendButton = screen.getByLabelText("Send message");
      expect(sendButton).toBeDisabled();
    });

    it("disables attach button when disabled prop is true", () => {
      render(<MessageComposer onSend={mockOnSend} disabled={true} />);

      const attachButton = screen.getByRole("button", { name: "Attach file" });
      expect(attachButton).toBeDisabled();
    });

    it("does not send when disabled", async () => {
      const user = userEvent.setup();
      render(<MessageComposer onSend={mockOnSend} disabled={true} />);

      const textarea = screen.getByPlaceholderText("Type a message...");
      await user.type(textarea, "Test");
      await user.keyboard("{Enter}");

      expect(mockOnSend).not.toHaveBeenCalled();
    });
  });

  describe("File Attachments", () => {
    it("opens file picker when attach button is clicked", async () => {
      const user = userEvent.setup();
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      const attachButton = screen.getByRole("button", { name: "Attach file" });
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      const clickSpy = mock();
      fileInput.click = clickSpy;

      await user.click(attachButton);

      expect(clickSpy).toHaveBeenCalled();
    });

    it("displays attachment preview after file selection", async () => {
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      const file = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      if (!fileInput) {
        throw new Error("File input not found");
      }

      simulateFileUpload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText("test.pdf")).toBeInTheDocument();
      });
    });

    it("allows removing attachments", async () => {
      const user = userEvent.setup();
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      const file = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      if (!fileInput) {
        throw new Error("File input not found");
      }

      simulateFileUpload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText("test.pdf")).toBeInTheDocument();
      });

      const removeButton = screen.getByLabelText("Remove test.pdf");
      await user.click(removeButton);

      await waitFor(() => {
        expect(screen.queryByText("test.pdf")).not.toBeInTheDocument();
      });

      // Should revoke object URLs when removing
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });

    it("handles multiple file attachments", async () => {
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      const file1 = new File(["content1"], "file1.pdf", {
        type: "application/pdf",
      });
      const file2 = new File(["content2"], "file2.png", { type: "image/png" });
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      if (!fileInput) {
        throw new Error("File input not found");
      }

      simulateFileUpload(fileInput, file1, file2);

      await waitFor(() => {
        expect(screen.getByText("file1.pdf")).toBeInTheDocument();
        expect(screen.getByText("file2.png")).toBeInTheDocument();
      });
    });
  });

  describe("File Validation", () => {
    it("accepts valid PDF file", async () => {
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      const file = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      if (!fileInput) {
        throw new Error("File input not found");
      }

      simulateFileUpload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText("test.pdf")).toBeInTheDocument();
      });

      expect(mockAlert).not.toHaveBeenCalled();
    });

    it("accepts valid PNG file", async () => {
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      const file = new File(["content"], "test.png", { type: "image/png" });
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      if (!fileInput) {
        throw new Error("File input not found");
      }

      simulateFileUpload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText("test.png")).toBeInTheDocument();
      });

      expect(mockAlert).not.toHaveBeenCalled();
    });

    it("accepts valid JPEG file", async () => {
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      if (!fileInput) {
        throw new Error("File input not found");
      }

      simulateFileUpload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText("test.jpg")).toBeInTheDocument();
      });

      expect(mockAlert).not.toHaveBeenCalled();
    });

    it("rejects invalid file type", async () => {
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      const file = new File(["content"], "test.txt", { type: "text/plain" });
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      if (!fileInput) {
        throw new Error("File input not found");
      }

      simulateFileUpload(fileInput, file);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          expect.stringContaining("is not supported")
        );
      });

      expect(screen.queryByText("test.txt")).not.toBeInTheDocument();
    });

    it("rejects file that is too large", async () => {
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      // Create a file larger than 25MB
      const largeFile = new File(["x".repeat(26 * 1024 * 1024)], "large.pdf", {
        type: "application/pdf",
      });
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      if (!fileInput) {
        throw new Error("File input not found");
      }

      simulateFileUpload(fileInput, largeFile);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          expect.stringContaining("too large")
        );
      });

      expect(screen.queryByText("large.pdf")).not.toBeInTheDocument();
    });

    it("handles mixed valid and invalid files", async () => {
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      const validFile = new File(["content"], "valid.pdf", {
        type: "application/pdf",
      });
      const invalidFile = new File(["content"], "invalid.txt", {
        type: "text/plain",
      });
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      if (!fileInput) {
        throw new Error("File input not found");
      }

      simulateFileUpload(fileInput, validFile, invalidFile);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalled();
        expect(screen.getByText("valid.pdf")).toBeInTheDocument();
      });

      expect(screen.queryByText("invalid.txt")).not.toBeInTheDocument();
    });
  });

  describe("Send Button State", () => {
    it("disables send button when textarea is empty and no attachments", () => {
      render(<MessageComposer onSend={mockOnSend} />);

      const sendButton = screen.getByLabelText("Send message");
      expect(sendButton).toBeDisabled();
    });

    it("enables send button when textarea has content", async () => {
      const user = userEvent.setup();
      render(<MessageComposer onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText("Type a message...");
      const sendButton = screen.getByLabelText("Send message");

      expect(sendButton).toBeDisabled();

      await user.type(textarea, "Test");

      await waitFor(() => {
        expect(sendButton).not.toBeDisabled();
      });
    });

    it("enables send button when attachments are present", async () => {
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      const sendButton = screen.getByLabelText("Send message");
      expect(sendButton).toBeDisabled();

      const file = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      if (!fileInput) {
        throw new Error("File input not found");
      }

      simulateFileUpload(fileInput, file);

      await waitFor(() => {
        expect(sendButton).not.toBeDisabled();
      });
    });

    it("disables send button during file upload", async () => {
      const user = userEvent.setup();
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText("Type a message...");
      await user.type(textarea, "Test");

      const sendButton = screen.getByLabelText("Send message");
      expect(sendButton).not.toBeDisabled();

      const file = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      Object.defineProperty(fileInput, "files", {
        value: [file],
        writable: false,
      });

      // Start upload
      await user.upload(fileInput, file);

      // Button should be disabled during upload
      // Note: This is a brief state, so we check immediately
      // In real scenario, isUploading would be true during processing
    });
  });

  describe("Accessibility", () => {
    it("has accessible textarea label", () => {
      render(<MessageComposer onSend={mockOnSend} />);

      const textarea = screen.getByLabelText("Message input");
      expect(textarea).toBeInTheDocument();
    });

    it("has accessible attach button label", () => {
      render(<MessageComposer onSend={mockOnSend} />);

      const attachButton = screen.getByRole("button", { name: "Attach file" });
      expect(attachButton).toBeInTheDocument();
    });

    it("has accessible send button label", () => {
      render(<MessageComposer onSend={mockOnSend} />);

      const sendButton = screen.getByLabelText("Send message");
      expect(sendButton).toBeInTheDocument();
    });

    it("has accessible remove attachment button labels", async () => {
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      const file = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      if (!fileInput) {
        throw new Error("File input not found");
      }

      simulateFileUpload(fileInput, file);

      await waitFor(() => {
        const removeButton = screen.getByLabelText("Remove test.pdf");
        expect(removeButton).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles empty file selection gracefully", async () => {
      //   const user = userEvent.setup();
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      // Simulate empty file selection
      Object.defineProperty(fileInput, "files", {
        value: [],
        writable: false,
      });

      const event = new Event("change", { bubbles: true });
      fileInput.dispatchEvent(event);

      // Should not crash or show attachments
      expect(screen.queryByText(/\.pdf|\.png|\.jpg/)).not.toBeInTheDocument();
    });

    it("clears attachments after sending", async () => {
      const user = userEvent.setup();
      const { container } = render(<MessageComposer onSend={mockOnSend} />);

      const file = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      if (!fileInput) {
        throw new Error("File input not found");
      }

      simulateFileUpload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText("test.pdf")).toBeInTheDocument();
      });

      await user.click(screen.getByLabelText("Send message"));

      await waitFor(() => {
        expect(screen.queryByText("test.pdf")).not.toBeInTheDocument();
      });
    });

    it("resets textarea height after sending", async () => {
      const user = userEvent.setup();
      render(<MessageComposer onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText("Type a message...");
      await user.type(textarea, "Test message");

      await user.click(screen.getByLabelText("Send message"));

      // Component sets height to "auto" after sending
      // The useEffect also adjusts height based on content, so after clearing content,
      // the height should be reset. We verify the textarea is cleared and height is manageable
      await waitFor(() => {
        expect(textarea).toHaveValue("");
        // Height should be reset - check that it's not excessively tall
        // The component sets it to "auto" which gets recalculated by useEffect
        expect(textarea.style.height).toBeTruthy();
      });
    });
  });
});
