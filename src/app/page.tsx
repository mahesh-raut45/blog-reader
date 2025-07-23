"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


type Post = {
  id: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  image?: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const tag = searchParams.get('tag');


  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setAllPosts(data);
      setPosts(tag ? data.filter((p: Post) => p.tags.includes(tag)) : data);
    }
    fetchPosts();
    // console.log("Posts fetched:", allPosts);
  }, []);

  //filtering post based on tag
  useEffect(() => {
    if (!allPosts.length) return;
    if (tag) {
      const filteredPosts = allPosts.filter((post) => post.tags.includes(tag));
      setPosts(filteredPosts);
    } else {
      setPosts(allPosts);
    }
  }, [tag]);

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = e.target.value;
    router.push(selectedTag ? `/?tag=${selectedTag}` : '/');
  };

  console.log("All posts: ", allPosts);

  const uniqueTags = [...new Set(allPosts.flatMap((p) => Array.isArray(p.tags) ? p.tags : []))];


  return (
    <main className="max-w-7xl mx-auto py-10 px-4">
      <div className="relative w-full h-64 md:h-80 mb-8 rounded-2xl overflow-hidden shadow-lg">
        <Image
          src="/home_background.jpg"
          alt="Home Background"
          fill
          className="object-cover brightness-75 blur-sm"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md">
            Dive Into Thoughtful Blogs
          </h1>
        </div>
      </div>

      <div className="mb-8">
        <label className="mr-2 font-semibold text-slate-700 dark:text-white">
          Filter by Tag:
        </label>
        <select
          value={tag || ''}
          onChange={handleTagChange}
          className="border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">All</option>
          {uniqueTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <li
            key={post.id}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow hover:shadow-md transition overflow-hidden"
          >
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white line-clamp-2">
                {post.title}
              </h2>
              {post.tags?.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Tags: {post.tags.join(', ')}
                </p>
              )}

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <Link
                href={`/blog/${post.id}`}
                className="text-blue-600 dark:text-blue-400 font-medium text-sm mt-4 inline-block hover:underline"
              >
                Read more →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>

  );
}
