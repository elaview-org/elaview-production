import "./globals.css";
import { ApolloWrapper } from "@/shared/api/gql/client";

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Elaview",
  description: "Elaview",
};

export default function RootLayout(props: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{metadata.title as string}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
        >
          <ApolloWrapper>{props.children}</ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
