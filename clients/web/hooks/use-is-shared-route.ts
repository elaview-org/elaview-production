import { usePathname } from "next/navigation";

export default function useIsSharedRoute() {
  const pathname = usePathname();
  return !!sharedRoutes.find((route) => pathname.startsWith(route));
}

const sharedRoutes = ["/spaces"];
