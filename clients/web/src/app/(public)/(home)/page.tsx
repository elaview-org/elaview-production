import { authenticatedRedirect } from "@/lib/core/auth";
import HeroSection from "./hero-section";

export default async function Page() {
  await authenticatedRedirect();

  return <HeroSection />;
}
