import { Toaster } from "sonner";
import { api } from "@/convex/_generated/api";
import { AppHeader } from "../../../components/layout/AppHeader";
import { preloadAuthQuery } from "@/lib/auth/server";

const Page = async () => {
  // Preload queries for SSR
  const [preloadedUserQuery] = await Promise.all([
    preloadAuthQuery(api.auth.queries.getCurrentUser),
  ]);

  return (
    <div className="min-h-screen w-full p-4 space-y-8">
      <AppHeader preloadedUserQuery={preloadedUserQuery} />
      <Toaster />
    </div>
  );
};

export default Page;
