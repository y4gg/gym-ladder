import { RegisterForm } from "@/components/register-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <div className="flex w-full justify-center mt-10">
      <div className="w-full max-w-sm">
        <RegisterForm redirectUrl={redirect} />
      </div>
    </div>
  );
}
