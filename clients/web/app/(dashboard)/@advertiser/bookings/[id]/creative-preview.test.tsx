import { render, screen } from "@/test/utils";
import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import userEvent from "@testing-library/user-event";
import { CreativePreviewCard } from "./creative-preview-card";

describe("CreativePreviewCard", () => {
  let originalWindowOpen: typeof window.open;

  beforeEach(() => {
    originalWindowOpen = window.open;
    window.open = mock(() => null);
  });

  afterEach(() => {
    window.open = originalWindowOpen;
  });

  const createMockProps = (
    overrides: Partial<Parameters<typeof CreativePreviewCard>[0]> = {}
  ) => ({
    creativeFileUrl: "https://example.com/creative.pdf",
    creativeFileName: "creative.pdf",
    creativeFileSize: 5242880, // 5 MB
    width: 24,
    height: 36,
    dimensionUnit: "inches",
    ...overrides,
  });

  describe("Rendering", () => {
    it("renders card with title", () => {
      const props = createMockProps();
      render(<CreativePreviewCard {...props} />);

      expect(screen.getByText("Creative File")).toBeInTheDocument();
    });

    it("renders file preview icon", () => {
      const props = createMockProps();
      const { container } = render(<CreativePreviewCard {...props} />);

      // FileText icon should be present
      const previewSection = container.querySelector(".bg-muted");
      const svg = previewSection?.querySelector("svg");
      expect(svg).toBeTruthy();
    });
  });

  describe("File Name Display", () => {
    it("displays file name when provided", () => {
      const props = createMockProps({
        creativeFileName: "summer-promo.pdf",
      });
      render(<CreativePreviewCard {...props} />);

      expect(screen.getByText("summer-promo.pdf")).toBeInTheDocument();
    });

    it("does not display file info section when file name is missing", () => {
      const props = createMockProps({
        creativeFileName: null,
      });
      render(<CreativePreviewCard {...props} />);

      // File name section should not be present (card title "Creative File" will still be there)
      expect(screen.queryByText(/\.pdf|\.png|\.jpg/i)).not.toBeInTheDocument();
    });

    it("does not display file info section when file name is undefined", () => {
      const props = createMockProps({
        creativeFileName: undefined,
      });
      render(<CreativePreviewCard {...props} />);

      // File name section should not be present (card title "Creative File" will still be there)
      expect(screen.queryByText(/\.pdf|\.png|\.jpg/i)).not.toBeInTheDocument();
    });
  });

  describe("File Size Formatting", () => {
    it("formats file size correctly in MB", () => {
      const props = createMockProps({
        creativeFileSize: 5242880, // 5 MB
      });
      render(<CreativePreviewCard {...props} />);

      const fileSizeSection = screen.getByText(/5\.0 MB/i).closest("p");
      expect(fileSizeSection).toHaveTextContent("5.0 MB");
    });

    it("formats small file size correctly", () => {
      const props = createMockProps({
        creativeFileSize: 1048576, // 1 MB
      });
      render(<CreativePreviewCard {...props} />);

      const fileSizeSection = screen.getByText(/1\.0 MB/i).closest("p");
      expect(fileSizeSection).toHaveTextContent("1.0 MB");
    });

    it("formats large file size correctly", () => {
      const props = createMockProps({
        creativeFileSize: 26214400, // 25 MB
      });
      render(<CreativePreviewCard {...props} />);

      const fileSizeSection = screen.getByText(/25\.0 MB/i).closest("p");
      expect(fileSizeSection).toHaveTextContent("25.0 MB");
    });

    it("formats fractional file size correctly", () => {
      const props = createMockProps({
        creativeFileSize: 1572864, // 1.5 MB
      });
      render(<CreativePreviewCard {...props} />);

      const fileSizeSection = screen.getByText(/1\.5 MB/i).closest("p");
      expect(fileSizeSection).toHaveTextContent("1.5 MB");
    });

    it("shows 'Unknown size' when file size is null", () => {
      const props = createMockProps({
        creativeFileName: "file.pdf", // Need filename for file info section to render
        creativeFileSize: null,
      });
      render(<CreativePreviewCard {...props} />);

      // File size text is in a paragraph element
      const fileSizeParagraph = screen.getByText("file.pdf").nextElementSibling;
      expect(fileSizeParagraph).toHaveTextContent("Unknown size");
    });

    it("shows 'Unknown size' when file size is undefined", () => {
      const props = createMockProps({
        creativeFileName: "file.pdf", // Need filename for file info section to render
        creativeFileSize: undefined,
      });
      render(<CreativePreviewCard {...props} />);

      // File size text is in a paragraph element
      const fileSizeParagraph = screen.getByText("file.pdf").nextElementSibling;
      expect(fileSizeParagraph).toHaveTextContent("Unknown size");
    });

    it("shows 'Unknown size' when file size is 0 (falsy)", () => {
      const props = createMockProps({
        creativeFileName: "file.pdf", // Need filename for file info section to render
        creativeFileSize: 0, // 0 is falsy, so formatFileSize returns "Unknown size"
      });
      render(<CreativePreviewCard {...props} />);

      // File size of 0 is treated as falsy and returns "Unknown size"
      const fileSizeParagraph = screen.getByText("file.pdf").nextElementSibling;
      expect(fileSizeParagraph).toHaveTextContent("Unknown size");
    });
  });

  describe("Dimensions Display", () => {
    it("displays dimensions when all dimension props are provided", () => {
      const props = createMockProps({
        width: 24,
        height: 36,
        dimensionUnit: "inches",
      });
      render(<CreativePreviewCard {...props} />);

      expect(screen.getByText(/24×36 inches/i)).toBeInTheDocument();
    });

    it("displays dimensions with different units", () => {
      const props = createMockProps({
        width: 100,
        height: 200,
        dimensionUnit: "cm",
      });
      render(<CreativePreviewCard {...props} />);

      expect(screen.getByText(/100×200 cm/i)).toBeInTheDocument();
    });

    it("does not display dimensions when width is missing", () => {
      const props = createMockProps({
        width: undefined,
        height: 36,
        dimensionUnit: "inches",
      });
      render(<CreativePreviewCard {...props} />);

      expect(screen.queryByText(/×/i)).not.toBeInTheDocument();
    });

    it("does not display dimensions when height is missing", () => {
      const props = createMockProps({
        width: 24,
        height: undefined,
        dimensionUnit: "inches",
      });
      render(<CreativePreviewCard {...props} />);

      expect(screen.queryByText(/×/i)).not.toBeInTheDocument();
    });

    it("does not display dimensions when dimensionUnit is missing", () => {
      const props = createMockProps({
        width: 24,
        height: 36,
        dimensionUnit: undefined,
      });
      render(<CreativePreviewCard {...props} />);

      expect(screen.queryByText(/×/i)).not.toBeInTheDocument();
    });

    it("displays file size without dimensions when dimensions are missing", () => {
      const props = createMockProps({
        width: undefined,
        height: undefined,
        dimensionUnit: undefined,
        creativeFileSize: 5242880,
      });
      render(<CreativePreviewCard {...props} />);

      expect(screen.getByText("5.0 MB")).toBeInTheDocument();
      expect(screen.queryByText(/×/i)).not.toBeInTheDocument();
    });
  });

  describe("Validation Badges", () => {
    it("displays validation badges when creativeFileUrl is provided", () => {
      const props = createMockProps({
        creativeFileUrl: "https://example.com/file.pdf",
      });
      render(<CreativePreviewCard {...props} />);

      expect(screen.getByText("Specs validated")).toBeInTheDocument();
      expect(screen.getByText("File approved")).toBeInTheDocument();
    });

    it("does not display validation badges when creativeFileUrl is null", () => {
      const props = createMockProps({
        creativeFileUrl: null,
      });
      render(<CreativePreviewCard {...props} />);

      expect(screen.queryByText("Specs validated")).not.toBeInTheDocument();
      expect(screen.queryByText("File approved")).not.toBeInTheDocument();
    });

    it("does not display validation badges when creativeFileUrl is undefined", () => {
      const props = createMockProps({
        creativeFileUrl: undefined,
      });
      render(<CreativePreviewCard {...props} />);

      expect(screen.queryByText("Specs validated")).not.toBeInTheDocument();
      expect(screen.queryByText("File approved")).not.toBeInTheDocument();
    });

    it("displays check icons in badges", () => {
      const props = createMockProps({
        creativeFileUrl: "https://example.com/file.pdf",
      });
      render(<CreativePreviewCard {...props} />);

      // CheckCircle2 icons should be present in badges
      const badges = screen.getAllByText(/Specs validated|File approved/i);
      badges.forEach((badge) => {
        const svg = badge.querySelector("svg");
        expect(svg).toBeTruthy();
      });
    });
  });

  describe("Action Buttons", () => {
    it("displays Download File button when creativeFileUrl is provided", () => {
      const props = createMockProps({
        creativeFileUrl: "https://example.com/file.pdf",
      });
      render(<CreativePreviewCard {...props} />);

      expect(screen.getByText("Download File")).toBeInTheDocument();
    });

    it("displays View Full Size button when creativeFileUrl is provided", () => {
      const props = createMockProps({
        creativeFileUrl: "https://example.com/file.pdf",
      });
      render(<CreativePreviewCard {...props} />);

      expect(screen.getByText("View Full Size")).toBeInTheDocument();
    });

    it("does not display action buttons when creativeFileUrl is null", () => {
      const props = createMockProps({
        creativeFileUrl: null,
      });
      render(<CreativePreviewCard {...props} />);

      expect(screen.queryByText("Download File")).not.toBeInTheDocument();
      expect(screen.queryByText("View Full Size")).not.toBeInTheDocument();
    });

    it("does not display action buttons when creativeFileUrl is undefined", () => {
      const props = createMockProps({
        creativeFileUrl: undefined,
      });
      render(<CreativePreviewCard {...props} />);

      expect(screen.queryByText("Download File")).not.toBeInTheDocument();
      expect(screen.queryByText("View Full Size")).not.toBeInTheDocument();
    });

    it("displays icons in action buttons", () => {
      const props = createMockProps({
        creativeFileUrl: "https://example.com/file.pdf",
      });
      render(<CreativePreviewCard {...props} />);

      const downloadButton = screen.getByText("Download File");
      const viewButton = screen.getByText("View Full Size");

      // Download icon should be present
      const downloadSvg = downloadButton.querySelector("svg");
      expect(downloadSvg).toBeTruthy();

      // Maximize icon should be present
      const viewSvg = viewButton.querySelector("svg");
      expect(viewSvg).toBeTruthy();
    });
  });

  describe("Download Functionality", () => {
    it("opens file URL in new window when Download File button is clicked", async () => {
      const user = userEvent.setup();
      const props = createMockProps({
        creativeFileUrl: "https://example.com/creative.pdf",
      });
      render(<CreativePreviewCard {...props} />);

      const downloadButton = screen.getByText("Download File");
      await user.click(downloadButton);

      expect(window.open).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith(
        "https://example.com/creative.pdf",
        "_blank"
      );
    });

    it("opens file URL in new window when View Full Size button is clicked", async () => {
      const user = userEvent.setup();
      const props = createMockProps({
        creativeFileUrl: "https://example.com/creative.pdf",
      });
      render(<CreativePreviewCard {...props} />);

      const viewButton = screen.getByText("View Full Size");
      await user.click(viewButton);

      expect(window.open).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith(
        "https://example.com/creative.pdf",
        "_blank"
      );
    });

    it("does not call window.open when creativeFileUrl is null", () => {
      const props = createMockProps({
        creativeFileUrl: null,
      });
      render(<CreativePreviewCard {...props} />);

      // Buttons shouldn't be rendered, so this shouldn't be called
      expect(window.open).not.toHaveBeenCalled();
    });

    it("handles different file URL formats", async () => {
      const user = userEvent.setup();
      const props = createMockProps({
        creativeFileUrl: "https://cdn.example.com/files/12345/poster.png",
      });
      render(<CreativePreviewCard {...props} />);

      const downloadButton = screen.getByText("Download File");
      await user.click(downloadButton);

      expect(window.open).toHaveBeenCalledWith(
        "https://cdn.example.com/files/12345/poster.png",
        "_blank"
      );
    });
  });

  describe("Edge Cases", () => {
    it("handles component with only file URL", () => {
      const props = {
        creativeFileUrl: "https://example.com/file.pdf",
      };
      render(<CreativePreviewCard {...props} />);

      expect(screen.getByText("Creative File")).toBeInTheDocument();
      expect(screen.getByText("Download File")).toBeInTheDocument();
      // File name section should not be present
      expect(screen.queryByText(/\.pdf|\.png|\.jpg/i)).not.toBeInTheDocument();
    });

    it("handles component with only file name", () => {
      const props = {
        creativeFileName: "document.pdf",
      };
      render(<CreativePreviewCard {...props} />);

      expect(screen.getByText("document.pdf")).toBeInTheDocument();
      expect(screen.getByText("Unknown size")).toBeInTheDocument();
      expect(screen.queryByText("Download File")).not.toBeInTheDocument();
    });

    it("handles empty props", () => {
      render(<CreativePreviewCard />);

      expect(screen.getByText("Creative File")).toBeInTheDocument();
      // File name section should not be present
      expect(screen.queryByText(/\.pdf|\.png|\.jpg/i)).not.toBeInTheDocument();
      expect(screen.queryByText("Download File")).not.toBeInTheDocument();
    });

    it("handles very large file sizes", () => {
      const props = createMockProps({
        creativeFileSize: 104857600, // 100 MB
      });
      render(<CreativePreviewCard {...props} />);

      const fileSizeSection = screen.getByText(/100\.0 MB/i).closest("p");
      expect(fileSizeSection).toHaveTextContent("100.0 MB");
    });

    it("handles very small file sizes", () => {
      const props = createMockProps({
        creativeFileSize: 1024, // 0.001 MB
      });
      render(<CreativePreviewCard {...props} />);

      const fileSizeSection = screen.getByText(/0\.0 MB/i).closest("p");
      expect(fileSizeSection).toHaveTextContent("0.0 MB");
    });

    it("does not display dimensions when width is 0 (falsy)", () => {
      const props = createMockProps({
        creativeFileName: "file.pdf",
        width: 0, // 0 is falsy, so dimensions won't render
        height: 0,
        dimensionUnit: "inches",
      });
      render(<CreativePreviewCard {...props} />);

      // Dimensions won't render because width && height && dimensionUnit evaluates to false
      const fileSizeParagraph = screen.getByText("file.pdf").nextElementSibling;
      expect(fileSizeParagraph).toHaveTextContent("5.0 MB");
      expect(fileSizeParagraph).not.toHaveTextContent(/×/);
    });
  });

  describe("Component Structure", () => {
    it("renders all sections when all props are provided", () => {
      const props = createMockProps({
        creativeFileUrl: "https://example.com/creative.pdf",
        creativeFileName: "creative.pdf",
        creativeFileSize: 5242880,
        width: 24,
        height: 36,
        dimensionUnit: "inches",
      });
      render(<CreativePreviewCard {...props} />);

      // Verify all sections
      expect(screen.getByText("Creative File")).toBeInTheDocument();
      expect(screen.getByText("creative.pdf")).toBeInTheDocument();

      const fileSizeSection = screen.getByText(/5\.0 MB/i).closest("p");
      expect(fileSizeSection).toHaveTextContent("5.0 MB");
      expect(fileSizeSection).toHaveTextContent(/24×36 inches/i);

      expect(screen.getByText("Specs validated")).toBeInTheDocument();
      expect(screen.getByText("File approved")).toBeInTheDocument();
      expect(screen.getByText("Download File")).toBeInTheDocument();
      expect(screen.getByText("View Full Size")).toBeInTheDocument();
    });

    it("renders minimal structure when only file URL is provided", () => {
      const props = {
        creativeFileUrl: "https://example.com/file.pdf",
      };
      render(<CreativePreviewCard {...props} />);

      expect(screen.getByText("Creative File")).toBeInTheDocument();
      expect(screen.getByText("Download File")).toBeInTheDocument();
      expect(screen.getByText("View Full Size")).toBeInTheDocument();
      expect(screen.getByText("Specs validated")).toBeInTheDocument();
      expect(screen.getByText("File approved")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has accessible buttons", () => {
      const props = createMockProps({
        creativeFileUrl: "https://example.com/file.pdf",
      });
      render(<CreativePreviewCard {...props} />);

      const downloadButton = screen.getByRole("button", {
        name: /download file/i,
      });
      expect(downloadButton).toBeInTheDocument();

      const viewButton = screen.getByRole("button", {
        name: /view full size/i,
      });
      expect(viewButton).toBeInTheDocument();
    });

    it("has semantic card structure", () => {
      const props = createMockProps();
      render(<CreativePreviewCard {...props} />);

      // Card title should be present
      expect(screen.getByText("Creative File")).toBeInTheDocument();
    });
  });
});
