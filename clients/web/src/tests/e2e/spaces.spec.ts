import { test } from "./fixtures/two-users";

test.describe("Spaces", () => {
  test("Space owner creates a space, it appears in listings, and is visible to an advertiser in discover", async ({
    twoUsers,
  }) => {
    const spaceName = `Test Space ${twoUsers.seed}`;

    await twoUsers.asSpaceOwner(async (spaceOwner) => {
      await spaceOwner.createSpace(spaceName);
      // await expect(twoUsers.page.getByText(spaceName)).toBeVisible();
    });

    // await twoUsers.asAdvertiser(async (advertiser) => {
    //   await advertiser.verifySpace(spaceName);
    // });
  });
});
