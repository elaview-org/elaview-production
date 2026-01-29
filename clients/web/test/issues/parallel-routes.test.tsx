import { render, screen } from "@/test/utils";
import RoleBasedView from "@/app/(dashboard)/role-based-view";

vi.mock("@/types/gql", () => ({
  UserRole: { Admin: "ADMIN", Marketing: "MARKETING", User: "USER" },
  ProfileType: { Advertiser: "ADVERTISER", SpaceOwner: "SPACE_OWNER" },
  getFragmentData: (_doc: unknown, data: unknown) => data,
  graphql: () => ({}),
}));

const slots = {
  admin: <div data-testid="admin-slot">Admin</div>,
  marketing: <div data-testid="marketing-slot">Marketing</div>,
  spaceOwner: <div data-testid="space-owner-slot">Space Owner</div>,
  advertiser: <div data-testid="advertiser-slot">Advertiser</div>,
};

describe("RoleBasedView (parallel routes mitigation)", () => {
  it("renders only admin slot for Admin role", () => {
    render(
      <RoleBasedView
        data={{ role: "ADMIN", activeProfileType: "SPACE_OWNER" } as never}
        {...slots}
      />
    );

    expect(screen.getByTestId("admin-slot")).toBeInTheDocument();
    expect(screen.queryByTestId("marketing-slot")).not.toBeInTheDocument();
    expect(screen.queryByTestId("space-owner-slot")).not.toBeInTheDocument();
    expect(screen.queryByTestId("advertiser-slot")).not.toBeInTheDocument();
  });

  it("renders only marketing slot for Marketing role", () => {
    render(
      <RoleBasedView
        data={{ role: "MARKETING", activeProfileType: "SPACE_OWNER" } as never}
        {...slots}
      />
    );

    expect(screen.getByTestId("marketing-slot")).toBeInTheDocument();
    expect(screen.queryByTestId("admin-slot")).not.toBeInTheDocument();
    expect(screen.queryByTestId("space-owner-slot")).not.toBeInTheDocument();
    expect(screen.queryByTestId("advertiser-slot")).not.toBeInTheDocument();
  });

  it("renders only space owner slot for User + SpaceOwner", () => {
    render(
      <RoleBasedView
        data={{ role: "USER", activeProfileType: "SPACE_OWNER" } as never}
        {...slots}
      />
    );

    expect(screen.getByTestId("space-owner-slot")).toBeInTheDocument();
    expect(screen.queryByTestId("admin-slot")).not.toBeInTheDocument();
    expect(screen.queryByTestId("marketing-slot")).not.toBeInTheDocument();
    expect(screen.queryByTestId("advertiser-slot")).not.toBeInTheDocument();
  });

  it("renders only advertiser slot for User + Advertiser", () => {
    render(
      <RoleBasedView
        data={{ role: "USER", activeProfileType: "ADVERTISER" } as never}
        {...slots}
      />
    );

    expect(screen.getByTestId("advertiser-slot")).toBeInTheDocument();
    expect(screen.queryByTestId("admin-slot")).not.toBeInTheDocument();
    expect(screen.queryByTestId("marketing-slot")).not.toBeInTheDocument();
    expect(screen.queryByTestId("space-owner-slot")).not.toBeInTheDocument();
  });
});
