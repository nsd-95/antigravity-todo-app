import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Droppable } from '@hello-pangea/dnd';
import type { Group, TodoColor } from '../types';
import { TodoItem } from './TodoItem';

interface GroupCardProps {
  group: Group;
  autoFocus?: boolean;
  activePickerId: string | null;
  onDeleteGroup: (id: string) => void;
  onUpdateGroupTitle: (id: string, newTitle: string) => void;
  onAddTodo: (groupId: string, text: string, color: TodoColor) => void;
  onDeleteTodo: (groupId: string, todoId: string) => void;
  onToggleTodo: (groupId: string, todoId: string) => void;
  onUpdateTodoColor: (groupId: string, todoId: string, color: TodoColor) => void;
  onUpdateTodoText: (groupId: string, todoId: string, newText: string) => void;
  onSetActivePicker: (id: string | null) => void;
}

const colors: { value: TodoColor; bg: string }[] = [
  { value: 'default', bg: 'bg-white border border-gray-300' },
  { value: 'red', bg: 'bg-red-200' },
  { value: 'blue', bg: 'bg-blue-200' },
  { value: 'green', bg: 'bg-green-200' },
  { value: 'yellow', bg: 'bg-yellow-200' },
  { value: 'purple', bg: 'bg-purple-200' },
];

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  autoFocus,
  activePickerId,
  onDeleteGroup,
  onUpdateGroupTitle,
  onAddTodo,
  onDeleteTodo,
  onToggleTodo,
  onUpdateTodoColor,
  onUpdateTodoText,
  onSetActivePicker,
}) => {
  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] = useState<TodoColor>('default');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(group.title);

  const inputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(group.id, text.trim(), selectedColor);
      setText('');
      setSelectedColor('default');
      inputRef.current?.focus();
    }
  };

  const handleTitleSubmit = () => {
    if (editTitle.trim()) {
      onUpdateGroupTitle(group.id, editTitle.trim());
    } else {
      setEditTitle(group.title);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditTitle(group.title);
      setIsEditingTitle(false);
    }
  };

  const handleColorKeyDown = (e: React.KeyboardEvent, color: TodoColor) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSelectedColor(color);
      if (text.trim()) {
        onAddTodo(group.id, text.trim(), color);
        setText('');
        setSelectedColor('default');
        inputRef.current?.focus();
      }
    }
  };

  return (
    <div className="relative flex flex-col h-full hover:shadow-none">
      {/* Background Layer with Backdrop Blur - Restored */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] border-2 border-white pointer-events-none transition-shadow hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]" />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-full p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 mr-4">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleTitleKeyDown}
                className="w-full text-2xl font-black text-gray-800 tracking-tight bg-white/50 border-2 border-blue-300 rounded-xl px-3 py-1 focus:outline-none focus:border-blue-500 font-['Fredoka']"
              />
            ) : (
              <h2
                onClick={() => setIsEditingTitle(true)}
                className="text-2xl font-black text-gray-800 tracking-tight cursor-text hover:bg-white/50 rounded-xl px-3 py-1 transition-colors -ml-3 font-['Fredoka']"
              >
                {group.title}
              </h2>
            )}
          </div>
          <button
            onClick={() => onDeleteGroup(group.id)}
            className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl"
            title="Delete Group"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <Droppable droppableId={group.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 mb-6 min-h-[100px] transition-colors rounded-2xl p-2 -m-2 ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
                }`}
            >
              {group.todos.length === 0 && !snapshot.isDraggingOver ? (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl font-['Fredoka']">
                  No Tasks
                </div>
              ) : (
                group.todos.map((todo, index) => (
                  <TodoItem
                    key={todo.id}
                    index={index}
                    todo={todo}
                    activePickerId={activePickerId}
                    onToggle={(id) => onToggleTodo(group.id, id)}
                    onDelete={(id) => onDeleteTodo(group.id, id)}
                    onColorChange={(id, color) => onUpdateTodoColor(group.id, id, color)}
                    onUpdateText={(id, newText) => onUpdateTodoText(group.id, id, newText)}
                    onSetActivePicker={onSetActivePicker}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <form onSubmit={handleSubmit} className="mt-auto bg-white/50 p-4 rounded-2xl border border-white">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a task..."
            className="w-full px-4 py-2 mb-3 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-blue-400 font-medium font-['Fredoka']"
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedColor(c.value)}
                  onKeyDown={(e) => handleColorKeyDown(e, c.value)}
                  className={`w-6 h-6 rounded-full transition-transform ${c.bg} ${selectedColor === c.value ? 'scale-125 ring-2 ring-gray-300' : 'hover:scale-110'
                    }`}
                  title="Press Enter to add"
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={!text.trim()}
              className="bg-gray-900 text-white p-2 rounded-xl hover:bg-black active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg"
            >
              <Plus size={24} strokeWidth={3} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
