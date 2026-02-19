import { authenticatedRedirect } from "@/lib/core/auth";
import Hero from "./hero";
import FeaturedSpaces from "./featured-spaces";

export default async function Page() {
  await authenticatedRedirect();

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <Hero />
      <FeaturedSpaces />
    </div>
  );
}
