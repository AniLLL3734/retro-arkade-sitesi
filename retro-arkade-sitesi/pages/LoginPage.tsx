
import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Button from '../components/Button';
import { LogIn, Gamepad2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { session } = useAuth();

    if (session) {
        navigate('/');
    }

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            navigate('/');
        } catch (err: any) {
            setError(err.error_description || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-arkade-light p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 space-y-6">
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center justify-center space-x-2">
                        <Gamepad2 className="h-10 w-10 text-arkade-blue" />
                        <h1 className="text-4xl text-arkade-blue tracking-tighter">Retro Arkade</h1>
                    </Link>
                    <h2 className="mt-4 text-2xl font-bold text-slate-700">Welcome Back!</h2>
                    <p className="text-slate-500">Sign in to continue your adventure.</p>
                </div>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"><p>{error}</p></div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-arkade-orange focus:border-arkade-orange"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-arkade-orange focus:border-arkade-orange"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            <LogIn className="h-5 w-5 mr-2" />
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </div>
                </form>

                <p className="text-center text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-arkade-blue hover:text-arkade-orange">
                        Sign up now
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
