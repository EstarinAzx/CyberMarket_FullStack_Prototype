import { StoreProvider } from './context/StoreContext';
import { NotificationProvider } from './context/NotificationContext';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { useStore } from './context/StoreContext';

const AppContent = () => {
  const { user, loading } = useStore();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#000',
        color: '#00f3ff',
        fontFamily: 'Orbitron',
        fontSize: '1.5rem',
        letterSpacing: '5px'
      }}>
        INITIALIZING...
      </div>
    );
  }

  return user ? <Layout /> : <Login />;
};

function App() {
  return (
    <NotificationProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </NotificationProvider>
  );
}

export default App;
