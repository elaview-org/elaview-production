import { test } from "./fixtures/two-users";

test.describe("Spaces", () => {
  test("Create, verify and delete spaces", async ({ twoUsers }) => {
    await twoUsers.asSpaceOwner(async (spaceOwner) => {
      await spaceOwner.createSpace();
    });

    await twoUsers.asAdvertiser(async (advertiser) => {
      await advertiser.verifySpace("");
    });
  });
});
