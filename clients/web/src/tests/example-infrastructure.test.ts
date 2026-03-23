/**
 * Example component test demonstrating test infrastructure usage.
 * This template shows how to use factories, renderWithProviders, and GraphQL mocks.
 */

import { describe, expect, it } from "bun:test";
import {
  createMockUser,
  createMockSpace,
  createMockNotification,
} from "@/tests/utils";
import { UserRole, SpaceStatus, SpaceType, NotificationType } from "@/types/gql/graphql";

describe("Example: Test Infrastructure Usage", () => {
  it("demonstrates factory usage with partial overrides", () => {
    // Create a mock user with default values
    const user = createMockUser();
    expect(user.id).toBeDefined();
    expect(user.role).toBe(UserRole.User);

    // Create a mock user with specific overrides
    const admin = createMockUser({
      role: UserRole.Admin,
      name: "Admin User",
    });
    expect(admin.role).toBe(UserRole.Admin);
    expect(admin.name).toBe("Admin User");
    expect(admin.id).toBeDefined(); // Still has default id
  });

  it("demonstrates space factory with variations", () => {
    // Create a default space
    const space = createMockSpace();
    expect(space.status).toBe(SpaceStatus.Active);
    expect(space.type).toBe(SpaceType.Storefront);
    expect(space.images.length).toBeGreaterThan(0);

    // Create an inactive space
    const inactive = createMockSpace({
      status: SpaceStatus.Inactive,
    });
    expect(inactive.status).toBe(SpaceStatus.Inactive);
    expect(inactive.title).toBeDefined(); // Title still generated
  });

  it("demonstrates notification factory", () => {
    const notification = createMockNotification({
      type: NotificationType.BookingApproved,
      isRead: false,
    });
    expect(notification.type).toBe(NotificationType.BookingApproved);
    expect(notification.isRead).toBe(false);
    expect(notification.createdAt).toBeDefined();
  });

  it("shows typical render pattern (without providers)", () => {
    // For tests that don't need providers (e.g., pure components):
    // render(<MyComponent />);

    // For tests that need providers:
    // renderWithProviders(<MyComponent />, {
    //   userValue: createMockUser(),
    //   mocks: [
    //     createMockQueryResponse({
    //       query: GET_USERS,
    //       data: { users: [createMockUser(), createMockUser()] }
    //     })
    //   ]
    // });
  });
});
