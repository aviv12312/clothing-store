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
        className="fixed bottom-5 left-5 z-50 flex h-12 w-12 items-center justify-center border border-[#6E6A62] bg-[#121211] shadow-xl transition-all duration-300 hover:bg-black sm:bottom-8 sm:left-8 sm:h-14 sm:w-14"
        title="בוט סטייליסט AI"
      >
        <span className="material-symbols-outlined text-white text-2xl">smart_toy</span>
      </button>

      {open && (
        <div
          className="fixed bottom-20 left-3 right-3 z-50 flex w-auto flex-col border border-[#ECE9E3] bg-white shadow-2xl sm:bottom-28 sm:left-8 sm:right-auto sm:w-[340px]"
          style={{ height: 'min(70vh, 520px)' }}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-[#ECE9E3] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#121211] text-sm">smart_toy</span>
              <span className="font-headline text-[#121211] text-sm">סטייליסט AI</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-[#9A958C888] hover:text-[#121211]">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[86%] whitespace-pre-wrap px-3 py-2 text-xs font-label leading-relaxed sm:max-w-[80%] ${
                    m.role === 'user'
                      ? 'bg-[#FBFAF7] text-[#121211] border border-[#ECE9E3]'
                      : 'bg-[#121211] text-white border border-[#121211]'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-end">
                <div className="bg-[#121211] border border-[#121211] px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Product recommendations */}
            {products.length > 0 && (
              <div className="mt-2">
                <p className="text-[#9A958C888] text-xs font-label mb-2">מוצרים מומלצים:</p>
                <div className="flex flex-col gap-2">
                  {products.map(p => (
                    <a
                      key={p._id}
                      href={`/product/${p._id}`}
                      className="flex items-center gap-3 bg-[#FBFAF7] border border-[#ECE9E3] hover:border-[#121211]/30 p-2 transition-colors"
                    >
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[#121211] text-xs font-label truncate">{p.name}</p>
                        <p className="text-[#6E6A62666] text-xs">
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
          <div className="flex shrink-0 gap-2 px-4 pb-4">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="מה אתה מחפש?"
              disabled={loading}
              className="flex-1 bg-[#FBFAF7] border border-[#ECE9E3] text-[#121211] px-3 py-2 text-xs font-label placeholder-[#9A958C888] focus:outline-none focus:border-[#121211] disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-[#121211] text-white px-3 py-2 hover:bg-black disabled:opacity-40 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
