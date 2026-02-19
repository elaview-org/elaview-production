import Header from "./(layout)/header";
import Footer from "./(layout)/footer";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 md:py-6 lg:px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
