import { authenticatedRedirect } from "@/lib/services/auth";
import HeroSection from "@/components/landing/hero-section";

export default async function Page() {
  await authenticatedRedirect();

  return (
    <HeroSection />
  );
}
