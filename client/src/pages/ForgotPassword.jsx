import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setError('אירעה שגיאה — נסה שוב');
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

        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-6">📧</div>
            <h2 className="font-['Noto_Serif'] text-2xl text-[#1a1a1a] mb-4">הקישור נשלח!</h2>
            <p className="font-['Manrope'] text-sm text-[#888888] leading-relaxed mb-8">
              אם האימייל קיים במערכת — שלחנו קישור לאיפוס סיסמה.<br />
              תקף ל-30 דקות בלבד.
            </p>
            <Link to="/login" className="font-['Manrope'] text-xs uppercase tracking-widest text-[#1a1a1a] hover:opacity-70 transition-opacity">
              חזור להתחברות
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-['Noto_Serif'] text-3xl text-[#1a1a1a] text-center mb-2">שכחתי סיסמה</h1>
            <p className="font-['Manrope'] text-sm text-[#888888] text-center mb-10">
              הכנס את האימייל שלך ונשלח לך קישור לאיפוס
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-['Manrope'] px-4 py-3 mb-6 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block font-['Manrope'] text-[0.65rem] uppercase tracking-widest text-[#888888] mb-2">
                  אימייל
                </label>
                <input
                  type="email" required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-[#e8e8e6] text-[#1a1a1a] py-3 font-['Manrope'] text-sm focus:outline-none focus:border-[#888888] transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-4 gold-shimmer font-['Manrope'] text-xs uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {loading ? 'שולח...' : 'שלח קישור לאיפוס'}
              </button>
            </form>

            <p className="text-center font-['Manrope'] text-xs text-[#888888] mt-8">
              נזכרת?{' '}
              <Link to="/login" className="text-[#1a1a1a] hover:opacity-70 transition-opacity">
                התחבר
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
