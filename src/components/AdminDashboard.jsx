import React, { useState, useEffect } from 'react';
import { 
  Package, ShoppingCart, Plus, Edit2, Trash2, Check, X, RefreshCw, 
  TrendingUp, AlertTriangle, Coffee, Filter, Info, Eye, CheckCircle2, XCircle, ArrowLeft
} from 'lucide-react';

export default function AdminDashboard({ triggerRefresh }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  const [loading, setLoading] = useState(true);
  
  // Product Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formImage, setFormImage] = useState('');
  
  // Order Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Refresh Helper
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch initial configuration data
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        if (data.length > 0) setFormCategory(data[0].id);
      })
      .catch(err => console.error('Error al cargar categorías:', err));
  }, []);

  // Fetch products and orders
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/products').then(res => res.json()),
      fetch('/api/orders').then(res => res.json())
    ])
      .then(([productsData, ordersData]) => {
        setProducts(productsData);
        setOrders(ordersData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error en carga de datos:', err);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormDesc('');
    setFormPrice('');
    setFormStock('');
    if (categories.length > 0) setFormCategory(categories[0].id);
    setFormImage('/assets/default.jpg');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormDesc(product.description || '');
    setFormPrice(product.price);
    setFormStock(product.stock);
    setFormCategory(product.category_id);
    setFormImage(product.image_url || '/assets/default.jpg');
    setIsModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const productPayload = {
      name: formName,
      description: formDesc,
      price: parseFloat(formPrice),
      stock: parseInt(formStock),
      category_id: parseInt(formCategory),
      image_url: formImage
    };

    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload)
      });

      if (!response.ok) {
        throw new Error('Error al guardar el producto.');
      }

      setIsModalOpen(false);
      setRefreshTrigger(prev => prev + 1);
      if (triggerRefresh) triggerRefresh();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleProductDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    try {
      const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar producto.');
      setRefreshTrigger(prev => prev + 1);
      if (triggerRefresh) triggerRefresh();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al actualizar el estado.');
      
      setRefreshTrigger(prev => prev + 1);
      if (triggerRefresh) triggerRefresh();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Calculate Statistics
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stock < 5).length;
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completado');
  const totalRevenue = completedOrders.reduce((acc, curr) => acc + parseFloat(curr.total), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header and Sync Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
            Panel de Control Vecinal
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Gestión en tiempo real de productos, inventario y pedidos de la tienda.
          </p>
        </div>
        
        <button
          onClick={() => setRefreshTrigger(prev => prev + 1)}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 cursor-pointer shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar Datos
        </button>
      </div>

      {/* Stats Cards Dashboard Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Stat 1: Total Revenue */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Ventas Completadas</span>
            <span className="font-display font-black text-2xl text-slate-900 dark:text-white">{totalRevenue.toFixed(2)}€</span>
          </div>
        </div>

        {/* Stat 2: Total Orders */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pedidos Recibidos</span>
            <span className="font-display font-black text-2xl text-slate-900 dark:text-white">{totalOrders}</span>
          </div>
        </div>

        {/* Stat 3: Total Products */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Productos en Catálogo</span>
            <span className="font-display font-black text-2xl text-slate-900 dark:text-white">{totalProducts}</span>
          </div>
        </div>

        {/* Stat 4: Low Stock Alert */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className={`p-3.5 rounded-xl ${lowStockCount > 0 ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 animate-pulse-slow' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Bajo Stock (&lt;5 uds)</span>
            <span className="font-display font-black text-2xl text-slate-900 dark:text-white">{lowStockCount}</span>
          </div>
        </div>

      </div>

      {/* Tabs Switcher and Add Actions */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-px">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-sm font-bold tracking-wide border-b-2 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            Gestión de Productos
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-bold tracking-wide border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            Pedidos ({orders.filter(o => o.status === 'pendiente').length} pendientes)
          </button>
        </div>

        {activeTab === 'products' && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-bold shadow-md hover:bg-pink-600 dark:hover:bg-pink-500 dark:hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Nuevo Producto
          </button>
        )}
      </div>

      {/* Main Content Loading */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-pink-500" />
          <p className="text-sm font-medium">Cargando panel de gestión...</p>
        </div>
      ) : activeTab === 'products' ? (
        /* PRODUCTS MANAGER */
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/85 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-slate-600 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/30 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4 text-right">Precio</th>
                  <th className="px-6 py-4 text-center">Stock</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40 text-sm">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">#{p.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl shrink-0">
                          {p.category_slug === 'chuches' ? '🍬' : 
                           p.category_slug === 'cromos' ? '✨' : 
                           p.category_slug === 'papeleria' ? '📝' : '☕'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white leading-tight">{p.name}</div>
                          <div className="text-xs text-slate-400 line-clamp-1 mt-0.5 max-w-[240px]">{p.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {p.category_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-display font-bold text-slate-900 dark:text-white">
                      {parseFloat(p.price).toFixed(2)}€
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                        p.stock === 0
                          ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600'
                          : p.stock < 5
                          ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 animate-pulse-slow'
                          : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'
                      }`}>
                        {p.stock} uds
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 cursor-pointer"
                          title="Editar Producto"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleProductDelete(p.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-500 hover:text-rose-600 transition-colors duration-200 cursor-pointer"
                          title="Eliminar Producto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ORDERS LIST */
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/85 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-slate-600 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/30 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Artículos</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40 text-sm">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">#{o.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{o.customer_name}</div>
                        <div className="text-xs text-slate-450 mt-0.5">{o.customer_email} {o.customer_phone ? `| ${o.customer_phone}` : ''}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {o.items.reduce((acc, curr) => acc + curr.quantity, 0)} artículos
                      </span>
                      <div className="text-xs text-slate-400 line-clamp-1 mt-0.5 max-w-[200px]">
                        {o.items.map(item => `${item.product_name} (x${item.quantity})`).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-display font-bold text-slate-900 dark:text-white">
                      {parseFloat(o.total).toFixed(2)}€
                    </td>
                    <td className="px-6 py-4 text-center font-semibold">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-xs ${
                        o.status === 'pendiente'
                          ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border border-amber-250/20'
                          : o.status === 'completado'
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-250/20'
                          : 'bg-slate-105 dark:bg-slate-850 text-slate-400 border border-slate-200/20'
                      }`}>
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Detalles
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* PRODUCT FORM MODAL */}
      {/* ================================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div 
            onClick={() => setIsModalOpen(false)} 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          ></div>
          
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-10 transform transition-all p-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-850">
              <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                {editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Nombre del Producto *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Café Americano, Sobre Fútbol 2026..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Descripción</label>
                <textarea 
                  rows="3"
                  placeholder="Escribe detalles del producto..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Precio (€) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Stock Disponible *</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    placeholder="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Categoría *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 dark:text-slate-100 cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Ruta de Imagen</label>
                  <input 
                    type="text" 
                    placeholder="/assets/ejemplo.jpg"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-350 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-pink-500/10"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Añadir Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* ORDER DETAILS MODAL */}
      {/* ================================================================ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div 
            onClick={() => setSelectedOrder(null)} 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          ></div>

          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-10 p-6 max-h-[85vh] flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                  Pedido #{selectedOrder.id}
                </h3>
                <p className="text-xs text-slate-405 mt-0.5">
                  Realizado el: {new Date(selectedOrder.created_at).toLocaleString('es-ES')}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-slate-405 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-655 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              
              {/* Customer Card */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Información Cliente</h4>
                  <p className="font-semibold text-slate-800 dark:text-slate-205">{selectedOrder.customer_name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-405">{selectedOrder.customer_email}</p>
                  {selectedOrder.customer_phone && (
                    <p className="text-xs text-slate-500 dark:text-slate-405 mt-0.5">Tel: {selectedOrder.customer_phone}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Estado Actual</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    selectedOrder.status === 'pendiente' ? 'bg-amber-100 text-amber-800' :
                    selectedOrder.status === 'completado' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Desglose de Artículos</h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 border-y border-slate-100 dark:border-slate-800">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-3">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{item.product_name || 'Producto Eliminado'}</p>
                        <p className="text-xs text-slate-400">Cantidad: {item.quantity} x {parseFloat(item.price).toFixed(2)}€</p>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {(parseFloat(item.price) * item.quantity).toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order total info */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total del Pedido</span>
                <span className="font-display font-black text-2xl text-slate-950 dark:text-white">
                  {parseFloat(selectedOrder.total).toFixed(2)}€
                </span>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-2 justify-end">
              {selectedOrder.status !== 'cancelado' && (
                <button
                  onClick={() => handleOrderStatusUpdate(selectedOrder.id, 'cancelado')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-rose-200/50"
                >
                  <XCircle className="h-4 w-4" /> Cancelar Pedido
                </button>
              )}
              {selectedOrder.status !== 'completado' && selectedOrder.status !== 'cancelado' && (
                <button
                  onClick={() => handleOrderStatusUpdate(selectedOrder.id, 'completado')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                >
                  <CheckCircle2 className="h-4 w-4" /> Completar Pedido
                </button>
              )}
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-350 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
