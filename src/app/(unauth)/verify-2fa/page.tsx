import TwoFactorVerification from "@/components/auth/TwoFactorVerification";

export default function VerifyTwoFactorPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <TwoFactorVerification />
      </div>
    </div>
  );
}
