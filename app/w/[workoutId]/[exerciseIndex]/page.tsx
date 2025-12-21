export default async function Page({}: // params,
{
  // params: Promise<{ slug: string }>;
}) {
  // const { slug } = await params;
  return (
    <div className="grid grid-cols-[2fr_3fr] h-screen">
      <div className="bg-green-500 p-8">1/3 width</div>
      <div className="bg-purple-500 p-8">2/3 width</div>
    </div>
  );
}
