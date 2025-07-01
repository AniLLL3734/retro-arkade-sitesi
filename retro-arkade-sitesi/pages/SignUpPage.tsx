
import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Button from '../components/Button';
import { UserPlus, Gamepad2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const SignUpPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();
    const { session } = useAuth();

    if (session) {
        navigate('/');
    }

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                    }
                }
            });

            if (error) throw error;
            if (data.user?.identities?.length === 0) {
                 setError("This user already exists. Please try logging in.");
            } else {
                 setSuccess("Success! Please check your email to confirm your account.");
            }
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
                    <h2 className="mt-4 text-2xl font-bold text-slate-700">Create Your Account</h2>
                    <p className="text-slate-500">Join the community and start saving your scores!</p>
                </div>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"><p>{error}</p></div>}
                {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert"><p>{success}</p></div>}

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="sr-only">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-arkade-orange focus:border-arkade-orange"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
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
                            autoComplete="new-password"
                            required
                            minLength={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-arkade-orange focus:border-arkade-orange"
                            placeholder="Password (min. 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <Button type="submit" className="w-full" disabled={loading || !!success}>
                            <UserPlus className="h-5 w-5 mr-2" />
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </div>
                </form>
                
                <p className="text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-arkade-blue hover:text-arkade-orange">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
