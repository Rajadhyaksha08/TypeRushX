import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#05070d] p-4 text-slate-100 sm:p-6">
      <div className="box-border w-full max-w-[440px] space-y-6 rounded-2xl border border-cyan-400/20 bg-[#0a0f18] p-6 shadow-[0_0_40px_rgba(0,255,136,0.08)] sm:p-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#00ff88]">
            SYSTEM // AUTHENTICATION
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            TYPE <span className="text-[#00ff88]">⚡</span> RUSH X
          </h1>
          <p className="text-slate-400 text-sm">CREATE TRAINING ACCOUNT</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/40 text-red-300 text-sm p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-cyan-300 uppercase tracking-widest mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Speed Typer"
              className="w-full px-4 py-3 bg-[#05070d] border border-emerald-400/20 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00ff88]/60 focus:ring-2 focus:ring-[#00ff88]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-cyan-300 uppercase tracking-widest mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-3 bg-[#05070d] border border-emerald-400/20 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00ff88]/60 focus:ring-2 focus:ring-[#00ff88]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-cyan-300 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#05070d] border border-emerald-400/20 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00ff88]/60 focus:ring-2 focus:ring-[#00ff88]/20"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#00ff88] hover:bg-[#38ffaa] active:bg-emerald-400 disabled:opacity-50 text-[#05070d] font-bold rounded-xl shadow-[0_0_20px_rgba(0,255,136,0.18)] transition-colors"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#00ff88] hover:text-emerald-300 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
