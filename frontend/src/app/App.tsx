import { LoginPage, useAuth } from '../features/auth/index.ts';
import { ScorePage } from '../features/score/index.ts';

export default function App() {
  const { session } = useAuth();
  return session ? <ScorePage /> : <LoginPage />;
}
