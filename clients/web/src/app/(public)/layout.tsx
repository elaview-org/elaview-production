export default function Layout(props: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col overflow-x-clip">
      {props.header}
      <div className="px-public @container/main grow">{props.children}</div>
      {props.footer}
    </div>
  );
}
