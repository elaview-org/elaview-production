export default async function Page({ params }: PageProps<"/spaces/[id]">) {
  const { id } = await params;
  return <div>{id}</div>;
}
