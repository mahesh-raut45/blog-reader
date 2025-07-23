'use client';
import React, { useState } from 'react'

const LikeButton = () => {
  const [likes, setLikes] = useState(0);
  return (
    <button
      onClick={() => setLikes((prev) => prev + 1)}
      className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
    >
      ❤️ <span className="font-semibold">Like</span> <span>({likes})</span>
    </button>


  )
}

export default LikeButton