import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError('הסיסמאות אינן תואמות');
    if (password.length < 8) return setError('סיסמה חייבת להיות לפחות 8 תווים');
    setLoading(true);
    setError('');
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      navigate('/login', { state: { message: 'הסיסמה אופסה בהצלחה — התחבר' } });
    } catch (err) {
      setError(err.response?.data?.error || 'הקישור פג תוקף — בקש קישור חדש');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link to="/" className="font-['Noto_Serif'] text-2xl font-light tracking-[0.3em] text-[#1a1a1a]">
            DREAM & WORK
          </Link>
        </div>

        <h1 className="font-['Noto_Serif'] text-3xl text-[#1a1a1a] text-center mb-2">סיסמה חדשה</h1>
        <p className="font-['Manrope'] text-sm text-[#888888] text-center mb-10">
          הכנס סיסמה חדשה לחשבונך
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-['Manrope'] px-4 py-3 mb-6 text-center">
            {error}{' '}
            {error.includes('פג תוקף') && (
              <Link to="/forgot-password" className="underline">שלח שוב</Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {[
            ['סיסמה חדשה', password, setPassword],
            ['אימות סיסמה', confirm, setConfirm],
          ].map(([label, val, setter]) => (
            <div key={label}>
              <label className="block font-['Manrope'] text-[0.65rem] uppercase tracking-widest text-[#888888] mb-2">
                {label}
              </label>
              <input
                type="password" required minLength={8}
                value={val}
                onChange={(e) => setter(e.target.value)}
                className="w-full bg-transparent border-b border-[#e8e8e6] text-[#1a1a1a] py-3 font-['Manrope'] text-sm focus:outline-none focus:border-[#888888] transition-colors"
                placeholder="••••••••"
              />
            </div>
          ))}

          <button
            type="submit" disabled={loading}
            className="w-full py-4 gold-shimmer font-['Manrope'] text-xs uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? 'מאפס...' : 'אפס סיסמה'}
          </button>
        </form>
      </div>
    </div>
  );
}
