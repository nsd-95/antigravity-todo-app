import React, { useState } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import type { Group, TodoColor } from '../types';
import { GroupCard } from './GroupCard';

interface GroupListProps {
  groups: Group[];
  onAddGroup: (title: string) => string;
  onDeleteGroup: (id: string) => void;
  onUpdateGroupTitle: (id: string, newTitle: string) => void;
  onAddTodo: (groupId: string, text: string, color: TodoColor) => void;
  onDeleteTodo: (groupId: string, todoId: string) => void;
  onToggleTodo: (groupId: string, todoId: string) => void;
  onUpdateTodoColor: (groupId: string, todoId: string, color: TodoColor) => void;
  onUpdateTodoText: (groupId: string, todoId: string, newText: string) => void;
  onMoveTodo: (sourceGroupId: string, destGroupId: string, sourceIndex: number, destIndex: number) => void;
}

export const GroupList: React.FC<GroupListProps> = ({
  groups,
  onAddGroup,
  onDeleteGroup,
  onUpdateGroupTitle,
  onAddTodo,
  onDeleteTodo,
  onToggleTodo,
  onUpdateTodoColor,
  onUpdateTodoText,
  onMoveTodo,
}) => {
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [lastCreatedGroupId, setLastCreatedGroupId] = useState<string | null>(null);
  const [activePickerId, setActivePickerId] = useState<string | null>(null);

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupTitle.trim()) {
      const newId = onAddGroup(newGroupTitle.trim());
      setNewGroupTitle('');
      setLastCreatedGroupId(newId);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    onMoveTodo(
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 py-8 min-h-screen"
      onClick={() => setActivePickerId(null)} // Close picker when clicking background
    >
      <div className="sticky top-4 z-40 mb-12">
        <form
          onSubmit={handleAddGroup}
          onClick={(e) => e.stopPropagation()}
          className="flex gap-4 max-w-xl mx-auto bg-white/60 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/50"
        >
          <input
            type="text"
            value={newGroupTitle}
            onChange={(e) => setNewGroupTitle(e.target.value)}
            placeholder="New Group Name..."
            className="flex-1 px-6 py-3 text-lg rounded-full border-2 border-white/50 shadow-inner focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100 transition-all bg-white/80 font-['Fredoka'] text-gray-700"
          />
          <button
            type="submit"
            disabled={!newGroupTitle.trim()}
            className="px-8 py-3 bg-pink-400 text-white rounded-full font-bold text-lg hover:bg-pink-500 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:scale-100 font-['Fredoka']"
          >
            Create
          </button>
        </form>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {groups.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-4xl font-black text-gray-400 drop-shadow-sm mb-4 font-['Fredoka']">Start by creating a group!</h2>
            <p className="text-gray-500 font-['Fredoka'] text-xl">Use the form above to add your first group.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                autoFocus={group.id === lastCreatedGroupId}
                activePickerId={activePickerId}
                onDeleteGroup={onDeleteGroup}
                onUpdateGroupTitle={onUpdateGroupTitle}
                onAddTodo={onAddTodo}
                onDeleteTodo={onDeleteTodo}
                onToggleTodo={onToggleTodo}
                onUpdateTodoColor={onUpdateTodoColor}
                onUpdateTodoText={onUpdateTodoText}
                onSetActivePicker={setActivePickerId}
              />
            ))}
          </div>
        )}
      </DragDropContext>
    </div>
  );
};
