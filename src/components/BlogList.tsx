'use client';

import { useState } from 'react';
import Link from 'next/link';

type BlogPost = {
    slug: string;
    title: string;
    date: string;
};

export default function BlogList({ posts }: { posts: BlogPost[] }) {
    const [search, setSearch] = useState('');

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Search posts..."
                className="w-full p-2 border rounded mb-6"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <ul className="space-y-6">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <li key={post.slug} className="border-b pb-4">
                            <Link href={`/blog/${post.slug}`} className="text-xl text-blue-600 hover:underline">
                                {post.title}
                            </Link>
                            <p className="text-sm text-gray-500">{post.date}</p>
                        </li>
                    ))
                ) : (
                    <p>No posts found.</p>
                )}
            </ul>
        </div>
    );
}
