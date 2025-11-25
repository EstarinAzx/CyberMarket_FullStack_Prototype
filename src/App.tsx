import { StoreProvider, useStore } from './context/StoreContext';
import { Layout } from './components/Layout';
import { Login } from './components/Login';

const AppContent = () => {
  const { user } = useStore();
  return user ? <Layout /> : <Login />;
};

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
