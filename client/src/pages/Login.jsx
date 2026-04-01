import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-low">
      <main className="flex-1 flex items-center justify-center pt-20 px-6 py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white shadow-2xl overflow-hidden border border-surface-container-high">
          {/* Image side */}
          <div className="relative hidden md:block bg-[#f5f5f3]">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80')` }}
            />
            <div className="relative h-full flex flex-col justify-end p-14">
              <h2 className="font-headline text-4xl text-white font-light leading-tight">
                אוסף קבוע.<br />עיצוב נצחי.
              </h2>
            </div>
          </div>

          {/* Form side */}
          <div className="p-10 md:p-16">
            <div className="mb-10">
              <h1 className="font-headline text-3xl text-on-surface mb-2">כניסה</h1>
              <p className="text-outline text-sm font-body">ברוך שובך לחנות</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="email"
                placeholder="כתובת אימייל"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border-b border-outline-variant py-3 focus:outline-none focus:border-on-surface bg-transparent text-on-surface placeholder-outline font-label text-sm uppercase tracking-wider"
              />
              <input
                type="password"
                placeholder="סיסמה"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full border-b border-outline-variant py-3 focus:outline-none focus:border-on-surface bg-transparent text-on-surface placeholder-outline font-label text-sm uppercase tracking-wider"
              />
              {error && <p className="text-red-500 text-sm font-label">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1a1a] text-white py-4 font-label text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors disabled:opacity-50"
              >
                {loading ? 'מתחבר...' : 'כניסה'}
              </button>
            </form>

            <div className="text-center mt-8 space-y-3">
              <p className="text-outline text-sm font-body">
                אין חשבון?{' '}
                <Link to="/register" className="text-on-surface border-b border-on-surface/30 hover:border-on-surface transition-colors">
                  הירשם עכשיו
                </Link>
              </p>
              <p className="text-outline text-sm font-body">
                <Link to="/forgot-password" className="text-[#888888] hover:text-[#1a1a1a] transition-colors font-['Manrope'] text-xs">
                  שכחתי סיסמה
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
