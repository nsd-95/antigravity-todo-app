import React from 'react';
import { CheckSquare } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex justify-center pt-8 pb-4">
      <div className="inline-flex items-center gap-3 bg-white/40 backdrop-blur-sm px-8 py-4 rounded-full border-2 border-white/50 shadow-sm">
        <div className="bg-white p-2 rounded-xl shadow-sm rotate-3">
          <CheckSquare className="w-8 h-8 text-purple-500" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-black text-gray-800 tracking-tight drop-shadow-sm font-['Fredoka']">
          My Todos
        </h1>
      </div>
    </header>
  );
};
