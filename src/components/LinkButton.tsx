'use client';
import React, { useState } from 'react'

const LikeButton = () => {
  const [likes, setLikes] = useState(0);
  return (
    <button
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      onClick={() => setLikes((prev) => prev + 1)}>
      ❤️ Like {likes}
    </button>
  )
}

export default LikeButton