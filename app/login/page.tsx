import { LoginForm } from "@/components/login-form";
import { PasskeyCard } from "@/components/passkey-card";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <div className="flex w-full justify-center mt-10">
      <div className="w-full max-w-sm space-y-4">
        <LoginForm redirectUrl={redirect} />
        <PasskeyCard redirectUrl={redirect} />
      </div>
    </div>
  );
}
