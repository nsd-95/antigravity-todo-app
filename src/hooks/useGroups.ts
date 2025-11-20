import { useState, useEffect } from 'react';
import type { Todo, TodoColor, Group } from '../types';

const STORAGE_KEY = 'antigravity-todos-v2';

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse groups from local storage', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  }, [groups]);

  const addGroup = (title: string) => {
    const newGroup: Group = {
      id: crypto.randomUUID(),
      title,
      todos: [],
      createdAt: Date.now(),
    };
    setGroups((prev) => [...prev, newGroup]);
    return newGroup.id;
  };

  const deleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const updateGroupTitle = (groupId: string, newTitle: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, title: newTitle } : g))
    );
  };

  const addTodo = (groupId: string, text: string, color: TodoColor) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      color,
      createdAt: Date.now(),
    };
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, todos: [...g.todos, newTodo] } : g
      )
    );
  };

  const deleteTodo = (groupId: string, todoId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, todos: g.todos.filter((t) => t.id !== todoId) }
          : g
      )
    );
  };

  const toggleTodo = (groupId: string, todoId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
            ...g,
            todos: g.todos.map((t) =>
              t.id === todoId ? { ...t, completed: !t.completed } : t
            ),
          }
          : g
      )
    );
  };

  const updateTodoColor = (groupId: string, todoId: string, color: TodoColor) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
            ...g,
            todos: g.todos.map((t) =>
              t.id === todoId ? { ...t, color } : t
            ),
          }
          : g
      )
    );
  };

  const updateTodoText = (groupId: string, todoId: string, newText: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
            ...g,
            todos: g.todos.map((t) =>
              t.id === todoId ? { ...t, text: newText } : t
            ),
          }
          : g
      )
    );
  };

  const moveTodo = (
    sourceGroupId: string,
    destinationGroupId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    setGroups((prev) => {
      const newGroups = [...prev];
      const sourceGroupIndex = newGroups.findIndex((g) => g.id === sourceGroupId);
      const destGroupIndex = newGroups.findIndex((g) => g.id === destinationGroupId);

      if (sourceGroupIndex === -1 || destGroupIndex === -1) return prev;

      const sourceGroup = { ...newGroups[sourceGroupIndex] };
      const destGroup = { ...newGroups[destGroupIndex] };

      // If moving within the same group
      if (sourceGroupId === destinationGroupId) {
        const newTodos = [...sourceGroup.todos];
        const [removed] = newTodos.splice(sourceIndex, 1);
        newTodos.splice(destinationIndex, 0, removed);

        newGroups[sourceGroupIndex] = { ...sourceGroup, todos: newTodos };
        return newGroups;
      }

      // Moving between different groups
      const sourceTodos = [...sourceGroup.todos];
      const destTodos = [...destGroup.todos];

      const [removed] = sourceTodos.splice(sourceIndex, 1);
      destTodos.splice(destinationIndex, 0, removed);

      newGroups[sourceGroupIndex] = { ...sourceGroup, todos: sourceTodos };
      newGroups[destGroupIndex] = { ...destGroup, todos: destTodos };

      return newGroups;
    });
  };

  return {
    groups,
    addGroup,
    deleteGroup,
    updateGroupTitle,
    addTodo,
    deleteTodo,
    toggleTodo,
    updateTodoColor,
    updateTodoText,
    moveTodo,
  };
};
