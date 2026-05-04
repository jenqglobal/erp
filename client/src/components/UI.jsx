import { X } from 'lucide-react';
import { useTheme } from '../store/ThemeContext';

export const Modal = ({ isOpen, onClose, title, children, size = 'md', showHeader = true }) => {
  const { isDark } = useTheme();
  
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full rounded-xl shadow-2xl animate-in fade-in zoom-in-95 ${
          isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
        } border ${sizeClasses[size]}`}>
          {showHeader && title && (
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
              <button 
                onClick={onClose}
                className={`p-1 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-400'
                }`}
              >
                <X size={20} />
              </button>
            </div>
          )}
          {(!showHeader || !title) && (
            <button 
              onClick={onClose}
              className={`absolute top-4 right-4 p-1 rounded-lg transition-colors z-10 ${
                isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-400'
              }`}
            >
              <X size={20} />
            </button>
          )}
          <div className={showHeader && title ? 'px-6 py-4' : 'p-6'}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Card = ({ children, className = '', title, action, subtitle }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`rounded-xl shadow-sm border transition-all duration-300 ${
      isDark 
        ? 'bg-slate-900 border-slate-700' 
        : 'bg-white border-slate-200'
    } ${className}`}>
      {(title || action) && (
        <div className={`px-4 py-3 border-b flex items-center justify-between ${
          isDark ? 'border-slate-700' : 'border-slate-100'
        }`}>
          <div>
            {title && <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

export const StatCard = ({ title, value, icon: Icon, trend, trendUp, color = 'primary' }) => {
  const { isDark } = useTheme();
  
  const colors = {
    primary: {
      bg: 'bg-gradient-to-br from-primary-500 to-primary-600',
      text: 'text-white shadow-primary-500/30'
    },
    accent: {
      bg: 'bg-gradient-to-br from-accent-500 to-accent-600',
      text: 'text-white shadow-accent-500/30'
    },
    warning: {
      bg: 'bg-gradient-to-br from-amber-500 to-amber-600',
      text: 'text-white shadow-amber-500/30'
    },
    danger: {
      bg: 'bg-gradient-to-br from-red-500 to-red-600',
      text: 'text-white shadow-red-500/30'
    },
    platinum: {
      bg: 'bg-gradient-to-br from-premium-platinum to-indigo-600',
      text: 'text-white shadow-premium-platinum/30'
    },
    gold: {
      bg: 'bg-gradient-to-br from-premium-gold to-yellow-600',
      text: 'text-white shadow-premium-gold/30'
    }
  };
  
  const colorStyle = colors[color] || colors.primary;
  
  return (
    <div className={`rounded-xl shadow-sm border transition-all duration-300 hover:shadow-lg ${
      isDark 
        ? 'bg-slate-900 border-slate-700' 
        : 'bg-white border-slate-200'
    }`}>
      <div className="p-4 flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trendUp ? 'text-accent-500' : 'text-red-500'}`}>
              {trendUp ? '↑' : '↓'}{trend}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorStyle.bg} shadow-lg ${colorStyle.text}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export const DataTable = ({ columns, data, actions, onSort, sortBy, sortOrder }) => {
  const { isDark } = useTheme();
  
  return (
    <div className="overflow-x-auto rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
            {columns.map(col => (
              <th 
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                } ${col.sortable ? 'cursor-pointer hover:bg-slate-100' : ''}`}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable && sortBy === col.key && (
                    <span className="text-primary-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
            {actions && <th className="text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className={isDark ? 'divide-slate-700' : 'divide-slate-100'}>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8 text-slate-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || idx} className={`transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                {columns.map(col => (
                  <td key={col.key} className={`px-4 py-3 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="text-right">{actions(row)}</td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`flex items-center justify-between px-4 py-3 border-t ${
      isDark ? 'border-slate-700' : 'border-slate-200'
    }`}>
      <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`px-3 py-1 rounded border text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isDark 
              ? 'border-slate-600 text-slate-300 hover:bg-slate-800' 
              : 'border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-3 py-1 rounded border text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isDark 
              ? 'border-slate-600 text-slate-300 hover:bg-slate-800' 
              : 'border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const Tabs = ({ tabs, activeTab, onChange }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`flex gap-1 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
            activeTab === tab.key
              ? 'border-primary-500 text-primary-600'
              : `border-transparent ${isDark ? 'text-slate-400' : 'text-slate-500'} hover:${isDark ? 'text-slate-200' : 'text-slate-700'}`
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.key 
                ? 'bg-primary-100 text-primary-600' 
                : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export const Badge = ({ children, variant = 'default' }) => {
  const { isDark } = useTheme();
  
  const variants = {
    default: isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-accent-100 text-accent-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    premium: 'bg-gradient-to-r from-premium-gold to-yellow-500 text-white'
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

export const EmptyState = ({ icon: Icon, title, description, action }) => {
  const { isDark } = useTheme();
  
  return (
    <div className="text-center py-12">
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
        isDark ? 'bg-slate-800' : 'bg-slate-100'
      }`}>
        <Icon size={32} className="text-slate-400" />
      </div>
      <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const { isDark, animations } = useTheme();
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg',
    secondary: isDark 
      ? 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600' 
      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: isDark 
      ? 'bg-transparent text-slate-300 hover:bg-slate-800' 
      : 'bg-transparent text-slate-600 hover:bg-slate-100',
    premium: 'bg-gradient-to-r from-premium-gold to-yellow-500 text-white hover:from-yellow-600 hover:to-yellow-600'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button 
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ${
        animations ? 'hover:scale-105 active:scale-95' : ''
      } ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, error, ...props }) => {
  const { isDark } = useTheme();
  
  return (
    <div className="space-y-1">
      {label && <label className={`label ${isDark ? 'text-slate-300' : ''}`}>{label}</label>}
      <input 
        className={`input ${error ? 'input-error' : ''} ${isDark ? 'bg-slate-800 border-slate-600 text-white' : ''}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export const Select = ({ label, error, children, ...props }) => {
  const { isDark } = useTheme();
  
  return (
    <div className="space-y-1">
      {label && <label className={`label ${isDark ? 'text-slate-300' : ''}`}>{label}</label>}
      <select 
        className={`input ${error ? 'input-error' : ''} ${isDark ? 'bg-slate-800 border-slate-600 text-white' : ''}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export const Textarea = ({ label, error, ...props }) => {
  const { isDark } = useTheme();
  
  return (
    <div className="space-y-1">
      {label && <label className={`label ${isDark ? 'text-slate-300' : ''}`}>{label}</label>}
      <textarea 
        className={`input ${error ? 'input-error' : ''} ${isDark ? 'bg-slate-800 border-slate-600 text-white' : ''}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};