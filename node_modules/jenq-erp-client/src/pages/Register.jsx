import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { Button, Input, FormGroup, Select } from '../components/Form';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      await register(form.name, form.email, form.password, form.companyName);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500 mb-4">
            <span className="text-3xl font-bold text-white">J</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Start Your Free Trial</h1>
          <p className="text-slate-500 mt-2">Get started with JenQ ERP in just 2 minutes</p>
        </div>
        
        <div className="card p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}
            
            <FormGroup label="Full Name" required>
              <Input
                type="text"
                placeholder="John Smith"
                value={form.name}
                onChange={v => handleChange('name', v)}
              />
            </FormGroup>
            
            <FormGroup label="Work Email" required>
              <Input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={v => handleChange('email', v)}
              />
            </FormGroup>
            
            <FormGroup label="Company Name" required>
              <Input
                type="text"
                placeholder="Acme Inc."
                value={form.companyName}
                onChange={v => handleChange('companyName', v)}
              />
            </FormGroup>
            
            <FormGroup label="Password" required hint="At least 6 characters">
              <Input
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={v => handleChange('password', v)}
              />
            </FormGroup>
            
            <FormGroup label="Confirm Password" required>
              <Input
                type="password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={v => handleChange('confirmPassword', v)}
              />
            </FormGroup>
            
            <Button type="submit" loading={loading} className="w-full">
              Start Free Trial
            </Button>
          </form>
          
          <p className="text-xs text-slate-500 mt-4 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;