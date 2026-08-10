import { ChatWindow } from './components/ChatWindow/ChatWindow';

function App() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-canvas transition-colors duration-200 dark:bg-canvas-dark tablet:p-6">
      <ChatWindow />
    </div>
  );
}

export default App;
