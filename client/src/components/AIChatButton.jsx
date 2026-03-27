import { useState, useRef, useEffect } from 'react';
import api from '../services/api.js';

export default function AIChatButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'שלום! אני הסטייליסט של Dream & Work 👔\nספר לי לאיזה אירוע אתה מחפש בגדים ואמליץ לך.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    setProducts([]);

    try {
      const { data } = await api.post('/ai/chat', { message: text });
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
      if (data.products?.length) setProducts(data.products);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'מצטער, אירעה שגיאה. נסה שוב.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-8 left-8 w-14 h-14 bg-[#0e0e0e] shadow-2xl flex items-center justify-center hover:bg-[#1a1a1a] transition-all duration-300 z-50 border border-[#333]"
        title="בוט סטייליסט AI"
      >
        <span className="material-symbols-outlined text-gold text-2xl">smart_toy</span>
      </button>

      {open && (
        <div
          className="fixed bottom-28 left-8 bg-[#0e0e0e] border border-[#333] shadow-2xl z-50 flex flex-col"
          style={{ width: '340px', height: '480px' }}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-[#333] shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-gold text-sm">smart_toy</span>
              <span className="font-headline text-[#e7e5e5] text-sm">סטייליסט AI</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-[#767575] hover:text-[#e7e5e5]">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 text-xs font-label whitespace-pre-wrap leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#1a1a1a] text-[#e7e5e5] border border-[#333]'
                      : 'bg-[#1a1500] text-[#e9c349] border border-[#e9c349]/30'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-end">
                <div className="bg-[#1a1500] border border-[#e9c349]/30 px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Product recommendations */}
            {products.length > 0 && (
              <div className="mt-2">
                <p className="text-[#767575] text-xs font-label mb-2">מוצרים מומלצים:</p>
                <div className="flex flex-col gap-2">
                  {products.map(p => (
                    <a
                      key={p._id}
                      href={`/product/${p._id}`}
                      className="flex items-center gap-3 bg-[#111] border border-[#333] hover:border-gold/50 p-2 transition-colors"
                    >
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[#e7e5e5] text-xs font-label truncate">{p.name}</p>
                        <p className="text-gold text-xs">
                          {p.salePrice ? `₪${p.salePrice}` : `₪${p.price}`}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 pb-4 shrink-0 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="מה אתה מחפש?"
              disabled={loading}
              className="flex-1 bg-[#1a1a1a] border border-[#333] text-[#e7e5e5] px-3 py-2 text-xs font-label placeholder-[#767575] focus:outline-none focus:border-gold disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-gold text-black px-3 py-2 hover:bg-[#d4a93a] disabled:opacity-40 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
