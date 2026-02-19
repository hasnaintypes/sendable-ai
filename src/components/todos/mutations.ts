import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

// Mutations w/ optimistic updates
export const useCreateTodo = () =>
  useMutation(api.todos.mutations.create).withOptimisticUpdate((localStore, args) => {
    const todos = localStore.getQuery(api.todos.queries.get);
    if (!todos) {
      return;
    }
    const user = localStore.getQuery(api.auth.queries.getCurrentUser);
    if (!user) {
      return;
    }
    localStore.setQuery(api.todos.queries.get, {}, [
      {
        _id: crypto.randomUUID() as Id<"todos">,
        _creationTime: Date.now(),
        text: args.text,
        completed: false,
        userId: user._id,
      },
      ...todos,
    ]);
  });

export const useToggleCompleted = () =>
  useMutation(api.todos.mutations.toggle).withOptimisticUpdate((localStore, args) => {
    const todos = localStore.getQuery(api.todos.queries.get);
    if (!todos) {
      return;
    }
    const index = todos.findIndex((todo) => todo._id === args.id);
    const todo = todos[index];
    if (!todo) {
      return;
    }
    localStore.setQuery(
      api.todos.queries.get,
      {},
      todos.toSpliced(index, 1, {
        ...todo,
        completed: !todo.completed,
      }),
    );
  });

export const useRemoveTodo = () =>
  useMutation(api.todos.mutations.remove).withOptimisticUpdate((localStore, args) => {
    const todos = localStore.getQuery(api.todos.queries.get);
    if (!todos) {
      return;
    }
    const index = todos.findIndex((todo) => todo._id === args.id);
    localStore.setQuery(api.todos.queries.get, {}, todos.toSpliced(index, 1));
  });
