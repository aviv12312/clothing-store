import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [newsletter, setNewsletter] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      if (newsletter) {
        try { await api.post('/newsletter/subscribe', { email: form.email }); } catch {}
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'שגיאה בהרשמה');
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
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80')` }}
            />
            <div className="relative h-full flex flex-col justify-end p-14">
              <h2 className="font-headline text-4xl text-white font-light leading-tight">
                הצטרף לעולם<br />האופנה המינימליסטית.
              </h2>
            </div>
          </div>

          {/* Form side */}
          <div className="p-10 md:p-16">
            <div className="mb-10">
              <h1 className="font-headline text-3xl text-on-surface mb-2">הרשמה</h1>
              <p className="text-outline text-sm font-body">גלה הגעות לפני הכולם</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="שם מלא"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border-b border-outline-variant py-3 focus:outline-none focus:border-on-surface bg-transparent text-on-surface placeholder-outline font-label text-sm uppercase tracking-wider"
              />
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
                placeholder="סיסמה (8+ תווים)"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full border-b border-outline-variant py-3 focus:outline-none focus:border-on-surface bg-transparent text-on-surface placeholder-outline font-label text-sm uppercase tracking-wider"
              />
              {/* Newsletter Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border transition-colors ${newsletter ? 'bg-[#1a1a1a] border-[#1a1a1a]' : 'bg-white border-gray-300'} flex items-center justify-center`}>
                    {newsletter && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                  </div>
                </div>
                <span className="font-label text-[0.7rem] uppercase tracking-wider text-gray-500 leading-relaxed">
                  אני מעוניין לקבל עדכונים על קולקציות חדשות ומבצעים בלעדיים
                </span>
              </label>

              {error && <p className="text-red-500 text-sm font-label">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1a1a] text-white py-4 font-label text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors disabled:opacity-50"
              >
                {loading ? 'נרשם...' : 'הצטרף עכשיו'}
              </button>
            </form>

            <p className="text-center mt-8 text-outline text-sm font-body">
              יש כבר חשבון?{' '}
              <Link to="/login" className="text-on-surface border-b border-on-surface/30 hover:border-on-surface transition-colors">
                כניסה
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
