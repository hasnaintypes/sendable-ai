import { SignupForm } from "@/components/auth/SignUpForm";
import { Logo } from "@/components/shared/Logo";

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo href="/" showTitle size="lg" />
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
