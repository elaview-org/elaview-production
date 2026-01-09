import Link from "next/link";

export default function Layout({ children, auth }: LayoutProps<"/">) {
  return (
    <>
      <nav>
        <Link href={"/login"}>Login</Link>
        <Link href={"/signup"}>Signup</Link>
      </nav>
      {auth}
      {children}
    </>
  );
}
