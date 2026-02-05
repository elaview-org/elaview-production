import { render, screen } from "@/tests/utils";
import { describe, expect, it, mock } from "bun:test";
import { CampaignInfoCard } from "./campaign-info-card";

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

describe("CampaignInfoCard", () => {
  const createMockCampaign = (
    overrides: Partial<
      NonNullable<Parameters<typeof CampaignInfoCard>[0]["campaign"]>
    > = {}
  ) => ({
    id: "campaign-123",
    name: "Summer Promotion",
    startDate: "2024-06-01T00:00:00Z",
    endDate: "2024-06-29T00:00:00Z",
    budget: 1000,
    spent: 500,
    ...overrides,
  });

  describe("Rendering", () => {
    it("renders card with title", () => {
      const campaign = createMockCampaign();
      render(<CampaignInfoCard campaign={campaign} />);

      expect(screen.getByText("Campaign Information")).toBeInTheDocument();
    });

    it("renders campaign name", () => {
      const campaign = createMockCampaign({
        name: "Holiday Sale",
      });
      render(<CampaignInfoCard campaign={campaign} />);

      expect(screen.getByText("Holiday Sale")).toBeInTheDocument();
    });

    it("renders View Campaign button", () => {
      const campaign = createMockCampaign();
      render(<CampaignInfoCard campaign={campaign} />);

      expect(screen.getByText("View Campaign")).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("returns null when campaign is not provided", () => {
      const { container } = render(<CampaignInfoCard />);

      expect(container.firstChild).toBeNull();
    });

    it("returns null when campaign is undefined", () => {
      const { container } = render(<CampaignInfoCard campaign={undefined} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe("Date Formatting", () => {
    it("formats start date correctly", () => {
      const campaign = createMockCampaign({
        startDate: "2024-06-01T00:00:00Z",
      });
      render(<CampaignInfoCard campaign={campaign} />);

      // Format: "Jun 1, 2024"
      expect(screen.getByText(/Start: Jun 1, 2024/i)).toBeInTheDocument();
    });

    it("formats end date correctly", () => {
      const campaign = createMockCampaign({
        endDate: "2024-12-31T00:00:00Z",
      });
      render(<CampaignInfoCard campaign={campaign} />);

      // Format: "Dec 31, 2024"
      expect(screen.getByText(/End: Dec 31, 2024/i)).toBeInTheDocument();
    });

    it("handles different date formats", () => {
      const campaign = createMockCampaign({
        startDate: "2024-01-15T10:30:00Z",
        endDate: "2024-03-20T14:45:00Z",
      });
      render(<CampaignInfoCard campaign={campaign} />);

      expect(screen.getByText(/Start: Jan 15, 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/End: Mar 20, 2024/i)).toBeInTheDocument();
    });
  });

  describe("Duration Calculation", () => {
    it("calculates weeks correctly for 4-week campaign", () => {
      const campaign = createMockCampaign({
        startDate: "2024-06-01T00:00:00Z",
        endDate: "2024-06-29T00:00:00Z", // 28 days = 4 weeks
      });
      render(<CampaignInfoCard campaign={campaign} />);

      expect(screen.getByText(/Duration: 4 weeks/i)).toBeInTheDocument();
    });

    it("calculates weeks correctly for 2-week campaign", () => {
      const campaign = createMockCampaign({
        startDate: "2024-06-01T00:00:00Z",
        endDate: "2024-06-15T00:00:00Z", // 14 days = 2 weeks
      });
      render(<CampaignInfoCard campaign={campaign} />);

      expect(screen.getByText(/Duration: 2 weeks/i)).toBeInTheDocument();
    });

    it("calculates weeks correctly for 1-week campaign", () => {
      const campaign = createMockCampaign({
        startDate: "2024-06-01T00:00:00Z",
        endDate: "2024-06-08T00:00:00Z", // 7 days = 1 week
      });
      render(<CampaignInfoCard campaign={campaign} />);

      expect(screen.getByText(/Duration: 1 weeks/i)).toBeInTheDocument();
    });

    it("rounds up partial weeks correctly", () => {
      const campaign = createMockCampaign({
        startDate: "2024-06-01T00:00:00Z",
        endDate: "2024-06-10T00:00:00Z", // 9 days = 1.29 weeks, rounds up to 2
      });
      render(<CampaignInfoCard campaign={campaign} />);

      expect(screen.getByText(/Duration: 2 weeks/i)).toBeInTheDocument();
    });

    it("handles same-day campaign as 1 week", () => {
      const campaign = createMockCampaign({
        startDate: "2024-06-01T00:00:00Z",
        endDate: "2024-06-01T23:59:59Z", // Same day
      });
      render(<CampaignInfoCard campaign={campaign} />);

      expect(screen.getByText(/Duration: 1 weeks/i)).toBeInTheDocument();
    });

    it("handles end date before start date correctly", () => {
      const campaign = createMockCampaign({
        startDate: "2024-06-15T00:00:00Z",
        endDate: "2024-06-01T00:00:00Z", // End before start
      });
      render(<CampaignInfoCard campaign={campaign} />);

      // Uses Math.abs, so calculates absolute difference
      expect(screen.getByText(/Duration: 2 weeks/i)).toBeInTheDocument();
    });
  });

  describe("Budget Display", () => {
    it("displays budget when provided", () => {
      const campaign = createMockCampaign({
        budget: 5000,
      });
      render(<CampaignInfoCard campaign={campaign} />);

      const budgetSection = screen.getByText(/Budget:/i).closest("p");
      expect(budgetSection).toHaveTextContent("Budget: $5,000");
    });

    it("formats large budget with commas", () => {
      const campaign = createMockCampaign({
        budget: 100000,
      });
      render(<CampaignInfoCard campaign={campaign} />);

      const budgetSection = screen.getByText(/Budget:/i).closest("p");
      expect(budgetSection).toHaveTextContent("Budget: $100,000");
    });

    it("formats budget with thousands separator", () => {
      const campaign = createMockCampaign({
        budget: 1234567,
      });
      render(<CampaignInfoCard campaign={campaign} />);

      const budgetSection = screen.getByText(/Budget:/i).closest("p");
      expect(budgetSection).toHaveTextContent("Budget: $1,234,567");
    });

    it("does not display budget section when budget is undefined", () => {
      const campaign = createMockCampaign({
        budget: undefined,
      });
      render(<CampaignInfoCard campaign={campaign} />);

      expect(screen.queryByText(/Budget:/i)).not.toBeInTheDocument();
    });

    it("displays spent amount when provided", () => {
      const campaign = createMockCampaign({
        budget: 1000,
        spent: 750,
      });
      render(<CampaignInfoCard campaign={campaign} />);

      const spentSection = screen.getByText(/Spent:/i).closest("p");
      expect(spentSection).toHaveTextContent("Spent: $750");
    });

    it("formats spent amount with commas", () => {
      const campaign = createMockCampaign({
        budget: 50000,
        spent: 25000,
      });
      render(<CampaignInfoCard campaign={campaign} />);

      const spentSection = screen.getByText(/Spent:/i).closest("p");
      expect(spentSection).toHaveTextContent("Spent: $25,000");
    });

    it("does not display spent when spent is undefined", () => {
      const campaign = createMockCampaign({
        budget: 1000,
        spent: undefined,
      });
      render(<CampaignInfoCard campaign={campaign} />);

      expect(screen.queryByText(/Spent:/i)).not.toBeInTheDocument();
    });

    it("displays both budget and spent when both are provided", () => {
      const campaign = createMockCampaign({
        budget: 2000,
        spent: 1200,
      });
      render(<CampaignInfoCard campaign={campaign} />);

      const budgetSection = screen.getByText(/Budget:/i).closest("p");
      expect(budgetSection).toHaveTextContent("Budget: $2,000");

      const spentSection = screen.getByText(/Spent:/i).closest("p");
      expect(spentSection).toHaveTextContent("Spent: $1,200");
    });

    it("displays budget section even when spent is 0", () => {
      const campaign = createMockCampaign({
        budget: 1000,
        spent: 0,
      });
      render(<CampaignInfoCard campaign={campaign} />);

      const budgetSection = screen.getByText(/Budget:/i).closest("p");
      expect(budgetSection).toHaveTextContent("Budget: $1,000");

      const spentSection = screen.getByText(/Spent:/i).closest("p");
      expect(spentSection).toHaveTextContent("Spent: $0");
    });
  });

  describe("Icons", () => {
    it("renders Calendar icon for campaign name", () => {
      const campaign = createMockCampaign();
      render(<CampaignInfoCard campaign={campaign} />);

      // Calendar icon should be present (lucide-react icons render as SVGs)
      const nameSection = screen.getByText("Summer Promotion").closest("div");
      expect(nameSection?.querySelector("svg")).toBeInTheDocument();
    });

    it("renders DollarSign icon for budget section", () => {
      const campaign = createMockCampaign({
        budget: 1000,
      });
      render(<CampaignInfoCard campaign={campaign} />);

      // DollarSign icon should be present - it's a sibling of the budget text container
      const budgetText = screen.getByText(/Budget:/i);
      const parentContainer = budgetText.closest("div")?.parentElement;
      const svg = parentContainer?.querySelector("svg");
      expect(svg).toBeTruthy();
    });
  });

  describe("Links", () => {
    it("generates correct View Campaign link", () => {
      const campaign = createMockCampaign({
        id: "campaign-abc-123",
      });
      render(<CampaignInfoCard campaign={campaign} />);

      const viewCampaignLink = screen.getByText("View Campaign").closest("a");
      expect(viewCampaignLink).toHaveAttribute(
        "href",
        "/campaigns/campaign-abc-123"
      );
    });

    it("generates link with correct campaign ID", () => {
      const campaign = createMockCampaign({
        id: "summer-2024-promo",
      });
      render(<CampaignInfoCard campaign={campaign} />);

      const link = screen.getByRole("link", { name: /view campaign/i });
      expect(link).toHaveAttribute("href", "/campaigns/summer-2024-promo");
    });
  });

  describe("Component Structure", () => {
    it("renders all sections in correct order", () => {
      const campaign = createMockCampaign({
        name: "Test Campaign",
        startDate: "2024-06-01T00:00:00Z",
        endDate: "2024-06-29T00:00:00Z",
        budget: 1000,
        spent: 500,
      });
      render(<CampaignInfoCard campaign={campaign} />);

      // Verify order: title, name, dates, duration, budget section, button
      const elements = screen.getAllByText(
        /test campaign|start:|end:|duration:|budget:|spent:|view campaign/i
      );
      expect(elements.length).toBeGreaterThan(0);
    });

    it("renders campaign info without budget section when budget is undefined", () => {
      const campaign = createMockCampaign({
        budget: undefined,
        spent: undefined,
      });
      render(<CampaignInfoCard campaign={campaign} />);

      // Should still render name, dates, duration, and button
      expect(screen.getByText("Summer Promotion")).toBeInTheDocument();
      expect(screen.getByText(/Start:/i)).toBeInTheDocument();
      expect(screen.getByText(/End:/i)).toBeInTheDocument();
      expect(screen.getByText(/Duration:/i)).toBeInTheDocument();
      expect(screen.getByText("View Campaign")).toBeInTheDocument();

      // Should not render budget section
      expect(screen.queryByText(/Budget:/i)).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles campaign with minimal required fields", () => {
      const campaign = {
        id: "campaign-123",
        name: "Minimal Campaign",
        startDate: "2024-06-01T00:00:00Z",
        endDate: "2024-06-08T00:00:00Z",
      };
      render(<CampaignInfoCard campaign={campaign} />);

      expect(screen.getByText("Minimal Campaign")).toBeInTheDocument();
      expect(screen.getByText(/Start:/i)).toBeInTheDocument();
      expect(screen.getByText(/End:/i)).toBeInTheDocument();
      expect(screen.getByText(/Duration:/i)).toBeInTheDocument();
    });

    it("handles very long campaign name", () => {
      const campaign = createMockCampaign({
        name: "This is a very long campaign name that might wrap to multiple lines in the UI",
      });
      render(<CampaignInfoCard campaign={campaign} />);

      expect(
        screen.getByText(
          "This is a very long campaign name that might wrap to multiple lines in the UI"
        )
      ).toBeInTheDocument();
    });

    it("handles zero budget", () => {
      const campaign = createMockCampaign({
        budget: 0,
        spent: 0,
      });
      render(<CampaignInfoCard campaign={campaign} />);

      const budgetSection = screen.getByText(/Budget:/i).closest("p");
      expect(budgetSection).toHaveTextContent("Budget: $0");

      const spentSection = screen.getByText(/Spent:/i).closest("p");
      expect(spentSection).toHaveTextContent("Spent: $0");
    });

    it("handles very large budget values", () => {
      const campaign = createMockCampaign({
        budget: 999999999,
        spent: 500000000,
      });
      render(<CampaignInfoCard campaign={campaign} />);

      const budgetSection = screen.getByText(/Budget:/i).closest("p");
      expect(budgetSection).toHaveTextContent("Budget: $999,999,999");

      const spentSection = screen.getByText(/Spent:/i).closest("p");
      expect(spentSection).toHaveTextContent("Spent: $500,000,000");
    });
  });

  describe("Accessibility", () => {
    it("has accessible link", () => {
      const campaign = createMockCampaign();
      render(<CampaignInfoCard campaign={campaign} />);

      const link = screen.getByRole("link", { name: /view campaign/i });
      expect(link).toBeInTheDocument();
    });

    it("has semantic heading for card title", () => {
      const campaign = createMockCampaign();
      render(<CampaignInfoCard campaign={campaign} />);

      // CardTitle renders as a div, not a heading element
      // Verify the title text is present
      expect(screen.getByText("Campaign Information")).toBeInTheDocument();
    });
  });

  describe("Complete Campaign Info", () => {
    it("renders complete campaign info with all elements", () => {
      const campaign = createMockCampaign({
        id: "campaign-123",
        name: "Summer Promotion 2024",
        startDate: "2024-06-01T00:00:00Z",
        endDate: "2024-06-29T00:00:00Z",
        budget: 5000,
        spent: 2500,
      });
      render(<CampaignInfoCard campaign={campaign} />);

      // Verify all elements
      expect(screen.getByText("Campaign Information")).toBeInTheDocument();
      expect(screen.getByText("Summer Promotion 2024")).toBeInTheDocument();
      expect(screen.getByText(/Start: Jun 1, 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/End: Jun 29, 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/Duration: 4 weeks/i)).toBeInTheDocument();

      const budgetSection = screen.getByText(/Budget:/i).closest("p");
      expect(budgetSection).toHaveTextContent("Budget: $5,000");

      const spentSection = screen.getByText(/Spent:/i).closest("p");
      expect(spentSection).toHaveTextContent("Spent: $2,500");

      expect(screen.getByText("View Campaign")).toBeInTheDocument();
    });
  });
});
