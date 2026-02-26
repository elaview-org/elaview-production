import { expect, test as base } from "./base";
import { Page } from "@playwright/test";

type Fixtures = {
  twoUsers: TwoUsers;
};

export const test = base.extend<Fixtures>({
  twoUsers: async ({ page, seed }, use) => {
    const twoUsers = new TwoUsers(page, seed, {
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
    await twoUsers.init();
    await use(twoUsers);
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
  ) {}

  public async logout() {
    await this.page.goto("/logout");
    await this.page.waitForURL("/login");
  }

  public async login() {
    await this.logout();
    await this.page.getByLabel("Email").fill(this.credentials.email);
    await this.page
      .getByLabel("Password", { exact: true })
      .fill(this.credentials.password);
    await this.page.getByRole("button", { name: "Login", exact: true }).click();
    await this.page.waitForURL("/overview");
  }

  public async signup() {
    await this.logout();
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
    await this.page.waitForURL("/overview");
  }

  protected async switchToProfile(targetLabel: "Advertiser" | "Space Owner") {
    await this.page
      .getByRole("button")
      .filter({ hasText: this.credentials.email })
      .click();
    const switchItem = this.page.getByRole("menuitem", {
      name: `Switch to ${targetLabel}`,
    });
    if (await switchItem.isVisible()) {
      await switchItem.click();
      await this.page.waitForURL("/overview");
    } else {
      await this.page.keyboard.press("Escape");
    }
  }
}

type UserActions<T> = Omit<T, "login" | "logout" | "signup" | "ensureProfile">;

class Advertiser extends User {
  constructor(page: Page, credentials: Credentials) {
    super(page, credentials);
  }

  public async ensureProfile() {
    await this.switchToProfile("Advertiser");
  }

  public async verifySpace(name: string) {
    await this.page.goto("/discover");
    await this.page.getByPlaceholder("Search spaces...").fill(name);
    await this.page.waitForLoadState("networkidle");
    await expect(this.page.getByText(name)).toBeVisible();
  }
}

class SpaceOwner extends User {
  constructor(page: Page, credentials: Credentials) {
    super(page, credentials);
  }

  public async ensureProfile() {
    await this.switchToProfile("Space Owner");
  }

  public async createSpace(name: string) {
    await this.page.goto("/listings");
    await this.page.getByRole("button", { name: "New Space" }).click();
    await this.page
      .getByPlaceholder("e.g., Downtown Coffee Shop Window")
      .fill(name);
  }
}

class TwoUsers {
  private currentUser: "advertiser" | "spaceOwner" | null = null;
  private readonly advertiser: Advertiser;
  private readonly spaceOwner: SpaceOwner;

  constructor(
    public readonly page: Page,
    public readonly seed: string,
    credentials: {
      advertiser: Credentials;
      spaceOwner: Credentials;
    }
  ) {
    this.advertiser = new Advertiser(page, credentials.advertiser);
    this.spaceOwner = new SpaceOwner(page, credentials.spaceOwner);
  }

  public async init() {
    await this.spaceOwner.signup();
    await this.advertiser.signup();
  }

  public async asAdvertiser(
    action: (advertiser: UserActions<Advertiser>) => Promise<void>
  ) {
    if (this.currentUser !== "advertiser") {
      await this.advertiser.login();
      this.currentUser = "advertiser";
    }
    await this.advertiser.ensureProfile();
    await action(this.advertiser);
  }

  public async asSpaceOwner(
    action: (spaceOwner: UserActions<SpaceOwner>) => Promise<void>
  ) {
    if (this.currentUser !== "spaceOwner") {
      await this.spaceOwner.login();
      this.currentUser = "spaceOwner";
    }
    await this.spaceOwner.ensureProfile();
    await action(this.spaceOwner);
  }
}
