'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as YUP from 'yup';

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            role: 'user',
        },
        validationSchema: YUP.object({
            username: YUP.string()
                .matches(/^[A-Za-z]{3,}$/, 'Username must be at least 3 letters and contain no numbers')
                .required('Username is required'),

            email: YUP.string()
                .email('Invalid email address')
                .matches(
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    'Invalid email format'
                )
                .required('Email is required'),

            password: YUP.string()
                .min(6, 'Password must be at least 6 characters')
                .matches(/[A-Za-z]/, 'Must contain at least one letter')
                .matches(/\d/, 'Must contain at least one number')
                .required('Password is required'),
        }),
        onSubmit: async (values) => {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(values),
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
        }
    })

    // const [formData, setFormData] = useState({

    // });


    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     setFormData({ ...formData, [e.target.name]: e.target.value });
    // };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     const res = await fetch('/api/auth/register', {
    //         method: 'POST',
    //         body: JSON.stringify(formData),
    //     });
    //     const data = await res.json();
    //     // console.log(data);

    //     if (res.ok) {
    //         toast.success("Registration successful! Redirecting to login...");
    //         setTimeout(() => {
    //             router.push('/login');
    //         }, 1000);
    //     } else {
    //         setError(data.message || "Registration failed. Please try again.");
    //         // toast.error(data.message || "Registration failed. Please try again.");
    //     }
    // };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 px-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 space-y-6">
                <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white text-center">Create an Account</h1>
                <p className="text-sm text-center text-slate-600 dark:text-slate-400 mb-2">
                    Join the community and start writing your own blogs!
                </p>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <input
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />

                    {formik.touched.username && formik.errors.username && (
                        <p className='text-red-500 text-sm'>{formik.errors.username}</p>
                    )}

                    <input
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className='text-red-500 text-sm'>{formik.errors.email}</p>
                    )}
                    <input
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />

                    {formik.touched.password && formik.errors.password && (
                        <p className='text-red-500 text-sm'>{formik.errors.password}</p>
                    )}

                    <select
                        name="role"
                        onChange={formik.handleChange}
                        value={formik.values.role}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"

                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
                    >
                        Register
                    </button>
                </form>

                <p className="text-sm text-center text-slate-700 dark:text-slate-300">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </main>

    );
}
