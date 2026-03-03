import { Toaster } from "sonner";
import { api } from "@/convex/_generated/api";
import { TodoList } from "../../../components/todos/TodoList";
import { AppHeader } from "../../../components/layout/AppHeader";
import { preloadAuthQuery } from "@/lib/auth/server";

const Page = async () => {
  // Preload queries for SSR
  const [preloadedUserQuery, preloadedTodosQuery] = await Promise.all([
    preloadAuthQuery(api.auth.queries.getCurrentUser),
    preloadAuthQuery(api.todos.queries.get),
  ]);

  return (
    <div className="min-h-screen w-full p-4 space-y-8">
      <AppHeader preloadedUserQuery={preloadedUserQuery} />
      <TodoList preloadedTodosQuery={preloadedTodosQuery} />
      <Toaster />
    </div>
  );
};

export default Page;
