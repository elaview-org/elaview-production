import { apiUrl, authCookieName, graphqlUrl } from "./constants";

export async function loginViaApi({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string> {
  const res = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(`Login failed for ${email}: ${res.status}`);
  }

  const setCookie = res.headers.getSetCookie();
  const authCookie = setCookie
    .find((c) => c.startsWith(`${authCookieName}=`))
    ?.split(";")[0]
    ?.split("=")
    .slice(1)
    .join("=");

  if (!authCookie) {
    throw new Error(`No auth cookie returned for ${email}`);
  }

  return authCookie;
}

export async function graphqlMutation(
  authCookie: string,
  query: string,
  variables: Record<string, unknown> = {}
): Promise<unknown> {
  const res = await fetch(graphqlUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${authCookieName}=${authCookie}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  return res.json();
}
