import { render, type RenderOptions } from "@testing-library/react";
import { useSearchParams, usePathname } from "next/navigation";
import type { ReadonlyURLSearchParams } from "next/navigation";
import type { ReactElement } from "react";

type NavigationOptions = {
  searchParams?: URLSearchParams | Record<string, string>;
  pathname?: string;
};

function customRender(
  ui: ReactElement,
  options?: RenderOptions & { navigation?: NavigationOptions }
) {
  if (options?.navigation) {
    const { searchParams, pathname } = options.navigation;
    if (searchParams) {
      const params =
        searchParams instanceof URLSearchParams
          ? searchParams
          : new URLSearchParams(searchParams);
      vi.mocked(useSearchParams).mockReturnValue(
        params as unknown as ReadonlyURLSearchParams
      );
    }
    if (pathname) {
      vi.mocked(usePathname).mockReturnValue(pathname);
    }
  }

  const renderOptions = { ...options };
  if (renderOptions.navigation)
    delete (renderOptions as Record<string, unknown>).navigation;
  return render(ui, renderOptions);
}

export { customRender as render };
export { screen, within, waitFor, act } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
