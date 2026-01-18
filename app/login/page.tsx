import { LoginForm } from "@/components/login-form";
import { PasskeyCard } from "@/components/passkey-card";

export default function Page() {
  return (
    <div className="flex w-full justify-center mt-10">
      <div className="w-full max-w-sm space-y-4">
        <LoginForm />
        <PasskeyCard />
      </div>
    </div>
  );
}
