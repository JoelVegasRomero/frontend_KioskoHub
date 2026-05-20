import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import CartModal from './components/CartModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { Coffee, Candy, Sparkles, PenTool, Store } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('shop'); // 'shop' | 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('admin_token'));
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState(() => {
    const localData = localStorage.getItem('tienda_cart');
    return localData ? JSON.parse(localData) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const isDark = localStorage.getItem('tienda_dark') === 'true';
    return isDark;
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('tienda_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync Dark Mode to DOM body
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('tienda_dark', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Shopping Cart Actions
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return prevCart; // limit reached
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.min(newQuantity, item.stock) }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Helper to scroll to product section
  const handleCategorySelectFromHero = (categorySlug) => {
    setSelectedCategory(categorySlug);
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col justify-between font-sans transition-colors duration-300">
      
      {/* Top Navbar */}
      <Navbar 
        view={view}
        setView={setView}
        cartCount={cartCount}
        setIsCartOpen={setIsCartOpen}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {view === 'shop' ? (
          <>
            {/* Hero spotlight */}
            <Hero onCategorySelect={handleCategorySelectFromHero} />
            
            {/* Main Products Listing Section */}
            <div id="products-section" className="scroll-mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="font-display font-black text-2xl tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    {selectedCategory 
                      ? `Sección: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}` 
                      : 'Explora nuestro catálogo'}
                  </h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Selecciona una categoría o busca tu producto favorito.
                </p>
              </div>

              <ProductList 
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                addToCart={addToCart}
                cartItems={cart}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </>
        ) : isAuthenticated ? (
          /* Admin View Dashboard */
          <AdminDashboard 
            triggerRefresh={triggerRefresh} 
            onLogout={() => {
              localStorage.removeItem('admin_token');
              setIsAuthenticated(false);
              setView('shop');
            }}
          />
        ) : (
          /* Admin Login Panel */
          <AdminLogin 
            onLoginSuccess={() => setIsAuthenticated(true)} 
            onBackToShop={() => setView('shop')} 
          />
        )}
      </main>

      {/* Slide-out Shopping Cart */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        triggerRefresh={triggerRefresh}
      />

      {/* Modern Premium Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900/60 transition-colors duration-300 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Brand details */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-pink-500 text-white shadow-sm">
                <Store className="h-4 w-4" />
              </div>
              <span className="font-display font-extrabold text-sm text-slate-700 dark:text-slate-350 tracking-tight">
                El Rincón de la Vecina &copy; 2026
              </span>
            </div>

            {/* Department mini badge list */}
            <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1"><Candy className="h-3.5 w-3.5 text-pink-400" /> Chuches</span>
              <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-violet-400" /> Cromos</span>
              <span className="flex items-center gap-1"><PenTool className="h-3.5 w-3.5 text-blue-400" /> Papelería</span>
              <span className="flex items-center gap-1"><Coffee className="h-3.5 w-3.5 text-amber-500" /> Cafetería</span>
            </div>

            {/* Note */}
            <div className="text-center md:text-right text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Hecho con ❤️ para la vecina favorita del barrio.
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
