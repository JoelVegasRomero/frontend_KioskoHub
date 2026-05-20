import React, { useState } from 'react';
import { Lock, User, ArrowLeft, Loader2, Store } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, onBackToShop }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Por favor rellena todos los campos.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Credenciales inválidas.');
      }

      // Save token in localStorage
      localStorage.setItem('admin_token', data.token);
      onLoginSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8">
        
        {/* Back Link */}
        <div>
          <button
            onClick={onBackToShop}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la Tienda
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl relative overflow-hidden transition-all">
          {/* Animated decorative circles */}
          <div className="absolute w-32 h-32 bg-pink-500/10 rounded-full blur-2xl -top-10 -right-10"></div>
          <div className="absolute w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -bottom-10 -left-10"></div>

          <div className="text-center relative z-10">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-pink-500/10 mb-4">
              <Store className="h-6 w-6" />
            </div>
            <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white tracking-tight">
              Acceso Exclusivo Vecina
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              Solo el administrador puede acceder a la gestión e inventario.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4 relative z-10">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/55 text-rose-700 dark:text-rose-400 text-xs font-semibold text-center">
                {errorMsg}
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                Usuario Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ej. vecina"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 dark:text-slate-100 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 dark:text-slate-100 transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-pink-500/10 hover:shadow-pink-500/20 hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Verificando credenciales...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
