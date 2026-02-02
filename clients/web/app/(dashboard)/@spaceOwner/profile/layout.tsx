import { Separator } from "@/components/primitives/separator";

export default function Layout(props: LayoutProps<"/profile">) {
  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 lg:flex-row lg:gap-12">
        {props.info}
        {props.about}
      </div>
      <Separator />
      {props.reviews}
    </div>
  );
}
