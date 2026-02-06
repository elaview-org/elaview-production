import "./global.css";
import { ApolloWrapper } from "@/lib/gql/client";

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/primitives/sonner";
import storage from "@/lib/storage";
import { inter } from "@/lib/fonts";
export const metadata: Metadata = {
  title: "Elaview",
  description: "Elaview",
};

export default function RootLayout(props: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <title>{metadata.title as string}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          storageKey={storage.preferences.theme}
        >
          <ApolloWrapper>{props.children}</ApolloWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
