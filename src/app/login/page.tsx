'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
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
        }

        // ✅ Save user data in localStorage for now
        localStorage.setItem('user', JSON.stringify(data.user));

        // 👥 Redirect based on role
        if (data.user.role === 'admin') {
            // router.push('/admin');
            toast.success("Login successful! Redirecting to admin dashboard...");
        } else {
            toast.success("Login successful! Redirecting to home page...");
            router.push('/');
        }
    };

    return (
        <main className="max-w-md mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    className="border p-2 w-full"
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
                <input
                    className="border p-2 w-full"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
                <div>
                    <p>New user? <Link href={'/register'} className="text-blue-600 underline">register</Link></p>
                </div>
            </form>
        </main>
    );
}
