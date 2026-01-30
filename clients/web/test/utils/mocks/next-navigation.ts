import { mock } from "bun:test";

export const useRouter = mock(() => ({
  push: mock(),
  replace: mock(),
  back: mock(),
  forward: mock(),
  refresh: mock(),
  prefetch: mock(),
}));

export const useSearchParams = mock(() => new URLSearchParams());

export const usePathname = mock(() => "/");

export const useParams = mock(() => ({}));

export const redirect = mock();

export const notFound = mock();
