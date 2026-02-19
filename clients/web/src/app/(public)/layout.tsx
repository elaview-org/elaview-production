import Header from "./(layout)/header";
import Footer from "./(layout)/footer";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col overflow-x-clip">
      <Header />
      <div className="px-public grow">{children}</div>
      <Footer />
    </div>
  );
}
