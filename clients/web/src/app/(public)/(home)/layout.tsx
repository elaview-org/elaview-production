import { authenticatedRedirect } from "@/lib/core/auth";

export default async function Layout(props: LayoutProps<"/">) {
  await authenticatedRedirect();

  return <main className="bleed-public -mt-14">{props.hero}</main>;
}
