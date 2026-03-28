import { useSearchParams, Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get('id');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl">✓</div>
          <h1 className="font-headline text-3xl text-on-surface">הזמנתך התקבלה!</h1>
          <p className="text-outline font-label">
            תודה שקנית ב-Dream & Work. ההזמנה שלך בטיפול ותישלח בקרוב.
          </p>
          {orderId && (
            <p className="text-outline font-label text-sm">
              מספר הזמנה: <span className="text-on-surface font-bold">#{orderId.slice(-6).toUpperCase()}</span>
            </p>
          )}
          <div className="flex flex-col gap-3 pt-4">
            <Link
              to="/profile"
              className="bg-primary text-on-primary py-3 px-6 font-label uppercase tracking-widest text-sm hover:opacity-90 transition"
            >
              צפה בהזמנות שלי
            </Link>
            <Link
              to="/shop"
              className="border border-outline text-on-surface py-3 px-6 font-label uppercase tracking-widest text-sm hover:bg-surface transition"
            >
              המשך לקנות
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
