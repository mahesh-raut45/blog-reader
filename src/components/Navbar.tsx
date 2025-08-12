"use client";
import { logoutUser } from "@/actions/logoutAction";
import { logout } from "@/redux/slices/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiEdit, FiLogIn, FiLogOut, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar() {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        dispatch(logout());
        router.push('/login');
    };

    if (!hasMounted) {
        return null; // solves the hydration error
    }



    return (
        <nav className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <Link href="/" className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                        {user ? "MyBlogSpace" : "Welcome to BlogVerse"}
                    </Link>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                {user.role !== "admin" ?
                                    <Link
                                        href="/create"
                                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                                    >
                                        <FiEdit className="text-sm" />
                                        <span>Create Post</span>
                                    </Link> :
                                    <Link
                                        href="/admin"
                                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                                    >
                                        <FiEdit className="text-sm" />
                                        <span>Admin Dashboard</span>
                                    </Link>
                                }

                                <span className="text-sm bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white px-3 py-1 rounded-full">
                                    <FiUser className="inline-block mr-1" />
                                    {user.username}
                                </span>

                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                                >
                                    <FiLogOut className="text-sm" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                <FiLogIn className="text-sm" />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
