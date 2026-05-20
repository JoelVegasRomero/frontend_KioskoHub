import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CartModal({ 
  isOpen, 
  onClose, 
  cartItems, 
  updateQuantity, 
  removeFromCart, 
  clearCart,
  triggerRefresh
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [ticketText, setTicketText] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setErrorMsg('Por favor completa los campos requeridos (Nombre y Email).');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const orderData = {
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      items: cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pedido.');
      }

      setOrderSuccess(data.order);
      setTicketText(data.ticket || '');
      triggerRefresh(); // Refresh catalog stock in real time!
      clearCart();
      setName('');
      setEmail('');
      setPhone('');
    } catch (error) {
      console.error('Error al realizar el pedido:', error);
      setErrorMsg(error.message || 'Ocurrió un error inesperado al procesar tu pedido.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setOrderSuccess(null);
    setTicketText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        
        {/* Sliding Panel */}
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-100 dark:border-slate-800 flex flex-col justify-between transform transition-transform duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <h2 className="font-display font-extrabold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-pink-500" />
              Tu Carrito
            </h2>
            <button 
              onClick={onClose} 
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Success Screen Overlay */}
          {orderSuccess ? (
            <div className="flex-grow px-6 py-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="flex flex-col items-center text-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-2 animate-bounce" />
                  <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white leading-tight">
                    ¡Pedido Realizado con Éxito!
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-xs">
                    El pedido se ha enviado a la vecina. Aquí tienes tu ticket de compra:
                  </p>
                </div>
                
                {/* Print receipt design */}
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                  <pre className="font-mono text-[10px] leading-tight bg-slate-100/60 dark:bg-slate-950 p-4 rounded-xl overflow-x-auto whitespace-pre text-slate-800 dark:text-slate-200 max-h-64 overflow-y-auto shadow-inner text-left select-text">
                    {ticketText}
                  </pre>
                </div>
                
                <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-medium italic">
                  * Un mensaje con este ticket ha sido enviado al correo electrónico ({orderSuccess.customer_email}).
                </p>
              </div>

              <button
                onClick={handleCloseSuccess}
                className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-bold text-sm shadow-md transition-all duration-200 cursor-pointer"
              >
                Volver a la Tienda
              </button>
            </div>
          ) : (
            /* Main Cart Layout */
            <>
              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                
                {errorMsg && (
                  <div className="flex gap-2.5 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/55 text-rose-700 dark:text-rose-400 text-xs">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <div>
                      <span className="font-bold">Error:</span> {errorMsg}
                    </div>
                  </div>
                )}

                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
                    <span className="text-5xl mb-4">🛒</span>
                    <p className="text-sm font-medium">El carrito está vacío.</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-[200px]">¡Navega y añade tus chuches, revistas o un delicioso café!</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800/40"
                    >
                      {/* Thumbnail Placeholder */}
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-pink-100 to-amber-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center shrink-0 text-2xl">
                        {item.category_slug === 'chuches' ? '🍬' : 
                         item.category_slug === 'cromos' ? '✨' : 
                         item.category_slug === 'papeleria' ? '📝' : '☕'}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {parseFloat(item.price).toFixed(2)}€ / ud
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-lg p-1 bg-slate-50 dark:bg-slate-850">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-350 px-1">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className={`p-1 rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer ${
                            item.quantity >= item.stock ? 'opacity-30 cursor-not-allowed' : ''
                          }`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors duration-200 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Form & Total Section */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Subtotal</span>
                    <span className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                      {total.toFixed(2)}€
                    </span>
                  </div>

                  {/* Customer Information Form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                        Nombre completo *
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Juan Pérez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/50 dark:text-slate-100 transition-all"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                          Email *
                        </label>
                        <input 
                          type="email" 
                          required
                          placeholder="juan@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/50 dark:text-slate-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                          Teléfono
                        </label>
                        <input 
                          type="tel" 
                          placeholder="600123456"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/50 dark:text-slate-100 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-pink-500/10 hover:shadow-pink-500/20 hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4.5 w-4.5 animate-spin" />
                          Procesando pedido...
                        </>
                      ) : (
                        'Completar Pedido (Pagar en Tienda)'
                      )}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
