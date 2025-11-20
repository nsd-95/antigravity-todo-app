import { Header } from './components/Header';
import { GroupList } from './components/GroupList';
import { useGroups } from './hooks/useGroups';

function App() {
  const {
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
  } = useGroups();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 font-['Fredoka'] relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>
      <div className="relative z-10">
        <Header />
        <main>
          <GroupList
            groups={groups}
            onAddGroup={addGroup}
            onDeleteGroup={deleteGroup}
            onUpdateGroupTitle={updateGroupTitle}
            onAddTodo={addTodo}
            onDeleteTodo={deleteTodo}
            onToggleTodo={toggleTodo}
            onUpdateTodoColor={updateTodoColor}
            onUpdateTodoText={updateTodoText}
            onMoveTodo={moveTodo}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
