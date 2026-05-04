import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Plus, Search, Trash2, ShoppingCart, CreditCard, DollarSign, Receipt, 
  Barcode, User, X, Minus, RotateCcw, Printer, Download, Gift,
  Calculator, Percent, Clock, CheckCircle, AlertCircle,
  Package, Tag, Wifi, WifiOff, TrendingUp, ArrowLeft
} from 'lucide-react';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../components/Layout';
import { posService } from '../services/api';

const POS = () => {
  const { isDark, formatCurrency } = useTheme();
  const location = useLocation();
  const path = location.pathname;
  
  const getInitialTab = () => {
    if (path.includes('/transactions')) return 'transactions';
    return 'pos';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [orderNumber, setOrderNumber] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [lastOrder, setLastOrder] = useState(null);
  const [transactions, setTransactions] = useState([
    { id: 1, orderNumber: 'ORD-123456', date: '2024-03-15', customer: 'John Doe', items: 3, total: 2999, payment: 'card', status: 'completed' },
    { id: 2, orderNumber: 'ORD-123455', date: '2024-03-15', customer: 'Jane Smith', items: 1, total: 499, payment: 'cash', status: 'completed' },
    { id: 3, orderNumber: 'ORD-123454', date: '2024-03-14', customer: 'Bob Wilson', items: 5, total: 4597, payment: 'card', status: 'completed' },
    { id: 4, orderNumber: 'ORD-123453', date: '2024-03-14', customer: 'Alice Brown', items: 2, total: 1498, payment: 'cash', status: 'refunded' },
    { id: 5, orderNumber: 'ORD-123452', date: '2024-03-13', customer: 'Charlie Davis', items: 4, total: 2196, payment: 'card', status: 'completed' },
  ]);
  
  const searchRef = useRef(null);
  
  const categories = ['All', 'Software', 'Hardware', 'Accessories', 'Services'];
  
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await posService.getProducts();
      setProducts(data.products || []);
    } catch (error) {
      setProducts([
        { id: 1, name: 'Enterprise License', sku: 'ENT-001', price: 2499, category: 'Software', stock: 100 },
        { id: 2, name: 'Professional License', sku: 'PRO-001', price: 999, category: 'Software', stock: 200 },
        { id: 3, name: 'Starter License', sku: 'STD-001', price: 299, category: 'Software', stock: 500 },
        { id: 4, name: 'Hardware Dongle', sku: 'HW-001', price: 149, category: 'Hardware', stock: 50 },
        { id: 5, name: 'USB Cable Pack', sku: 'ACC-001', price: 29, category: 'Accessories', stock: 300 },
        { id: 6, name: 'Premium Support', sku: 'SUP-001', price: 499, category: 'Services', stock: 999 },
        { id: 7, name: 'API Add-on', sku: 'API-001', price: 199, category: 'Software', stock: 100 },
        { id: 8, name: 'Custom Integration', sku: 'SVC-001', price: 1499, category: 'Services', stock: 20 },
        { id: 9, name: 'Training Session', sku: 'TRN-001', price: 399, category: 'Services', stock: 50 },
        { id: 10, name: 'Annual Maintenance', sku: 'MNT-001', price: 799, category: 'Services', stock: 100 },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const newTab = getInitialTab();
    setActiveTab(newTab);
    fetchProducts();
  }, [path]);
  
  useEffect(() => {
    searchRef.current?.focus();
    setOrderNumber(`ORD-${Date.now().toString().slice(-6)}`);
  }, []);
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  
  const removeFromCart = (productId) => {
    const existing = cart.find(item => item.id === productId);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(item => 
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== productId));
    }
  };
  
  const removeItem = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };
  
  const clearCart = () => {
    setCart([]);
    setCustomer(null);
    setAppliedDiscount(0);
    setOrderNumber(`ORD-${Date.now().toString().slice(-6)}`);
  };
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const discount = () => {
    if (discountType === 'percentage') {
      return subtotal * (appliedDiscount / 100);
    }
    return appliedDiscount;
  };
  
  const tax = (subtotal - discount()) * 0.1;
  const total = subtotal - discount() + tax;
  
  const change = () => {
    const cash = parseFloat(cashReceived) || 0;
    return cash - total;
  };
  
  const applyDiscount = () => {
    if (discountValue > 0) {
      setAppliedDiscount(discountType === 'percentage' ? discountValue : discountValue);
    }
  };
  
  const processPayment = () => {
    if (paymentMethod === 'cash' && change() < 0) {
      alert('Insufficient cash received');
      return;
    }
    
    const order = {
      orderNumber,
      date: new Date().toISOString(),
      customer,
      items: cart,
      subtotal,
      discount: discount(),
      tax,
      total,
      paymentMethod,
      cashReceived: parseFloat(cashReceived) || total,
      change: change(),
      status: 'completed'
    };
    
    setReceipt(order);
    setLastOrder(order);
    setShowPaymentModal(false);
    setShowReceiptModal(true);
    
    setCart([]);
    setCustomer(null);
    setAppliedDiscount(0);
    setCashReceived('');
    setOrderNumber(`ORD-${Date.now().toString().slice(-6)}`);
  };
  
  const printReceipt = () => {
    window.print();
  };
  
  return (
    <Layout>
      {activeTab === 'transactions' ? (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Transactions</h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>View and manage all sales transactions</p>
            </div>
          </div>
          
          <div className={`rounded-2xl border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Order #</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Date</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Customer</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Items</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Total</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Payment</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {transactions.map((txn, idx) => (
                    <tr key={txn.id} className={`transition-colors ${idx % 2 === 0 ? (isDark ? 'bg-slate-900/50' : 'bg-white') : (isDark ? 'bg-slate-800/20' : 'bg-slate-50/50')}`}>
                      <td className={`px-5 py-4 font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{txn.orderNumber}</td>
                      <td className={`px-5 py-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{txn.date}</td>
                      <td className={`px-5 py-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{txn.customer}</td>
                      <td className={`px-5 py-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{txn.items}</td>
                      <td className={`px-5 py-4 font-semibold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>{formatCurrency(txn.total)}</td>
                      <td className={`px-5 py-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${txn.payment === 'card' ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'}`}>
                          {txn.payment}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          txn.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                          txn.status === 'refunded' ? 'bg-red-500/20 text-red-500' :
                          'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
      <div className="flex h-[calc(100vh-4rem)] -m-6">
        {/* Left Panel - Products */}
        <div className={`flex-1 flex flex-col ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
          {/* Header */}
          <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Point of Sale</h1>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${onlineStatus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {onlineStatus ? <Wifi size={12} /> : <WifiOff size={12} />}
                  {onlineStatus ? 'Online' : 'Offline'}
                </div>
              </div>
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search products by name or scan barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'border-slate-300'}`}
                />
              </div>
              <Barcode size={20} className="text-slate-400" />
            </div>
            
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'bg-primary-500 text-white' 
                      : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className={`p-4 rounded-xl border text-left transition-all hover:shadow-lg ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 hover:border-primary-500' 
                      : 'bg-white border-slate-200 hover:border-primary-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Package size={20} className="text-primary-500" />
                    <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                      {product.category}
                    </span>
                  </div>
                  <p className={`font-medium text-sm mb-1 line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {product.name}
                  </p>
                  <p className={`text-lg font-bold text-primary-500`}>{formatCurrency(product.price)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Panel - Cart */}
        <div className={`w-[400px] flex flex-col border-l ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
          {/* Cart Header */}
          <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-primary-500" />
                <h2 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Current Sale</h2>
              </div>
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>#{orderNumber}</span>
            </div>
            
            {/* Customer Button */}
            <button
              onClick={() => setShowCustomerModal(true)}
              className={`w-full flex items-center gap-2 p-2 rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
            >
              <User size={16} className="text-slate-400" />
              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                {customer ? `${customer.name}` : 'Select Customer (Optional)'}
              </span>
            </button>
          </div>
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <ShoppingCart size={48} className="mb-4 opacity-50" />
                <p>No items in cart</p>
                <p className="text-sm">Search and add products</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex-1">
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.name}</p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{formatCurrency(item.price)} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={`p-1 rounded ${isDark ? 'bg-slate-700' : 'bg-white'}`}
                      >
                        <Minus size={14} />
                      </button>
                      <span className={`w-8 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className={`p-1 rounded ${isDark ? 'bg-slate-700' : 'bg-white'}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded text-red-500 hover:bg-red-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Cart Footer */}
          <div className={`p-4 border-t space-y-3 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            {/* Discount */}
            <div className="flex gap-2">
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className={`px-2 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'border-slate-300'}`}
              >
                <option value="percentage">%</option>
                <option value="fixed">$</option>
              </select>
              <input
                type="number"
                placeholder="Discount"
                value={discountValue}
                onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'border-slate-300'}`}
              />
              <button
                onClick={applyDiscount}
                className={`px-3 py-2 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
              >
                <Percent size={16} />
              </button>
            </div>
            
            {/* Totals */}
            <div className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount())}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className={`flex justify-between text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span>Total</span>
                <span className="text-primary-500">{formatCurrency(total)}</span>
              </div>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className={`flex-1 py-3 rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={cart.length === 0}
                className={`flex-1 py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50`}
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
        </div>
      )}
      
      {/* Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`w-[500px] rounded-xl ${isDark ? 'bg-slate-900' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Select Customer</h2>
              <button onClick={() => setShowCustomerModal(false)}><X size={20} /></button>
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              className={`w-full px-4 py-2 rounded-lg border mb-4 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'border-slate-300'}`}
            />
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {[
                { id: 1, name: 'Acme Corp', email: 'contact@acme.com' },
                { id: 2, name: 'Tech Solutions', email: 'contact@techsol.com' },
                { id: 3, name: 'Global Tech', email: 'contact@globaltech.com' },
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => { setCustomer(c); setShowCustomerModal(false); }}
                  className={`w-full p-3 rounded-lg text-left ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'}`}
                >
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.name}</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{c.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`w-[500px] rounded-xl ${isDark ? 'bg-slate-900' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Payment</h2>
              <button onClick={() => setShowPaymentModal(false)}><X size={20} /></button>
            </div>
            
            <div className="text-center mb-6">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Amount</p>
              <p className={`text-4xl font-bold text-primary-500`}>{formatCurrency(total)}</p>
            </div>
            
            {/* Payment Methods */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-lg border text-center ${paymentMethod === 'cash' ? 'border-primary-500 bg-primary-500/10' : ''}`}
              >
                <DollarSign size={24} className="mx-auto mb-2" />
                <span className={isDark ? 'text-white' : 'text-slate-900'}>Cash</span>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-lg border text-center ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-500/10' : ''}`}
              >
                <CreditCard size={24} className="mx-auto mb-2" />
                <span className={isDark ? 'text-white' : 'text-slate-900'}>Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod('both')}
                className={`p-4 rounded-lg border text-center ${paymentMethod === 'both' ? 'border-primary-500 bg-primary-500/10' : ''}`}
              >
                <Calculator size={24} className="mx-auto mb-2" />
                <span className={isDark ? 'text-white' : 'text-slate-900'}>Split</span>
              </button>
            </div>
            
            {paymentMethod === 'cash' && (
              <div className="mb-4">
                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Cash Received</label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border text-2xl ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'border-slate-300'}`}
                  placeholder="0.00"
                />
                <div className="flex gap-2 mt-2">
                  {[10, 20, 50, 100].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setCashReceived(amt.toString())}
                      className={`flex-1 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                {parseFloat(cashReceived) > 0 && (
                  <div className={`mt-2 text-center ${change() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    Change: {formatCurrency(change())}
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={processPayment}
              disabled={paymentMethod === 'cash' && change() < 0}
              className={`w-full py-4 rounded-lg font-bold text-lg ${
                paymentMethod === 'cash' && change() < 0
                  ? 'bg-slate-300 text-slate-500'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              Complete Sale
            </button>
          </div>
        </div>
      )}
      
      {/* Receipt Modal */}
      {showReceiptModal && receipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`w-[400px] rounded-xl ${isDark ? 'bg-slate-900' : 'bg-white'} p-6`}>
            <div className="text-center mb-6">
              <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Payment Successful</h2>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Order #{receipt.orderNumber}</p>
            </div>
            
            {/* Receipt */}
            <div className={`border rounded-lg p-4 mb-6 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="text-center border-b pb-4 mb-4">
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>JenQ ERP</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Thank you for your purchase!</p>
              </div>
              
              {receipt.items.map(item => (
                <div key={item.id} className="flex justify-between py-1 text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              
              <div className={`border-t pt-2 mt-2 space-y-1 text-sm`}>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(receipt.subtotal)}</span>
                </div>
                {receipt.discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>-{formatCurrency(receipt.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(receipt.tax)}</span>
                </div>
                <div className={`flex justify-between font-bold text-lg pt-2 border-t`}>
                  <span>Total</span>
                  <span className="text-primary-500">{formatCurrency(receipt.total)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={printReceipt}
                className={`flex-1 py-3 rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}
              >
                <Printer size={16} className="inline mr-2" />
                Print
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 py-3 rounded-lg bg-primary-500 text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default POS;