import { render, screen } from "@/test/utils";
import { describe, it, expect, mock } from "bun:test";
import SpaceInfo from "./space-info";

// Mock next/image
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

describe("SpaceInfo", () => {
  const createMockSpace = (
    overrides: Partial<
      NonNullable<Parameters<typeof SpaceInfo>[0]["space"]>
    > = {}
  ) => ({
    id: "space-123",
    title: "Coffee Shop Window Display",
    photos: ["https://example.com/photo1.jpg"],
    location: {
      address: "123 Main St",
      city: "Los Angeles",
      state: "CA",
    },
    width: 24,
    height: 36,
    dimensionUnit: "inches",
    spaceType: {
      name: "Window Poster",
    },
    owner: {
      id: "owner-123",
      firstName: "John",
      lastName: "Doe",
      avatarUrl: "https://example.com/avatar.jpg",
    },
    ...overrides,
  });

  describe("Rendering", () => {
    it("renders card with title", () => {
      const space = createMockSpace();
      render(<SpaceInfo space={space} />);

      expect(screen.getByText("Space Information")).toBeInTheDocument();
    });

    it("renders space title", () => {
      const space = createMockSpace();
      render(<SpaceInfo space={space} />);

      expect(
        screen.getByText("Coffee Shop Window Display")
      ).toBeInTheDocument();
    });

    it("renders View Space button", () => {
      const space = createMockSpace();
      render(<SpaceInfo space={space} />);

      expect(screen.getByText("View Space")).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("renders empty state when space is not provided", () => {
      render(<SpaceInfo />);

      expect(screen.getByText("Space Information")).toBeInTheDocument();
      expect(
        screen.getByText("No space information available")
      ).toBeInTheDocument();
    });

    it("does not render space details when space is null", () => {
      render(<SpaceInfo space={undefined} />);

      expect(
        screen.getByText("No space information available")
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Coffee Shop Window Display")
      ).not.toBeInTheDocument();
    });
  });

  describe("Location Formatting", () => {
    it("formats location with address, city, and state", () => {
      const space = createMockSpace({
        location: {
          address: "123 Main St",
          city: "Los Angeles",
          state: "CA",
        },
      });
      render(<SpaceInfo space={space} />);

      expect(
        screen.getByText("123 Main St, Los Angeles, CA")
      ).toBeInTheDocument();
    });

    it("shows 'Location not available' when location is missing", () => {
      const space = createMockSpace({
        location: undefined,
      });
      render(<SpaceInfo space={space} />);

      expect(screen.getByText("Location not available")).toBeInTheDocument();
    });

    it("handles missing address", () => {
      const space = createMockSpace({
        location: {
          address: "",
          city: "Los Angeles",
          state: "CA",
        },
      });
      render(<SpaceInfo space={space} />);

      // Should still format with empty address
      expect(screen.getByText(", Los Angeles, CA")).toBeInTheDocument();
    });
  });

  describe("Dimensions Formatting", () => {
    it("formats dimensions correctly", () => {
      const space = createMockSpace({
        width: 24,
        height: 36,
        dimensionUnit: "inches",
      });
      render(<SpaceInfo space={space} />);

      expect(screen.getByText("24×36 inches")).toBeInTheDocument();
    });

    it("formats dimensions with different units", () => {
      const space = createMockSpace({
        width: 100,
        height: 200,
        dimensionUnit: "cm",
      });
      render(<SpaceInfo space={space} />);

      expect(screen.getByText("100×200 cm")).toBeInTheDocument();
    });

    it("shows 'Dimensions not available' when dimensions are missing", () => {
      const space = createMockSpace({
        width: undefined,
        height: undefined,
        dimensionUnit: undefined,
      });
      render(<SpaceInfo space={space} />);

      expect(screen.getByText("Dimensions not available")).toBeInTheDocument();
    });

    it("shows 'Dimensions not available' when width is missing", () => {
      const space = createMockSpace({
        width: undefined,
        height: 36,
        dimensionUnit: "inches",
      });
      render(<SpaceInfo space={space} />);

      expect(screen.getByText("Dimensions not available")).toBeInTheDocument();
    });

    it("shows 'Dimensions not available' when height is missing", () => {
      const space = createMockSpace({
        width: 24,
        height: undefined,
        dimensionUnit: "inches",
      });
      render(<SpaceInfo space={space} />);

      expect(screen.getByText("Dimensions not available")).toBeInTheDocument();
    });

    it("shows 'Dimensions not available' when dimensionUnit is missing", () => {
      const space = createMockSpace({
        width: 24,
        height: 36,
        dimensionUnit: undefined,
      });
      render(<SpaceInfo space={space} />);

      expect(screen.getByText("Dimensions not available")).toBeInTheDocument();
    });
  });

  describe("Space Type Badge", () => {
    it("displays space type badge when provided", () => {
      const space = createMockSpace({
        spaceType: {
          name: "Window Poster",
        },
      });
      render(<SpaceInfo space={space} />);

      expect(screen.getByText("Window Poster")).toBeInTheDocument();
    });

    it("does not display space type badge when missing", () => {
      const space = createMockSpace({
        spaceType: undefined,
      });
      render(<SpaceInfo space={space} />);

      // Badge should not be present
      const badges = screen.queryAllByText(/Window Poster/i);
      expect(badges.length).toBe(0);
    });
  });

  describe("Space Photos", () => {
    it("displays first photo when photos are provided", () => {
      const space = createMockSpace({
        photos: [
          "https://example.com/photo1.jpg",
          "https://example.com/photo2.jpg",
        ],
      });
      render(<SpaceInfo space={space} />);

      const image = screen.getByAltText("Coffee Shop Window Display");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "https://example.com/photo1.jpg");
    });

    it("does not display photo section when photos are empty", () => {
      const space = createMockSpace({
        photos: [],
      });
      render(<SpaceInfo space={space} />);

      // Photo section should not render
      const images = screen.queryAllByRole("img");
      // Only avatar image should be present (if owner exists)
      expect(images.length).toBeLessThanOrEqual(1);
    });

    it("does not display photo section when photos are undefined", () => {
      const space = createMockSpace({
        photos: undefined,
      });
      render(<SpaceInfo space={space} />);

      // Photo section should not render
      const images = screen.queryAllByRole("img");
      // Only avatar image should be present (if owner exists)
      expect(images.length).toBeLessThanOrEqual(1);
    });
  });

  describe("Owner Information", () => {
    it("displays owner name when owner is provided", () => {
      const space = createMockSpace({
        owner: {
          id: "owner-123",
          firstName: "Jane",
          lastName: "Smith",
          avatarUrl: "https://example.com/avatar.jpg",
        },
      });
      render(<SpaceInfo space={space} />);

      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    it("displays owner avatar when avatarUrl is provided", () => {
      const space = createMockSpace({
        owner: {
          id: "owner-123",
          firstName: "John",
          lastName: "Doe",
          avatarUrl: "https://example.com/avatar.jpg",
        },
      });
      render(<SpaceInfo space={space} />);

      // Avatar component renders the image, but alt text might be handled differently
      // Verify owner name is displayed
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      // Avatar should be present (check for img element)
      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
    });

    it("displays owner initials when avatarUrl is missing", () => {
      const space = createMockSpace({
        owner: {
          id: "owner-123",
          firstName: "John",
          lastName: "Doe",
          avatarUrl: null,
        },
      });
      render(<SpaceInfo space={space} />);

      // Avatar fallback should show initials "JD"
      const avatarFallback = screen.getByText("JD");
      expect(avatarFallback).toBeInTheDocument();
    });

    it("displays owner rating", () => {
      const space = createMockSpace({
        owner: {
          id: "owner-123",
          firstName: "John",
          lastName: "Doe",
          avatarUrl: null,
        },
      });
      render(<SpaceInfo space={space} />);

      // Rating is hardcoded as 4.8
      expect(screen.getByText("4.8")).toBeInTheDocument();
    });

    it("does not display owner section when owner is missing", () => {
      const space = createMockSpace({
        owner: undefined,
      });
      render(<SpaceInfo space={space} />);

      expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
    });
  });

  describe("Links", () => {
    it("generates correct View Space link", () => {
      const space = createMockSpace({
        id: "space-abc-123",
      });
      render(<SpaceInfo space={space} />);

      const viewSpaceLink = screen.getByText("View Space").closest("a");
      expect(viewSpaceLink).toHaveAttribute("href", "/spaces/space-abc-123");
    });

    it("generates Contact Owner link when bookingId is provided", () => {
      const space = createMockSpace();
      render(<SpaceInfo space={space} bookingId="booking-123" />);

      const contactLink = screen.getByText("Contact Owner").closest("a");
      expect(contactLink).toHaveAttribute(
        "href",
        "/app/(dashboard)/messages/booking-123"
      );
    });

    it("does not display Contact Owner button when bookingId is missing", () => {
      const space = createMockSpace();
      render(<SpaceInfo space={space} />);

      expect(screen.queryByText("Contact Owner")).not.toBeInTheDocument();
    });

    it("displays Contact Owner button when bookingId is provided", () => {
      const space = createMockSpace();
      render(<SpaceInfo space={space} bookingId="booking-456" />);

      expect(screen.getByText("Contact Owner")).toBeInTheDocument();
    });
  });

  describe("Icons", () => {
    it("renders MapPin icon for location", () => {
      const space = createMockSpace();
      render(<SpaceInfo space={space} />);

      // MapPin icon should be present (lucide-react icons render as SVGs)
      const locationSection = screen.getByText(/123 Main St/i).closest("div");
      expect(locationSection?.querySelector("svg")).toBeInTheDocument();
    });

    it("renders Ruler icon for dimensions", () => {
      const space = createMockSpace();
      render(<SpaceInfo space={space} />);

      // Ruler icon should be present
      const dimensionsSection = screen.getByText(/24×36/i).closest("div");
      expect(dimensionsSection?.querySelector("svg")).toBeInTheDocument();
    });

    it("renders Star icon for owner rating", () => {
      const space = createMockSpace({
        owner: {
          id: "owner-123",
          firstName: "John",
          lastName: "Doe",
          avatarUrl: null,
        },
      });
      render(<SpaceInfo space={space} />);

      // Star icon should be present
      const ratingSection = screen.getByText("4.8").closest("div");
      expect(ratingSection?.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles space with minimal data", () => {
      const space = createMockSpace({
        photos: undefined,
        location: undefined,
        width: undefined,
        height: undefined,
        dimensionUnit: undefined,
        spaceType: undefined,
        owner: undefined,
      });
      render(<SpaceInfo space={space} />);

      // Should still render title
      expect(
        screen.getByText("Coffee Shop Window Display")
      ).toBeInTheDocument();
      expect(screen.getByText("Location not available")).toBeInTheDocument();
      expect(screen.getByText("Dimensions not available")).toBeInTheDocument();
    });

    it("handles space with only title", () => {
      const space = {
        id: "space-123",
        title: "Minimal Space",
      };
      render(<SpaceInfo space={space as { id: string; title: string }} />);

      expect(screen.getByText("Minimal Space")).toBeInTheDocument();
      expect(screen.getByText("Location not available")).toBeInTheDocument();
      expect(screen.getByText("Dimensions not available")).toBeInTheDocument();
    });

    it("handles owner with missing lastName", () => {
      const space = createMockSpace({
        owner: {
          id: "owner-123",
          firstName: "John",
          lastName: "",
          avatarUrl: null,
        },
      });
      render(<SpaceInfo space={space} />);

      // Should handle gracefully
      expect(screen.getByText(/John/i)).toBeInTheDocument();
    });

    it("handles owner with missing firstName", () => {
      const space = createMockSpace({
        owner: {
          id: "owner-123",
          firstName: "",
          lastName: "Doe",
          avatarUrl: null,
        },
      });
      render(<SpaceInfo space={space} />);

      // Should handle gracefully
      expect(screen.getByText(/Doe/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has accessible links", () => {
      const space = createMockSpace();
      render(<SpaceInfo space={space} bookingId="booking-123" />);

      const viewSpaceLink = screen.getByRole("link", { name: /view space/i });
      expect(viewSpaceLink).toBeInTheDocument();

      const contactLink = screen.getByRole("link", { name: /contact owner/i });
      expect(contactLink).toBeInTheDocument();
    });

    it("has accessible image alt text", () => {
      const space = createMockSpace({
        photos: ["https://example.com/photo.jpg"],
      });
      render(<SpaceInfo space={space} />);

      const image = screen.getByAltText("Coffee Shop Window Display");
      expect(image).toBeInTheDocument();
    });

    it("has semantic heading for space title", () => {
      const space = createMockSpace();
      render(<SpaceInfo space={space} />);

      // Space title is rendered as h3
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent("Coffee Shop Window Display");
    });
  });

  describe("Complete Space Info", () => {
    it("renders complete space info with all elements", () => {
      const space = createMockSpace({
        id: "space-123",
        title: "Coffee Shop Window Display",
        photos: ["https://example.com/photo.jpg"],
        location: {
          address: "123 Main St",
          city: "Los Angeles",
          state: "CA",
        },
        width: 24,
        height: 36,
        dimensionUnit: "inches",
        spaceType: {
          name: "Window Poster",
        },
        owner: {
          id: "owner-123",
          firstName: "John",
          lastName: "Doe",
          avatarUrl: "https://example.com/avatar.jpg",
        },
      });
      render(<SpaceInfo space={space} bookingId="booking-123" />);

      // Verify all elements
      expect(screen.getByText("Space Information")).toBeInTheDocument();
      expect(
        screen.getByText("Coffee Shop Window Display")
      ).toBeInTheDocument();
      expect(
        screen.getByText("123 Main St, Los Angeles, CA")
      ).toBeInTheDocument();
      expect(screen.getByText("24×36 inches")).toBeInTheDocument();
      expect(screen.getByText("Window Poster")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("4.8")).toBeInTheDocument();
      expect(screen.getByText("View Space")).toBeInTheDocument();
      expect(screen.getByText("Contact Owner")).toBeInTheDocument();
    });
  });
});
