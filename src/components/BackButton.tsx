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
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-blue-600 border border-blue-500 shadow hover:bg-blue-600 hover:text-white transition-all duration-300"
        >
            ⬅ <span className="font-medium">Back to Home</span>
        </button>
    )
}

export default BackButton