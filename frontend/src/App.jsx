import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from './api';

const initialLogin = { email: '', password: '' };
const initialRegister = { fullName: '', email: '', phone: '', password: '' };

export default function App() {
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) return null;
    return { token, user: JSON.parse(user) };
  });
  const [vehicles, setVehicles] = useState([]);
  const [activeReservations, setActiveReservations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isAdminView = useMemo(() => ['ADMIN', 'MANAGER', 'AGENT'].includes(session?.user?.role), [session?.user?.role]);

  useEffect(() => {
    if (!session) return;

    const loadData = async () => {
      try {
        const [vehicleData, reservationData] = await Promise.all([
          apiRequest('/vehicles'),
          isAdminView ? apiRequest('/vehicles/active-reservations', 'GET', null, session.token) : Promise.resolve([])
        ]);
        setVehicles(vehicleData);
        setActiveReservations(Array.isArray(reservationData) ? reservationData : []);
      } catch (err) {
        setError(err.message);
      }
    };

    loadData();
  }, [session, isAdminView]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiRequest('/auth/login', 'POST', loginForm);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSession({ token: data.token, user: data.user });
      setLoginForm(initialLogin);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiRequest('/auth/register', 'POST', registerForm);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSession({ token: data.token, user: data.user });
      setRegisterForm(initialRegister);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setSession(null);
    setVehicles([]);
    setActiveReservations([]);
  };

  if (!session) {
    return (
      <main className="auth-layout">
        <section className="card">
          <h1>RentCarRD</h1>
          <p>Autenticación de clientes y personal.</p>

          <div className="tabs">
            <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
            <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Registro</button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Correo" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
              <input type="password" placeholder="Contraseña" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
              <button disabled={loading}>{loading ? 'Ingresando...' : 'Entrar'}</button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <input placeholder="Nombre completo" value={registerForm.fullName} onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })} required />
              <input type="email" placeholder="Correo" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} required />
              <input placeholder="Teléfono" value={registerForm.phone} onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} />
              <input type="password" placeholder="Contraseña" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} required />
              <button disabled={loading}>{loading ? 'Creando cuenta...' : 'Registrarme'}</button>
            </form>
          )}

          {error && <p className="error">{error}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-layout">
      <header>
        <div>
          <h1>Panel RentCarRD</h1>
          <p>{session.user.fullName} · Rol: {session.user.role}</p>
        </div>
        <button onClick={logout}>Cerrar sesión</button>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="grid">
        <article className="card">
          <h2>Vehículos</h2>
          <p>Total: {vehicles.length}</p>
          <ul>
            {vehicles.slice(0, 8).map((vehicle) => (
              <li key={vehicle.id}>
                {vehicle.brand} {vehicle.model} · {vehicle.plate_number} · {vehicle.status}
              </li>
            ))}
          </ul>
        </article>

        {isAdminView && (
          <article className="card">
            <h2>Reservas activas</h2>
            <p>Total: {activeReservations.length}</p>
            <ul>
              {activeReservations.slice(0, 8).map((reservation) => (
                <li key={reservation.id}>
                  #{reservation.id} · {reservation.customer_name} · {reservation.brand} {reservation.model}
                </li>
              ))}
            </ul>
          </article>
        )}
      </section>
    </main>
  );
}
