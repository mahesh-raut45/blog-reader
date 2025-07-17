import { getAllPosts } from "@/lib/getBlogPosts";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  const posts = getAllPosts();

  return (
    <>
      <main className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">📚 Blog Posts</h1>

        <ul className="space-y-4">
          {posts.map((post: any) => (
            <li key={post.slug} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">
                <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-600">{post.date}</p>
              <p className="mt-2">{post.summary}</p>
            </li>
          ))}
        </ul>
      </main>

    </>

  );
}
