import { useAuth } from './features/auth/useAuth.ts';
import { LoginPage } from './features/auth/LoginPage.tsx';

export default function App() {
  const { session, logout } = useAuth();
  if (!session) return <LoginPage />;
  return (
    <main className="card">
      <p>
        Hola {session.user.username} ({session.user.role})
      </p>
      <button onClick={logout}>Cerrar sesión</button>
    </main>
  );
}
