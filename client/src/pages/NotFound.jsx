import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-8">

      {/* Brand */}
      <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.4em] text-[#1a1a1a] mb-12">
        Dream & Work
      </p>

      {/* 404 */}
      <h1 className="font-['Noto_Serif'] text-[10rem] md:text-[16rem] font-light text-[#eeeeee] leading-none select-none">
        404
      </h1>

      {/* Message */}
      <div className="-mt-8 md:-mt-12 mb-12">
        <h2 className="font-['Noto_Serif'] text-2xl md:text-3xl text-[#1a1a1a] font-light mb-4">
          הדף שחיפשת לא נמצא
        </h2>
        <p className="font-['Manrope'] text-sm text-[#888888] max-w-sm mx-auto leading-relaxed">
          ייתכן שהקישור שגוי, הדף הוסר, או שהכתובת שונתה.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <button
          onClick={() => navigate('/shop')}
          className="gold-shimmer px-10 py-4 font-['Manrope'] text-xs uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity"
        >
          לחנות
        </button>
        <button
          onClick={() => navigate(-1)}
          className="border border-[#e8e8e6] text-[#888888] hover:text-[#1a1a1a] hover:border-[#888888] px-10 py-4 font-['Manrope'] text-xs uppercase tracking-[0.2em] transition-colors"
        >
          חזור אחורה
        </button>
      </div>

      {/* Decorative line */}
      <div className="mt-20 w-px h-16 bg-gradient-to-b from-[#1a1a1a]/20 to-transparent" />

    </div>
  );
}
