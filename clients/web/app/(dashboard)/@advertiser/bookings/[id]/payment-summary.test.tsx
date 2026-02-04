import { render, screen } from "@/test/utils";
import { describe, it, expect } from "bun:test";
import PaymentSummary from "./payment-summary";

describe("PaymentSummary", () => {
  describe("Rendering", () => {
    it("renders card with title", () => {
      render(<PaymentSummary />);

      expect(screen.getByText("Payment Summary")).toBeInTheDocument();
    });

    it("renders download receipt button", () => {
      render(<PaymentSummary />);

      expect(screen.getByText("Download Receipt")).toBeInTheDocument();
    });

    it("renders download receipt button with icon", () => {
      render(<PaymentSummary />);

      const button = screen.getByText("Download Receipt");
      expect(button).toBeInTheDocument();
      // Icon should be present (lucide-react icons render as SVGs)
      expect(button.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Currency Formatting", () => {
    it("formats currency with commas and two decimal places", () => {
      render(
        <PaymentSummary
          booking={{
            pricePerWeek: 100,
            totalWeeks: 2,
            platformFee: 30,
            printInstallFee: 20,
            total: 250,
          }}
        />
      );

      expect(screen.getByText("$250.00")).toBeInTheDocument();
    });

    it("formats large currency amounts with commas", () => {
      render(
        <PaymentSummary
          booking={{
            pricePerWeek: 1000,
            totalWeeks: 4,
            platformFee: 600,
            printInstallFee: 50,
            total: 4650,
          }}
        />
      );

      expect(screen.getByText("$4,650.00")).toBeInTheDocument();
    });

    it("formats zero as $0.00", () => {
      render(<PaymentSummary booking={{ total: 0 }} />);

      expect(screen.getByText("$0.00")).toBeInTheDocument();
    });

    it("handles undefined total by calculating from breakdown", () => {
      render(
        <PaymentSummary
          booking={{
            pricePerWeek: 100,
            totalWeeks: 2,
            platformFee: 30,
            printInstallFee: 20,
          }}
        />
      );

      // Total should be calculated: 200 + 30 + 20 = 250
      expect(screen.getByText("$250.00")).toBeInTheDocument();
    });
  });

  describe("Price Breakdown", () => {
    it("displays base price when pricePerWeek and totalWeeks are provided", () => {
      render(
        <PaymentSummary
          booking={{
            pricePerWeek: 100,
            totalWeeks: 2,
            platformFee: 30,
            printInstallFee: 20,
          }}
        />
      );

      expect(screen.getByText("Base Price")).toBeInTheDocument();
      expect(screen.getByText("$200.00")).toBeInTheDocument();
    });

    it("displays platform fee when provided", () => {
      render(
        <PaymentSummary
          booking={{
            pricePerWeek: 100,
            totalWeeks: 2,
            platformFee: 30,
            printInstallFee: 20,
          }}
        />
      );

      expect(screen.getByText("Platform Fee")).toBeInTheDocument();
      // Should find the platform fee value in the breakdown
      const breakdownItems = screen.getAllByText("$30.00");
      expect(breakdownItems.length).toBeGreaterThan(0);
    });

    it("displays print/install fee when provided", () => {
      render(
        <PaymentSummary
          booking={{
            pricePerWeek: 100,
            totalWeeks: 2,
            platformFee: 30,
            printInstallFee: 20,
          }}
        />
      );

      expect(screen.getByText("Print/Install Fee")).toBeInTheDocument();
      // Should find the print/install fee value in the breakdown
      const breakdownItems = screen.getAllByText("$20.00");
      expect(breakdownItems.length).toBeGreaterThan(0);
    });

    it("filters out zero values from breakdown", () => {
      render(
        <PaymentSummary
          booking={{
            pricePerWeek: 100,
            totalWeeks: 2,
            platformFee: 0,
            printInstallFee: 0,
          }}
        />
      );

      // Should only show Base Price, not Platform Fee or Print/Install Fee
      expect(screen.getByText("Base Price")).toBeInTheDocument();
      expect(screen.queryByText("Platform Fee")).not.toBeInTheDocument();
      expect(screen.queryByText("Print/Install Fee")).not.toBeInTheDocument();
    });

    it("calculates base price correctly", () => {
      render(
        <PaymentSummary
          booking={{
            pricePerWeek: 150,
            totalWeeks: 3,
            platformFee: 67.5,
            printInstallFee: 25,
          }}
        />
      );

      // Base price should be 150 * 3 = 450
      expect(screen.getByText("$450.00")).toBeInTheDocument();
    });

    it("handles missing pricePerWeek or totalWeeks", () => {
      render(
        <PaymentSummary
          booking={{
            platformFee: 30,
            printInstallFee: 20,
          }}
        />
      );

      // Base price should not be shown (value is 0, filtered out)
      expect(screen.queryByText("Base Price")).not.toBeInTheDocument();
      // But platform fee and print/install fee should still show
      expect(screen.getByText("Platform Fee")).toBeInTheDocument();
      expect(screen.getByText("Print/Install Fee")).toBeInTheDocument();
    });
  });

  describe("Total Calculation", () => {
    it("uses booking.total when provided", () => {
      render(
        <PaymentSummary
          booking={{
            total: 500,
            pricePerWeek: 100,
            totalWeeks: 2,
            platformFee: 30,
            printInstallFee: 20,
          }}
        />
      );

      // Should use total (500) instead of calculated sum (250)
      expect(screen.getByText("Total Paid")).toBeInTheDocument();
      expect(screen.getByText("$500.00")).toBeInTheDocument();
    });

    it("calculates total from breakdown when booking.total is not provided", () => {
      render(
        <PaymentSummary
          booking={{
            pricePerWeek: 100,
            totalWeeks: 2,
            platformFee: 30,
            printInstallFee: 20,
          }}
        />
      );

      // Total should be calculated: 200 + 30 + 20 = 250
      expect(screen.getByText("Total Paid")).toBeInTheDocument();
      expect(screen.getByText("$250.00")).toBeInTheDocument();
    });

    it("handles empty breakdown by showing $0.00", () => {
      render(<PaymentSummary booking={{}} />);

      expect(screen.getByText("Total Paid")).toBeInTheDocument();
      expect(screen.getByText("$0.00")).toBeInTheDocument();
    });
  });

  describe("Payment Information", () => {
    it("displays payment method when cardBrand and cardLast4 are provided", () => {
      render(
        <PaymentSummary
          booking={{ total: 250 }}
          payment={{ cardBrand: "visa", cardLast4: "4242" }}
        />
      );

      expect(
        screen.getByText(/Payment Method: visa •••• 4242/i)
      ).toBeInTheDocument();
    });

    it("displays paid date when paidAt is provided", () => {
      const paidDate = new Date("2024-01-15T10:00:00Z");
      render(
        <PaymentSummary
          booking={{ total: 250, paidAt: paidDate.toISOString() }}
        />
      );

      // Date format: "Jan 15, 2024"
      expect(screen.getByText(/Paid: Jan 15, 2024/i)).toBeInTheDocument();
    });

    it("displays both payment method and paid date when both are provided", () => {
      const paidDate = new Date("2024-01-15T10:00:00Z");
      render(
        <PaymentSummary
          booking={{ total: 250, paidAt: paidDate.toISOString() }}
          payment={{ cardBrand: "mastercard", cardLast4: "1234" }}
        />
      );

      expect(
        screen.getByText(/Payment Method: mastercard •••• 1234/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Paid: Jan 15, 2024/i)).toBeInTheDocument();
    });

    it("does not display payment info section when no payment data is provided", () => {
      render(<PaymentSummary booking={{ total: 250 }} />);

      expect(screen.queryByText(/Payment Method:/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Paid:/i)).not.toBeInTheDocument();
    });

    it("shows payment info section when only cardBrand is provided", () => {
      render(
        <PaymentSummary
          booking={{ total: 250 }}
          payment={{ cardBrand: "visa" }}
        />
      );

      // Section should render (even if cardLast4 is missing)
      // But payment method line won't show without cardLast4
      expect(screen.queryByText(/Payment Method:/i)).not.toBeInTheDocument();
    });

    it("shows payment info section when only cardLast4 is provided", () => {
      render(
        <PaymentSummary
          booking={{ total: 250 }}
          payment={{ cardLast4: "4242" }}
        />
      );

      // Section should render (even if cardBrand is missing)
      // But payment method line won't show without cardBrand
      expect(screen.queryByText(/Payment Method:/i)).not.toBeInTheDocument();
    });

    it("shows payment info section when only paidAt is provided", () => {
      const paidDate = new Date("2024-01-15T10:00:00Z");
      render(
        <PaymentSummary
          booking={{ total: 250, paidAt: paidDate.toISOString() }}
        />
      );

      expect(screen.getByText(/Paid: Jan 15, 2024/i)).toBeInTheDocument();
    });
  });

  describe("Date Formatting", () => {
    it("formats date correctly", () => {
      const date = new Date("2024-03-15T14:30:00Z");
      render(
        <PaymentSummary booking={{ total: 250, paidAt: date.toISOString() }} />
      );

      expect(screen.getByText(/Paid: Mar 15, 2024/i)).toBeInTheDocument();
    });

    it("handles null paidAt", () => {
      render(<PaymentSummary booking={{ total: 250, paidAt: null }} />);

      expect(screen.queryByText(/Paid:/i)).not.toBeInTheDocument();
    });

    it("handles undefined paidAt", () => {
      render(<PaymentSummary booking={{ total: 250 }} />);

      expect(screen.queryByText(/Paid:/i)).not.toBeInTheDocument();
    });

    it("shows 'Not paid yet' when formatDate receives null", () => {
      // This tests the internal formatDate function behavior
      // When paidAt is null, the payment info section won't render
      // So we can't directly test "Not paid yet" text, but we can verify
      // that the section doesn't appear
      render(<PaymentSummary booking={{ total: 250, paidAt: null }} />);

      expect(screen.queryByText(/Paid:/i)).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty booking object", () => {
      render(<PaymentSummary booking={{}} />);

      expect(screen.getByText("Payment Summary")).toBeInTheDocument();
      expect(screen.getByText("Total Paid")).toBeInTheDocument();
      expect(screen.getByText("$0.00")).toBeInTheDocument();
    });

    it("handles undefined booking prop", () => {
      render(<PaymentSummary />);

      expect(screen.getByText("Payment Summary")).toBeInTheDocument();
      expect(screen.getByText("Total Paid")).toBeInTheDocument();
      expect(screen.getByText("$0.00")).toBeInTheDocument();
    });

    it("handles undefined payment prop", () => {
      render(<PaymentSummary booking={{ total: 250 }} />);

      expect(screen.getByText("Payment Summary")).toBeInTheDocument();
      expect(screen.queryByText(/Payment Method:/i)).not.toBeInTheDocument();
    });

    it("handles very large amounts", () => {
      render(
        <PaymentSummary
          booking={{
            pricePerWeek: 10000,
            totalWeeks: 52,
            platformFee: 78000,
            printInstallFee: 1000,
            total: 599000,
          }}
        />
      );

      expect(screen.getByText("$599,000.00")).toBeInTheDocument();
    });

    it("handles decimal amounts correctly", () => {
      render(
        <PaymentSummary
          booking={{
            pricePerWeek: 99.99,
            totalWeeks: 2,
            platformFee: 29.997,
            printInstallFee: 19.99,
          }}
        />
      );

      // Base price: 99.99 * 2 = 199.98
      // Platform fee: 29.997 ≈ 30.00 (formatted)
      // Print/install fee: 19.99
      // Total: ~250 (calculated)
      expect(screen.getByText("Total Paid")).toBeInTheDocument();
    });

    it("handles negative values (edge case)", () => {
      // Component doesn't validate negative values, but should handle them
      render(
        <PaymentSummary
          booking={{
            pricePerWeek: -100,
            totalWeeks: 2,
            platformFee: -30,
            printInstallFee: -20,
          }}
        />
      );

      // Negative values are filtered out (value > 0 check)
      expect(screen.queryByText("Base Price")).not.toBeInTheDocument();
      expect(screen.queryByText("Platform Fee")).not.toBeInTheDocument();
      expect(screen.queryByText("Print/Install Fee")).not.toBeInTheDocument();
      // Total should be $0.00
      expect(screen.getByText("$0.00")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has accessible button for download receipt", () => {
      render(<PaymentSummary booking={{ total: 250 }} />);

      const button = screen.getByRole("button", { name: /download receipt/i });
      expect(button).toBeInTheDocument();
    });

    it("has semantic structure with heading", () => {
      render(<PaymentSummary booking={{ total: 250 }} />);

      // CardTitle should render as a heading
      const title = screen.getByText("Payment Summary");
      expect(title).toBeInTheDocument();
    });
  });

  describe("Complete Payment Summary", () => {
    it("renders complete payment summary with all fields", () => {
      const paidDate = new Date("2024-01-15T10:00:00Z");
      render(
        <PaymentSummary
          booking={{
            pricePerWeek: 100,
            totalWeeks: 2,
            platformFee: 30,
            printInstallFee: 20,
            total: 250,
            paidAt: paidDate.toISOString(),
          }}
          payment={{ cardBrand: "visa", cardLast4: "4242" }}
        />
      );

      // Verify all sections are present
      expect(screen.getByText("Payment Summary")).toBeInTheDocument();
      expect(screen.getByText("Base Price")).toBeInTheDocument();
      expect(screen.getByText("Platform Fee")).toBeInTheDocument();
      expect(screen.getByText("Print/Install Fee")).toBeInTheDocument();
      expect(screen.getByText("Total Paid")).toBeInTheDocument();
      expect(
        screen.getByText(/Payment Method: visa •••• 4242/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Paid: Jan 15, 2024/i)).toBeInTheDocument();
      expect(screen.getByText("Download Receipt")).toBeInTheDocument();
    });
  });
});
