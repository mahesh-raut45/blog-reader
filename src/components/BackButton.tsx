"use client";

import { useRouter } from 'next/navigation'
import React from 'react'


const BackButton = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push('/');
    }

    return (
        <button
            onClick={handleClick}
            className="mt-10 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
            ⬅ Back to Home
        </button>
    )
}

export default BackButton