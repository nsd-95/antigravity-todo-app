import React, { useRef, useEffect } from 'react';
import { Trash2, Check, Palette } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import type { Todo, TodoColor } from '../types';

interface TodoItemProps {
  todo: Todo;
  index: number;
  activePickerId: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: TodoColor) => void;
  onUpdateText: (id: string, newText: string) => void;
  onSetActivePicker: (id: string | null) => void;
}

const colorStyles: Record<TodoColor, string> = {
  default: 'bg-white border-gray-200',
  red: 'bg-red-100 border-red-300',
  blue: 'bg-blue-100 border-blue-300',
  green: 'bg-green-100 border-green-300',
  yellow: 'bg-yellow-100 border-yellow-300',
  purple: 'bg-purple-100 border-purple-300',
};

const colors: { value: TodoColor; bg: string }[] = [
  { value: 'default', bg: 'bg-white border border-gray-300' },
  { value: 'red', bg: 'bg-red-200' },
  { value: 'blue', bg: 'bg-blue-200' },
  { value: 'green', bg: 'bg-green-200' },
  { value: 'yellow', bg: 'bg-yellow-200' },
  { value: 'purple', bg: 'bg-purple-200' },
];

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  index,
  activePickerId,
  onToggle,
  onDelete,
  onColorChange,
  onUpdateText,
  onSetActivePicker,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  const showColorPicker = activePickerId === todo.id;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleTextSubmit = () => {
    if (editText.trim()) {
      onUpdateText(todo.id, editText.trim());
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided, snapshot) => {
        // Fix for drag offset: Do not override position when dragging
        const style: React.CSSProperties = {
          ...provided.draggableProps.style,
          marginBottom: '0.75rem',
          zIndex: snapshot.isDragging ? 9999 : (showColorPicker ? 50 : 'auto'),
        };

        // Only apply relative position when NOT dragging to allow z-index for picker to work
        // When dragging, react-beautiful-dnd sets position: fixed, which we must preserve
        if (!snapshot.isDragging) {
          style.position = 'relative';
        }

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={style}
          >
            <div
              className={`relative flex items-center justify-between p-4 rounded-2xl border-b-4 transition-all ${snapshot.isDragging
                ? 'shadow-2xl scale-105 rotate-2'
                : 'hover:-translate-y-1 hover:shadow-lg'
                } ${colorStyles[todo.color]} ${todo.completed ? 'opacity-60 grayscale' : 'shadow-md'
                }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => onToggle(todo.id)}
                  className={`flex-shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all active:scale-90 ${todo.completed
                    ? 'bg-gray-500 border-gray-500 text-white'
                    : 'bg-white border-gray-400 hover:border-blue-500'
                    }`}
                >
                  {todo.completed && <Check size={20} strokeWidth={3} />}
                </button>

                {isEditing ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={handleTextSubmit}
                    onKeyDown={handleKeyDown}
                    className="text-lg font-medium bg-white/50 px-2 py-1 rounded-lg border-2 border-blue-300 focus:outline-none focus:border-blue-500 font-['Fredoka'] w-full max-w-[180px]"
                  />
                ) : (
                  <span
                    onClick={() => setIsEditing(true)}
                    className={`text-lg font-medium truncate cursor-text hover:bg-black/5 px-2 py-1.5 rounded-lg transition-colors font-['Fredoka'] ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}
                  >
                    {todo.text}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetActivePicker(showColorPicker ? null : todo.id);
                    }}
                    className="p-2 text-gray-500 hover:text-blue-500 hover:bg-white/50 rounded-xl transition-colors"
                    aria-label="色を変更"
                  >
                    <Palette size={20} />
                  </button>

                  {showColorPicker && (
                    <div
                      className="absolute right-0 top-full mt-2 p-3 bg-white rounded-xl shadow-xl border-2 border-gray-100 flex gap-3 z-50 animate-in fade-in zoom-in duration-200 min-w-[240px] justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {colors.map((c) => (
                        <button
                          key={c.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            onColorChange(todo.id, c.value);
                            onSetActivePicker(null);
                          }}
                          className={`w-8 h-8 rounded-full ${c.bg} hover:scale-125 transition-transform border border-gray-200`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onDelete(todo.id)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-white/50 rounded-xl transition-colors"
                  aria-label="削除"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
