'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user', // default role
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        // console.log(data);

        if (res.ok) {
            toast.success("Registration successful! Redirecting to login...");
            setTimeout(() => {
                router.push('/login');
            }, 1000);
        } else {
            setError(data.message || "Registration failed. Please try again.");
            // toast.error(data.message || "Registration failed. Please try again.");
        }
    };

    return (
        <main className="max-w-md mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="border p-2 w-full"
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                // required
                />
                <input
                    className="border p-2 w-full"
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                // required
                />
                <input
                    className="border p-2 w-full"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                // required
                />
                <select name="role" onChange={handleChange} className="border p-2 w-full">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
                <div>
                    <p>Already have an accound? <Link href={'/login'} className="text-blue-600 underline">login</Link></p>
                </div>
            </form>
        </main>
    );
}
