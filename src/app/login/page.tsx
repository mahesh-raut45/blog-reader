'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/slices/authSlice';

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || 'Login failed');
            return;
        } else {
            dispatch(login(data.user));
            toast.success(data.message || "Login successful");
            router.push(data.user.role === "admin" ? '/admin' : '/');
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 px-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 space-y-6">
                <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white text-center">Welcome Back</h1>
                <p className="text-sm text-center text-slate-600 dark:text-slate-400 mb-2">
                    Login to your account to continue reading and writing blogs
                </p>

                <form onSubmit={handleLogin} className="space-y-5">
                    <input
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm text-center text-slate-700 dark:text-slate-300">
                    New user?{' '}
                    <Link href="/register" className="text-blue-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </main>

    );
}
