"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
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

  const uniqueTags = [...new Set(allPosts.flatMap((p) => p.tags))];

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">📚 Blog Posts</h1>

      <div className="mb-6">
        <label className="mr-2 font-medium">Filter by tag:</label>
        <select
          value={tag || ''}
          onChange={handleTagChange}
          className="border px-2 py-1"
        >
          <option value="">All</option>
          {uniqueTags.map((tag) => (
            <option key={tag}>{tag}</option>
          ))}
        </select>
      </div>

      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">
              <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-600">{post.date}</p>
            <p className="mt-2">{post.summary}</p>
            <p className="text-xs text-gray-500 mt-1">Tags: {post.tags.join(', ')}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
