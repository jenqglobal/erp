import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { Button, Input, FormGroup } from '../components/Form';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
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
          <h1 className="text-2xl font-bold text-slate-900">Welcome to JenQ ERP</h1>
          <p className="text-slate-500 mt-2">Sign in to your account to continue</p>
        </div>
        
        <div className="card p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}
            
            <FormGroup label="Email Address" required>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={setEmail}
              />
            </FormGroup>
            
            <FormGroup label="Password" required>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={setPassword}
              />
            </FormGroup>
            
            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium">
                Start free trial
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

export default Login;