import { useState } from 'react';

export const FormGroup = ({ label, error, required, children, hint }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export const Input = ({ value, onChange, error, ...props }) => {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
      {...props}
    />
  );
};

export const Textarea = ({ value, onChange, error, ...props }) => {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`input min-h-[100px] resize-y ${error ? 'border-red-500' : ''}`}
      {...props}
    />
  );
};

export const Select = ({ value, onChange, options, error, placeholder, ...props }) => {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`input ${error ? 'border-red-500' : ''}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export const Checkbox = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
      />
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  );
};

export const Button = ({ children, loading, variant = 'primary', size = 'md', ...props }) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      disabled={loading || props.disabled}
      className={`${variants[variant]} ${sizes[size]} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  
  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const setError = (name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };
  
  const validate = (rules) => {
    const newErrors = {};
    let isValid = true;
    
    for (const [name, rule] of Object.entries(rules)) {
      if (rule.required && !values[name]) {
        newErrors[name] = rule.required;
        isValid = false;
      } else if (rule.pattern && !rule.pattern.test(values[name])) {
        newErrors[name] = rule.message || 'Invalid format';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  return { values, errors, handleChange, setError, reset, validate, setValues };
};