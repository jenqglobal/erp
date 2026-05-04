import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Package, Warehouse, Truck, PackageCheck, Building, ShoppingCart, Search, Edit2, Trash2, MoreVertical, X } from 'lucide-react';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../components/Layout';
import { inventoryService } from '../services/api';

const Inventory = () => {
  const { isDark, formatCurrency } = useTheme();
  const location = useLocation();
  const path = location.pathname;
  
  const getInitialTab = () => {
    if (path.includes('/stock')) return 'stock';
    if (path.includes('/warehouses')) return 'warehouses';
    if (path.includes('/purchase')) return 'purchase';
    if (path.includes('/transfers')) return 'transfers';
    if (path.includes('/returns')) return 'returns';
    if (path.includes('/suppliers')) return 'suppliers';
    if (path.includes('/reports')) return 'reports';
    return 'products';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [returns, setReturns] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentAddType, setCurrentAddType] = useState('products');
  const [loading, setLoading] = useState(true);
  
  const [addForm, setAddForm] = useState({
    name: '', sku: '', category: '', quantity: '', min_stock: '', price: '', cost: '', warehouse: '', status: 'active'
  });
  
  const [warehouseForm, setWarehouseForm] = useState({
    name: '', location: '', capacity: '', manager: '', phone: '', email: ''
  });
  
  const [supplierForm, setSupplierForm] = useState({
    name: '', contact: '', email: '', phone: '', address: '', category: ''
  });

  useEffect(() => {
    const newTab = getInitialTab();
    setActiveTab(newTab);
    loadAllData();
  }, [path]);

  useEffect(() => {
    loadAllData();
  }, [activeTab]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const productsData = await inventoryService.getProducts();
      setProducts(productsData.products || []);
    } catch (error) {
      setProducts([
        { id: 1, name: 'Enterprise License', sku: 'ENT-001', price: 2499, cost: 1200, category: 'Software', stock: 100, min_stock: 20, warehouse: 'Main' },
        { id: 2, name: 'Professional License', sku: 'PRO-001', price: 999, cost: 500, category: 'Software', stock: 200, min_stock: 50, warehouse: 'Main' },
        { id: 3, name: 'Starter License', sku: 'STD-001', price: 299, cost: 150, category: 'Software', stock: 500, min_stock: 100, warehouse: 'Main' },
        { id: 4, name: 'Hardware Dongle', sku: 'HW-001', price: 149, cost: 75, category: 'Hardware', stock: 50, min_stock: 10, warehouse: 'Main' },
        { id: 5, name: 'USB Cable Pack', sku: 'ACC-001', price: 29, cost: 10, category: 'Accessories', stock: 300, min_stock: 50, warehouse: 'Secondary' },
      ]);
    }
    setWarehouses([
      { id: 1, name: 'Main Warehouse', location: '123 Industrial Ave', capacity: 10000, used: 3500, manager: 'John Smith', phone: '+1 555-0100', email: 'john@company.com' },
      { id: 2, name: 'Secondary Warehouse', location: '456 Commerce Blvd', capacity: 5000, used: 1200, manager: 'Jane Doe', phone: '+1 555-0200', email: 'jane@company.com' },
    ]);
    setPurchaseOrders([
      { id: 1, supplier: 'Acme Supplies', product_id: 1, quantity: 50, cost: 1200, status: 'pending', date: '2024-03-15', expected_date: '2024-03-25', total: 60000 },
      { id: 2, supplier: 'Tech Parts Inc', product_id: 4, quantity: 100, cost: 75, status: 'approved', date: '2024-03-10', expected_date: '2024-03-20', total: 7500 },
    ]);
    setTransfers([
      { id: 1, from_warehouse: 'Main Warehouse', to_warehouse: 'Secondary Warehouse', product_id: 5, quantity: 50, status: 'completed', date: '2024-03-14' },
    ]);
    setReturns([
      { id: 1, order_id: 1, product_id: 3, quantity: 2, reason: 'defective', status: 'pending', date: '2024-03-15' },
    ]);
    setSuppliers([
      { id: 1, name: 'Acme Supplies', contact: 'John Doe', email: 'john@acme.com', phone: '+1 555-1000', address: '123 Supplier St', category: 'rawMaterials' },
      { id: 2, name: 'Tech Parts Inc', contact: 'Jane Smith', email: 'jane@techparts.com', phone: '+1 555-2000', address: '456 Tech Ave', category: 'components' },
    ]);
    setLoading(false);
  };

  const handleSave = () => {
    if (currentAddType === 'products') {
      setProducts([...products, { ...addForm, id: products.length + 1 }]);
    } else if (currentAddType === 'warehouses') {
      setWarehouses([...warehouses, { ...warehouseForm, id: warehouses.length + 1, used: 0 }]);
    } else if (currentAddType === 'suppliers') {
      setSuppliers([...suppliers, { ...supplierForm, id: suppliers.length + 1 }]);
    }
    setShowAddModal(false);
    setAddForm({ name: '', sku: '', category: '', quantity: '', min_stock: '', price: '', cost: '', warehouse: '', status: 'active' });
    setWarehouseForm({ name: '', location: '', capacity: '', manager: '', phone: '', email: '' });
    setSupplierForm({ name: '', contact: '', email: '', phone: '', address: '', category: '' });
  };

  const iconMap = {
    products: Package,
    warehouses: Warehouse,
    purchase: ShoppingCart,
    transfers: Truck,
    returns: PackageCheck,
    suppliers: Building
  };
  
  const titleMap = {
    products: 'Add New Product',
    warehouses: 'Add New Warehouse',
    suppliers: 'Add New Supplier'
  };

  if (showAddModal) {
    return (
      <Layout>
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className={`relative w-full max-w-xl rounded-2xl shadow-2xl border animate-in zoom-in-95 duration-200 ${
              isDark ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className={`relative px-6 py-5 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-r from-primary-500/10 to-accent-500/5" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                      {(() => { const Icon = iconMap[currentAddType] || Package; return <Icon size={20} className="text-white" />; })()}
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{titleMap[currentAddType]}</h2>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Fill in the details below</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}>
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-5">
                {currentAddType === 'products' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Product Name</label>
                      <input type="text" placeholder="Enterprise License" value={addForm.name}
                        onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                          isDark ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`} />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>SKU</label>
                      <input type="text" placeholder="PRD-001" value={addForm.sku}
                        onChange={(e) => setAddForm({...addForm, sku: e.target.value})}
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                          isDark ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`} />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Category</label>
                      <input type="text" placeholder="Software" value={addForm.category}
                        onChange={(e) => setAddForm({...addForm, category: e.target.value})}
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                          isDark ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`} />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Price ($)</label>
                      <input type="number" placeholder="2499" value={addForm.price}
                        onChange={(e) => setAddForm({...addForm, price: e.target.value})}
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                          isDark ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`} />
                    </div>
                  </div>
                )}
                
                {currentAddType === 'warehouses' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Warehouse Name</label>
                      <input type="text" placeholder="Main Warehouse" value={warehouseForm.name}
                        onChange={(e) => setWarehouseForm({...warehouseForm, name: e.target.value})}
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                          isDark ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`} />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Location</label>
                      <input type="text" placeholder="123 Industrial Ave" value={warehouseForm.location}
                        onChange={(e) => setWarehouseForm({...warehouseForm, location: e.target.value})}
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                          isDark ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`} />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Capacity</label>
                      <input type="number" placeholder="10000" value={warehouseForm.capacity}
                        onChange={(e) => setWarehouseForm({...warehouseForm, capacity: e.target.value})}
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                          isDark ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`} />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Manager Name</label>
                      <input type="text" placeholder="John Smith" value={warehouseForm.manager}
                        onChange={(e) => setWarehouseForm({...warehouseForm, manager: e.target.value})}
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                          isDark ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`} />
                    </div>
                  </div>
                )}
                
                {currentAddType === 'suppliers' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Supplier Name</label>
                      <input type="text" placeholder="Acme Supplies" value={supplierForm.name}
                        onChange={(e) => setSupplierForm({...supplierForm, name: e.target.value})}
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                          isDark ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`} />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Contact Person</label>
                      <input type="text" placeholder="John Doe" value={supplierForm.contact}
                        onChange={(e) => setSupplierForm({...supplierForm, contact: e.target.value})}
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                          isDark ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`} />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email</label>
                      <input type="email" placeholder="contact@supplier.com" value={supplierForm.email}
                        onChange={(e) => setSupplierForm({...supplierForm, email: e.target.value})}
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                          isDark ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`} />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Phone</label>
                      <input type="text" placeholder="+1 555-0100" value={supplierForm.phone}
                        onChange={(e) => setSupplierForm({...supplierForm, phone: e.target.value})}
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                          isDark ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`} />
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <button onClick={() => setShowAddModal(false)} className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${
                  isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'
                }`}>Cancel</button>
                <button onClick={() => handleSave()} className="px-6 py-2.5 rounded-xl font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02]">
                  Save {currentAddType.charAt(0).toUpperCase() + currentAddType.slice(1)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Inventory</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage products, stock, and suppliers</p>
          </div>
        </div>
        
        {loading ? (
          <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading...</div>
        ) : (
          <>
            <div className={`flex gap-2 p-1 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'} w-fit`}>
              {['products', 'warehouses', 'purchase', 'transfers', 'returns', 'suppliers', 'reports'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30' 
                      : `${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            
            {activeTab === 'products' && (
              <div className={`rounded-2xl border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                      <Package size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Products</h2>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{products.length} items in inventory</p>
                    </div>
                  </div>
                  <button onClick={() => { setCurrentAddType('products'); setShowAddModal(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02]">
                    <Plus size={18} /> Add Product
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                      <tr>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase tracking-wider' : 'text-slate-500 uppercase tracking-wider'}`}>Product</th>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase tracking-wider' : 'text-slate-500 uppercase tracking-wider'}`}>SKU</th>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase tracking-wider' : 'text-slate-500 uppercase tracking-wider'}`}>Category</th>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase tracking-wider' : 'text-slate-500 uppercase tracking-wider'}`}>Stock</th>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase tracking-wider' : 'text-slate-500 uppercase tracking-wider'}`}>Price</th>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase tracking-wider' : 'text-slate-500 uppercase tracking-wider'}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {products.map((product, idx) => (
                        <tr key={product.id} className={`transition-colors ${idx % 2 === 0 ? (isDark ? 'bg-slate-900/50' : 'bg-white') : (isDark ? 'bg-slate-800/20' : 'bg-slate-50/50')}`}>
                          <td className={`px-5 py-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{product.name}</td>
                          <td className={`px-5 py-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{product.sku}</td>
                          <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{product.category}</span></td>
                          <td className={`px-5 py-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{product.stock}</td>
                          <td className={`px-5 py-4 ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>{formatCurrency(product.price)}</td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}>
                                <Edit2 size={16} />
                              </button>
                              <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-red-400' : 'hover:bg-slate-100 text-red-500'}`}>
                                <Trash2 size={16} />
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
            
            {activeTab === 'warehouses' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`col-span-full flex items-center justify-between p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                      <Warehouse size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Warehouses</h2>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{warehouses.length} locations</p>
                    </div>
                  </div>
                  <button onClick={() => { setCurrentAddType('warehouses'); setShowAddModal(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02]">
                    <Plus size={18} /> Add Warehouse
                  </button>
                </div>
                {warehouses.map(wh => (
                  <div key={wh.id} className={`p-5 rounded-2xl border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                        <Warehouse size={24} className="text-primary-500" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{wh.name}</h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{wh.location}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Capacity</p>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{wh.capacity.toLocaleString()}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Used</p>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{wh.used.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manager: <span className={isDark ? 'text-white' : 'text-slate-900'}>{wh.manager}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'suppliers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`col-span-full flex items-center justify-between p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg shadow-accent-500/30">
                      <Building size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Suppliers</h2>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{suppliers.length} active suppliers</p>
                    </div>
                  </div>
                  <button onClick={() => { setCurrentAddType('suppliers'); setShowAddModal(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 shadow-lg shadow-accent-500/30 transition-all hover:scale-[1.02]">
                    <Plus size={18} /> Add Supplier
                  </button>
                </div>
                {suppliers.map(s => (
                  <div key={s.id} className={`p-5 rounded-2xl border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/20 to-primary-500/20 flex items-center justify-center">
                        <Building size={24} className="text-accent-500" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{s.category}</span>
                      </div>
                    </div>
                    <div className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <p>{s.contact}</p>
                      <p>{s.email}</p>
                      <p>{s.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'purchase' && (
              <div className={`rounded-2xl border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                      <ShoppingCart size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Purchase Orders</h2>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{purchaseOrders.length} orders</p>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                      <tr>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase tracking-wider' : 'text-slate-500 uppercase tracking-wider'}`}>Supplier</th>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase tracking-wider' : 'text-slate-500 uppercase tracking-wider'}`}>Qty</th>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase tracking-wider' : 'text-slate-500 uppercase tracking-wider'}`}>Total</th>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase tracking-wider' : 'text-slate-500 uppercase tracking-wider'}`}>Status</th>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase tracking-wider' : 'text-slate-500 uppercase tracking-wider'}`}>Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {purchaseOrders.map((po, idx) => (
                        <tr key={po.id} className={`transition-colors ${idx % 2 === 0 ? (isDark ? 'bg-slate-900/50' : 'bg-white') : (isDark ? 'bg-slate-800/20' : 'bg-slate-50/50')}`}>
                          <td className={`px-5 py-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{po.supplier}</td>
                          <td className={`px-5 py-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{po.quantity}</td>
                          <td className={`px-5 py-4 ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>${po.total.toLocaleString()}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                              po.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                              po.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                              'bg-slate-500/20 text-slate-500'
                            }`}>{po.status}</span>
                          </td>
                          <td className={`px-5 py-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{po.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'transfers' && (
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                      <Truck size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Transfers</h2>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{transfers.length} transfers</p>
                    </div>
                  </div>
                </div>
                {transfers.map(t => (
                  <div key={t.id} className={`p-5 rounded-2xl border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 flex items-center justify-center">
                          <Truck size={24} className="text-primary-500" />
                        </div>
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.from_warehouse} → {t.to_warehouse}</p>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Qty: {t.quantity} • {t.date}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
                        t.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                      }`}>{t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'returns' && (
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                      <PackageCheck size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Returns</h2>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{returns.length} returns</p>
                    </div>
                  </div>
                </div>
                {returns.map(r => (
                  <div key={r.id} className={`p-5 rounded-2xl border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 flex items-center justify-center">
                          <PackageCheck size={24} className="text-red-500" />
                        </div>
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Order {r.order_id}</p>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Qty: {r.quantity} • {r.reason}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
                        r.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'
                      }`}>{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'reports' && (
              <div className={`rounded-2xl border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                      <Package size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Inventory Reports</h2>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Stock analytics and insights</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Products</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{products.length}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Stock Value</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>{formatCurrency(products.reduce((sum, p) => sum + (p.price * p.stock), 0))}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Low Stock Items</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{products.filter(p => p.stock < p.min_stock).length}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Inventory;