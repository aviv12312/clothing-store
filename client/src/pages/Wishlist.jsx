import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Footer from '../components/layout/Footer';

export default function Wishlist() {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8]">
      <main className="flex-1 pt-32 pb-24 px-8 md:px-16 max-w-7xl mx-auto w-full">

        {/* Header */}
        <header className="mb-16">
          <h1 className="font-headline text-5xl md:text-6xl tracking-tighter text-on-surface mb-3">
            המועדפים שלי
          </h1>
          <p className="text-outline font-label text-xs uppercase tracking-widest">
            {items.length === 0 ? 'רשימה ריקה' : `${items.length} פריטים שמורים`}
          </p>
        </header>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <span className="material-symbols-outlined text-7xl text-outline">favorite</span>
            <p className="font-label text-sm uppercase tracking-widest text-outline">
              עוד לא שמרת פריטים
            </p>
            <Link
              to="/shop"
              className="bg-[#0e0e0e] text-[#e7e5e5] px-10 py-4 font-label text-xs uppercase tracking-widest hover:bg-[#2a2a2a] transition-colors"
            >
              גלה את הקולקציה
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
            {items.map((p) => (
              <div key={p._id} className="group relative">

                {/* Heart Button */}
                <button
                  onClick={() => toggle(p)}
                  className="absolute top-4 left-4 z-10 w-9 h-9 flex items-center justify-center bg-[#0e0e0e]/60 backdrop-blur-sm hover:bg-[#0e0e0e]/80 transition-all"
                  title="הסר מהמועדפים"
                >
                  <span className="material-symbols-outlined text-red-400 text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                </button>

                {/* Product Image */}
                <Link to={`/product/${p._id}`}>
                  <div className="relative overflow-hidden aspect-[3/4] bg-surface-container mb-5">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
                        <span className="material-symbols-outlined text-5xl text-outline">checkroom</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-headline text-lg text-on-surface">{p.name}</p>
                    <p className="text-outline text-sm font-body">{p.category}</p>
                  </div>
                  <div className="text-left">
                    {p.salePrice ? (
                      <>
                        <p className="font-body text-lg text-on-surface">₪{p.salePrice}</p>
                        <p className="text-outline line-through text-sm">₪{p.price}</p>
                      </>
                    ) : (
                      <p className="font-body text-lg text-on-surface">₪{p.price}</p>
                    )}
                  </div>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => addItem(p, p.sizes?.[0] || 'M', p.colors?.[0] || '')}
                  className="w-full mt-4 bg-[#0e0e0e] text-[#e7e5e5] py-3 font-label text-xs uppercase tracking-widest hover:bg-[#2a2a2a] transition-colors opacity-0 group-hover:opacity-100"
                >
                  הוסף לעגלה
                </button>

              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
