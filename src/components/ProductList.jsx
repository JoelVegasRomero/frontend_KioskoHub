import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Info, Candy, Sparkles, PenTool, Coffee, Loader2 } from 'lucide-react';

export default function ProductList({ 
  selectedCategory, 
  setSelectedCategory, 
  addToCart, 
  cartItems,
  refreshTrigger
}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error al cargar categorías:', err));
  }, []);

  // Fetch Products based on Category and Search
  useEffect(() => {
    setLoading(true);
    let url = '/api/products';
    const params = new URLSearchParams();
    if (selectedCategory) {
      params.append('category', selectedCategory);
    }
    if (search) {
      params.append('search', search);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar productos:', err);
        setLoading(false);
      });
  }, [selectedCategory, search, refreshTrigger]);

  // Helper to render decorative default SVG/emoji when product image fails to load
  const getProductFallbackSymbol = (slug, name) => {
    const itemName = name.toLowerCase();
    
    if (slug === 'chuches') {
      if (itemName.includes('chocolate')) return { emoji: '🍫', bg: 'from-pink-400 to-rose-500' };
      if (itemName.includes('piruleta')) return { emoji: '🍭', bg: 'from-rose-400 to-red-500' };
      if (itemName.includes('regaliz')) return { emoji: '🧣', bg: 'from-red-500 to-pink-600' };
      return { emoji: '🍬', bg: 'from-pink-400 to-pink-500' };
    }
    if (slug === 'cromos') {
      if (itemName.includes('pokemon')) return { emoji: '⚡', bg: 'from-yellow-400 to-red-500' };
      if (itemName.includes('álbum') || itemName.includes('album')) return { emoji: '📘', bg: 'from-purple-500 to-indigo-600' };
      return { emoji: '✨', bg: 'from-violet-500 to-indigo-500' };
    }
    if (slug === 'papeleria') {
      if (itemName.includes('cuaderno')) return { emoji: '📓', bg: 'from-blue-400 to-blue-600' };
      if (itemName.includes('bolígrafo') || itemName.includes('rotulador')) return { emoji: '🖊️', bg: 'from-sky-400 to-indigo-500' };
      return { emoji: '📝', bg: 'from-cyan-400 to-blue-500' };
    }
    if (slug === 'cafeteria') {
      if (itemName.includes('croissant')) return { emoji: '🥐', bg: 'from-amber-400 to-amber-600' };
      if (itemName.includes('muffin')) return { emoji: '🧁', bg: 'from-amber-400 to-rose-400' };
      if (itemName.includes('tostada')) return { emoji: '🥑', bg: 'from-emerald-400 to-amber-500' };
      if (itemName.includes('zumo')) return { emoji: '🍊', bg: 'from-orange-400 to-amber-500' };
      return { emoji: '☕', bg: 'from-amber-600 to-amber-800' };
    }
    return { emoji: '📦', bg: 'from-slate-400 to-slate-500' };
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Candy': return <Candy className="h-4.5 w-4.5" />;
      case 'Sparkles': return <Sparkles className="h-4.5 w-4.5" />;
      case 'PenTool': return <PenTool className="h-4.5 w-4.5" />;
      case 'Coffee': return <Coffee className="h-4.5 w-4.5" />;
      default: return <Candy className="h-4.5 w-4.5" />;
    }
  };

  // Check if item in cart reached max stock limit
  const getCartQuantity = (productId) => {
    const item = cartItems.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Category Pills & Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800/80 pb-6">
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              !selectedCategory
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/80 dark:hover:bg-slate-700'
            }`}
          >
            Todos los Productos
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-md shadow-pink-500/10'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/80 dark:hover:bg-slate-700'
              }`}
            >
              {getCategoryIcon(cat.icon)}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            type="text"
            placeholder="Buscar en la tienda..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/55 dark:text-slate-100 transition-all duration-200 shadow-sm"
          />
        </div>

      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 font-medium">Buscando antojos en el almacén...</p>
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 max-w-lg mx-auto shadow-sm">
          <div className="text-4xl">🔍</div>
          <h3 className="font-display font-bold text-lg mt-4 text-slate-800 dark:text-slate-100">Sin resultados</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">No pudimos encontrar productos que coincidan con tu búsqueda. ¡Prueba otro filtro o categoría!</p>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => {
            const fallback = getProductFallbackSymbol(product.category_slug, product.name);
            const cartQty = getCartQuantity(product.id);
            const availableStock = product.stock - cartQty;

            return (
              <div 
                key={product.id} 
                className="group flex flex-col justify-between bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800/85 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-200/80 dark:hover:border-slate-700/80 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  {/* Card Image / Graphic placeholder */}
                  <div className={`relative h-48 w-full bg-gradient-to-tr ${fallback.bg} flex items-center justify-center overflow-hidden`}>
                    
                    {/* Animated background decoration */}
                    <div className="absolute w-32 h-32 bg-white/10 rounded-full blur-xl -top-10 -left-10 group-hover:scale-150 transition-all duration-500"></div>
                    <div className="absolute w-32 h-32 bg-black/10 rounded-full blur-xl -bottom-10 -right-10 group-hover:scale-150 transition-all duration-500"></div>

                    {/* Emoji Illustration */}
                    <span className="text-7xl select-none transform group-hover:scale-115 group-hover:rotate-3 transition-transform duration-300">
                      {fallback.emoji}
                    </span>

                    {/* Category Overlay Tag */}
                    <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-md shadow-sm">
                      {product.category_name}
                    </span>

                    {/* Stock status overlay */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                      {product.stock === 0 ? (
                        <span className="text-[10px] font-extrabold bg-rose-500 text-white px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">
                          Agotado
                        </span>
                      ) : product.stock < 5 ? (
                        <span className="text-[10px] font-extrabold bg-amber-500 text-white px-2 py-0.5 rounded shadow-sm uppercase tracking-wide animate-pulse-slow">
                          Casi Agotado
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-5">
                    <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 text-base group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-200 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 min-h-[2rem]">
                      {product.description || 'Sin descripción disponible.'}
                    </p>
                  </div>
                </div>

                {/* Buy Section */}
                <div className="px-5 pb-5 pt-2 border-t border-slate-50 dark:border-slate-800/40 flex items-center justify-between">
                  <span className="font-display font-extrabold text-lg text-slate-950 dark:text-white">
                    {parseFloat(product.price).toFixed(2)}€
                  </span>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={availableStock <= 0}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                      availableStock <= 0
                        ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 border border-slate-200/20 dark:border-slate-800 cursor-not-allowed'
                        : 'bg-slate-900 text-white hover:bg-pink-600 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-pink-500 dark:hover:text-white hover:shadow-lg shadow-sm hover:scale-105 active:scale-95'
                    }`}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {cartQty > 0 ? `Añadido (${cartQty})` : 'Añadir'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
