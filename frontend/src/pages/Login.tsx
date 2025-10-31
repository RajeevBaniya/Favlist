import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FormInput } from '@/components/ui/form-input';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setSubmitError(err.response.data.error);
      } else {
        setSubmitError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-blue-100">
      {/* Decorative background elements */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* gradient blobs */}
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-400/50 to-purple-400/50 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-blue-400/50 to-cyan-400/50 blur-3xl" />
        {/* subtle grid / 3d card */}
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 rotate-12 rounded-2xl bg-white/40 shadow-2xl shadow-indigo-200/40 ring-1 ring-white/60 backdrop-blur-2xl" style={{ width: '640px', height: '380px' }} />
        <div className="absolute left-[10%] top-[20%] -rotate-12 rounded-xl bg-white/30 shadow-xl ring-1 ring-white/50 backdrop-blur-xl" style={{ width: '220px', height: '140px' }} />
        <div className="absolute right-[8%] bottom-[12%] rotate-[18deg] rounded-xl bg-white/30 shadow-xl ring-1 ring-white/50 backdrop-blur-xl" style={{ width: '200px', height: '120px' }} />
        {/* themed movie/tv badges */}
        <div className="absolute left-[6%] top-[58%] grid place-items-center text-5xl opacity-30">🎬</div>
        <div className="absolute right-[12%] top-[18%] grid place-items-center text-5xl opacity-30">📺</div>
        <div className="absolute left-[42%] bottom-[8%] grid place-items-center text-5xl opacity-30">🎞️</div>
      </div>

      <header className="relative px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white grid place-items-center shadow-lg shadow-indigo-300/40">🎬</div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight">Favlist</span>
          </div>
          {/* Removed top-right Create account link as requested */}
        </div>
      </header>
      <div className="relative px-4 sm:px-6 lg:px-8 pb-12">
        <div className="w-full max-w-md mx-auto">
          <div className="relative">
            <div aria-hidden className="absolute -inset-4 rounded-3xl bg-black/5 blur-xl" />
            <div className="relative rounded-2xl border border-white/60 bg-white/70 p-6 sm:p-8 shadow-2xl shadow-indigo-200/60 ring-1 ring-black/5 backdrop-blur-2xl">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Sign in to manage your favorite movies & TV shows
              </p>
            </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {submitError}
              </div>
            )}

            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@example.com"
              required
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              required
            />

            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 text-base bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-200">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

