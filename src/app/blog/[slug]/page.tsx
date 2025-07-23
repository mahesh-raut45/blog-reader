import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import LikeButton from '@/components/LinkButton';
import BackButton from '@/components/BackButton';

export const runtime = 'nodejs';

type Props = {
    params: {
        slug: string;
    };
};

type Post = {
    id: string;
    title: string;
    content: string;
    autherEmail: string;
    date: string;
    tags?: string[];
    image?: string;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const filePath = path.join(process.cwd(), 'src/data/posts.json');

    if (!fs.existsSync(filePath)) return { title: 'Post Not Found' };

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const posts: Post[] = JSON.parse(fileContent);

    const post = posts.find((p) => p.id === params.slug);

    return {
        title: post?.title || 'Post Not Found',
    };
}

// 🧾 Actual blog post page
export default async function BlogPost(props: Props) {
    const slug = props.params.slug;
    const filePath = path.join(process.cwd(), 'src/data/posts.json');

    // 1. Check if file exists
    if (!fs.existsSync(filePath)) {
        notFound(); // show 404 if not found
    }

    // 2. Read and parse
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const posts: Post[] = JSON.parse(fileContent);

    const post = posts.find((p) => p.id === slug);

    if (!post) notFound();

    return (
        <main className="max-w-3xl mx-auto py-10 px-4">
            {/* Blog Title */}
            <h1 className="text-4xl font-bold text-slate-900 mb-2 leading-tight dark:text-white">
                {post.title}
            </h1>

            {/* Blog Date */}
            <p className="text-sm text-gray-500 mb-6">
                {new Date(post.date).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </p>

            {/* Blog Image */}
            {post.image && (
                <div className="w-full mb-6 rounded-xl overflow-hidden shadow">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-80 object-cover rounded-xl"
                    />
                </div>
            )}

            {/* Blog Content */}
            <article className="prose prose-blue prose-lg dark:prose-invert max-w-none whitespace-pre-line">
                {post.content}
            </article>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
                <p className="text-xs text-gray-500 mt-6">
                    <span className="font-medium">Tags:</span> {post.tags.join(', ')}
                </p>
            )}

            {/* Like & Back Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-10 mb-10 gap-4">
                <LikeButton />
                <BackButton />
            </div>
        </main>

    );
}
