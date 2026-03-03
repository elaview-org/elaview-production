export default async function Layout(props: LayoutProps<"/home">) {
  return (
    <main className="bleed-public -mt-14 flex flex-col">
      {props.hero}
      <div className="px-public py-16 md:py-24">{props["featured-spaces"]}</div>
    </main>
  );
}
