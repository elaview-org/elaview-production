import { expect, test as base } from "./base";
import { Page } from "@playwright/test";

type Fixtures = {
  twoUsers: TwoUsers;
};

export const test = base.extend<Fixtures>({
  twoUsers: async ({ page, seed }, use) => {
    const twoUsers = new TwoUsers(page, {
      advertiser: {
        name: `Advertiser ${seed}`,
        email: `e2e_advertiser_${seed}@elaview.test.local`,
        password: seed,
      },
      spaceOwner: {
        name: `SpaceOwner ${seed}`,
        email: `e2e_spaceOwner_${seed}@elaview.test.local`,
        password: seed,
      },
    });
    await use(twoUsers);
    // todo: delete accounts
  },
});

export { expect };

export type Credentials = {
  name: string;
  email: string;
  password: string;
};

class User {
  constructor(
    public readonly page: Page,
    protected readonly credentials: Credentials
  ) {
    this.signup().catch(console.error);
  }

  public async login() {
    await this.page.goto("/logout");
    await this.page.getByLabel("Email").fill(this.credentials.email);
    await this.page
      .getByLabel("Password", { exact: true })
      .fill(this.credentials.password);
    await this.page.getByRole("button", { name: "Login" }).click();
  }

  protected async signup() {
    await this.page.goto("/");
    await this.page.getByRole("link", { name: "Sign Up", exact: true }).click();
    await this.page.getByLabel("Full Name").fill(this.credentials.name);
    await this.page.getByLabel("Email").fill(this.credentials.email);
    await this.page
      .getByLabel("Password", { exact: true })
      .fill(this.credentials.password);
    await this.page
      .getByLabel("Confirm Password", { exact: true })
      .fill(this.credentials.password);
    await this.page.getByRole("button", { name: "Create Account" }).click();
  }
}

class Advertiser extends User {
  constructor(page: Page, credentials: Credentials) {
    super(page, credentials);
  }

  public async verifySpace(name: string) {
    await this.page.goto("/discover");
  }
}

class SpaceOwner extends User {
  constructor(page: Page, credentials: Credentials) {
    super(page, credentials);
  }

  public async createSpace() {
    await this.page.goto("/listings");
  }
}

class TwoUsers {
  private currentUser: "advertiser" | "spaceOwner" = "spaceOwner";
  private readonly advertiser: Advertiser;
  private readonly spaceOwner: SpaceOwner;

  constructor(
    public readonly page: Page,
    credentials: {
      advertiser: Credentials;
      spaceOwner: Credentials;
    }
  ) {
    this.advertiser = new Advertiser(page, credentials.advertiser);
    this.spaceOwner = new SpaceOwner(page, credentials.spaceOwner);
  }

  public async asAdvertiser(action: (advertiser: Advertiser) => Promise<void>) {
    if (this.currentUser !== "advertiser") {
      await this.advertiser.login();
    }
    await action(this.advertiser);
  }

  public async asSpaceOwner(action: (spaceOwner: SpaceOwner) => Promise<void>) {
    if (this.currentUser !== "spaceOwner") {
      await this.spaceOwner.login();
    }
    await action(this.spaceOwner);
  }
}
