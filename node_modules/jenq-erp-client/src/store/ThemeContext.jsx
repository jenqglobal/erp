import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', country: 'United States' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', country: 'European Union' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', country: 'United Kingdom' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', country: 'India' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', country: 'Japan' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', country: 'China' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', country: 'Australia' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [animations, setAnimations] = useState(() => {
    return localStorage.getItem('animations') !== 'false';
  });

  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('currency');
    return saved || 'USD';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('animations', animations);
  }, [animations]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setThemeMode = (mode) => {
    setTheme(mode);
  };

  const toggleAnimations = () => {
    setAnimations(prev => !prev);
  };

  const setCurrencyCode = (code) => {
    setCurrency(code);
  };

  const formatCurrency = (value) => {
    const curr = currencies.find(c => c.code === currency) || currencies[0];
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr.code,
      minimumFractionDigits: curr.code === 'JPY' ? 0 : 2,
      maximumFractionDigits: curr.code === 'JPY' ? 0 : 2,
    }).format(value);
    return formatted;
  };

  const getCurrencySymbol = () => {
    const curr = currencies.find(c => c.code === currency);
    return curr ? curr.symbol : '$';
  };

const value = {
    theme,
    themeMode: theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    animations,
    toggleTheme,
    setThemeMode,
    toggleAnimations,
    currency,
    setCurrencyCode,
    formatCurrency,
    getCurrencySymbol,
    currencies
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;