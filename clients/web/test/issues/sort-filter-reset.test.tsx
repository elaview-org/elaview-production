import { render, screen, userEvent } from "@/test/utils";
import ToolbarSortPanel from "@/components/composed/toolbar/sort-panel";
import ToolbarFiltersPanel from "@/components/composed/toolbar/filters-panel";
import { describe, it, expect, beforeEach, mock } from "bun:test";

const mockUpdate = mock();
const mockGet = mock();

mock.module("@/hooks/use-search-params-updater", () => ({
  useSearchParamsUpdater: () => ({
    get: mockGet,
    update: mockUpdate,
  }),
}));

describe("ToolbarSortPanel - Reset to default", () => {
  const sortProps = {
    sort: { fields: [{ value: "createdAt", label: "Date" }] },
    open: true,
  };

  beforeEach(() => {
    mockUpdate.mockClear();
    mockGet.mockReturnValue("createdAt:DESC");
  });

  it("does not commit to URL when Reset is clicked", async () => {
    const user = userEvent.setup();
    render(<ToolbarSortPanel {...sortProps} />);

    await user.click(screen.getByRole("button", { name: /reset to default/i }));

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("commits cleared sort on Apply after Reset", async () => {
    const user = userEvent.setup();
    render(<ToolbarSortPanel {...sortProps} />);

    await user.click(screen.getByRole("button", { name: /reset to default/i }));
    mockUpdate.mockClear();

    await user.click(screen.getByRole("button", { name: /apply/i }));

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ sort: null })
    );
  });
});

describe("ToolbarFiltersPanel - Clear filters", () => {
  const filterProps = {
    filters: [
      {
        key: "status",
        placeholder: "Status",
        fields: [
          { value: "ACTIVE", label: "Active" },
          { value: "INACTIVE", label: "Inactive" },
        ],
      },
    ],
    open: true,
  };

  beforeEach(() => {
    mockUpdate.mockClear();
    mockGet.mockReturnValue("status:ACTIVE");
  });

  it("does not commit to URL when Clear is clicked", async () => {
    const user = userEvent.setup();
    render(<ToolbarFiltersPanel {...filterProps} />);

    await user.click(screen.getByRole("button", { name: /clear filters/i }));

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("commits cleared filters on Apply after Clear", async () => {
    const user = userEvent.setup();
    render(<ToolbarFiltersPanel {...filterProps} />);

    await user.click(screen.getByRole("button", { name: /clear filters/i }));
    mockUpdate.mockClear();

    await user.click(screen.getByRole("button", { name: /apply/i }));

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ filter: null })
    );
  });
});
