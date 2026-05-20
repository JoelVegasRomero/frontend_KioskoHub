import React from 'react';
import { Candy, Sparkles, PenTool, Coffee, ArrowRight } from 'lucide-react';

export default function Hero({ onCategorySelect }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/50 via-pink-50/20 to-transparent dark:from-slate-900 dark:via-purple-950/10 dark:to-transparent py-12 sm:py-16 transition-colors duration-300">
      
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none -z-10 dark:bg-amber-600/10"></div>
      <div className="absolute top-20 right-10 w-60 h-60 bg-pink-400/20 rounded-full blur-3xl pointer-events-none -z-10 dark:bg-pink-600/10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Main Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/40 mb-6 animate-pulse-slow">
          <Coffee className="h-3.5 w-3.5" /> ¡Nuevo apartado de Cafetería inaugurado!
        </span>

        {/* Hero Title */}
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-tight max-w-4xl mx-auto">
          Tu punto de encuentro para{' '}
          <span className="bg-gradient-to-r from-pink-500 via-amber-500 to-indigo-500 bg-clip-text text-transparent">
            antojos, colección, estudio
          </span>{' '}
          y buen café
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          ¿Un café espresso con croissant recién horneado? ¿Un sobre de cromos para completar tu colección? ¿O unas chuches para endulzar la tarde? Lo tenemos todo listo para ti.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onCategorySelect(null)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-semibold text-sm shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            Explorar Tienda Completa
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Feature Grid / Spotlight Section */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          
          {/* Sweets Card */}
          <div 
            onClick={() => onCategorySelect('chuches')}
            className="group flex flex-col items-center p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 shadow-md hover:shadow-xl hover:border-pink-200 dark:hover:border-pink-900/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="p-3.5 rounded-xl bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-300">
              <Candy className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 mt-4 text-base">Chuches</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">Gominolas, regalices y chocolates para endulzar el día.</p>
          </div>

          {/* Cards Card */}
          <div 
            onClick={() => onCategorySelect('cromos')}
            className="group flex flex-col items-center p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 shadow-md hover:shadow-xl hover:border-violet-200 dark:hover:border-violet-900/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="p-3.5 rounded-xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 mt-4 text-base">Cromos</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">Sobres oficiales de Liga, Pokémon y álbumes especiales.</p>
          </div>

          {/* Stationery Card */}
          <div 
            onClick={() => onCategorySelect('papeleria')}
            className="group flex flex-col items-center p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 shadow-md hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="p-3.5 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
              <PenTool className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 mt-4 text-base">Papelería</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">Cuadernos, bolígrafos, pinturas y material escolar.</p>
          </div>

          {/* Cafeteria Card - Highlighted */}
          <div 
            onClick={() => onCategorySelect('cafeteria')}
            className="group relative flex flex-col items-center p-5 rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-slate-800 border border-amber-200 dark:border-amber-900/50 shadow-md hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-800 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            {/* New Spotlight Ribbon */}
            <span className="absolute top-2 right-2 text-[9px] font-bold text-amber-800 dark:text-amber-200 bg-amber-200 dark:bg-amber-850 px-2 py-0.5 rounded-full uppercase tracking-wider">
              ¡Nuevo!
            </span>
            <div className="p-3.5 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <Coffee className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-amber-900 dark:text-amber-350 mt-4 text-base">Cafetería</h3>
            <p className="text-xs text-amber-800/80 dark:text-amber-350/80 mt-1 text-center font-medium">Café de grano premium, repostería y desayunos recién hechos.</p>
          </div>

        </div>

      </div>
    </div>
  );
}
