import { render, screen, userEvent } from "@/test/utils";
import ToolbarSortPanel from "@/components/composed/toolbar/sort-panel";

const mockUpdate = vi.fn();
const mockGet = vi.fn<(key: string) => string | null>();

vi.mock("@/hooks/use-search-params-updater", () => ({
  useSearchParamsUpdater: () => ({
    get: mockGet,
    update: mockUpdate,
  }),
}));

describe("ToolbarSortPanel - Duplicate field selection", () => {
  const fields = [
    { value: "createdAt", label: "Date" },
    { value: "price", label: "Price" },
    { value: "name", label: "Name" },
  ];

  beforeEach(() => {
    mockUpdate.mockClear();
    mockGet.mockReturnValue("createdAt:DESC");
  });

  it("excludes primary field from secondary sort options", async () => {
    const user = userEvent.setup();
    render(<ToolbarSortPanel sort={{ fields }} open={true} />);

    const triggers = screen.getAllByRole("combobox");
    await user.click(triggers[2]);

    expect(screen.getByRole("listbox")).toBeInTheDocument();

    expect(
      screen.queryByRole("option", { name: "Date" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Price" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Name" })).toBeInTheDocument();
  });
});
