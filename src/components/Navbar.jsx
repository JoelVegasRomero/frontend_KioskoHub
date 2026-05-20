import React from 'react';
import { ShoppingCart, Moon, Sun, ShieldAlert, Store, Coffee } from 'lucide-react';

export default function Navbar({ 
  view, 
  setView, 
  cartCount, 
  setIsCartOpen, 
  darkMode, 
  toggleDarkMode 
}) {
  return (
    <nav className="sticky top-0 z-40 w-full glass-effect border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setView('shop')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-gradient-to-tr from-pink-500 via-amber-500 to-violet-600 text-white shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform duration-300">
              <Store className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-pink-600 via-amber-600 to-indigo-600 dark:from-pink-400 dark:via-amber-400 dark:to-indigo-400 bg-clip-text text-transparent">
                El Rincón de la Vecina
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1 flex items-center gap-1 font-medium">
                Chuches, Papelería y Cafetería <Coffee className="h-3 w-3 inline text-amber-600" />
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* View Toggle */}
            <button
              onClick={() => setView(view === 'shop' ? 'admin' : 'shop')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 border cursor-pointer ${
                view === 'admin'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-900/50 dark:text-indigo-300'
                  : 'bg-transparent border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              <span className="hidden sm:inline">
                {view === 'shop' ? 'Panel Vecina' : 'Ver Tienda'}
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 cursor-pointer"
              aria-label="Alternar modo oscuro"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Shopping Cart Button */}
            {view === 'shop' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-lg bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-900/50 hover:bg-pink-100 dark:hover:bg-pink-950/40 transition-colors duration-200 cursor-pointer"
                aria-label="Abrir carrito de compras"
              >
                <ShoppingCart className="h-4.5 w-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse-slow">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}
