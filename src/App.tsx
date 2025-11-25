import { StoreProvider, useStore } from './context/StoreContext';
import { Layout } from './components/Layout';
import { Login } from './components/Login';

function AppContent() {
  const { user, loading } = useStore();

  if (loading) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="crt-overlay"></div>
        <div className="scanline"></div>
        <div style={{
          fontFamily: 'Orbitron',
          color: '#00f3ff',
          fontSize: '2rem',
          textAlign: 'center'
        }}>
          INITIALIZING...
        </div>
      </div>
    );
  }

  return user ? <Layout /> : <Login />;
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
