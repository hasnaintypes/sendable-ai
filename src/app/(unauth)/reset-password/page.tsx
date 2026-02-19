import { Suspense } from "react";
import ResetPassword from "../../../components/auth/ResetPassword";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword searchParams={searchParams} />
    </Suspense>
  );
}
