import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { remark } from 'remark';
import html from 'remark-html';
import LikeButton from '@/components/LinkButton';
import BackButton from '@/components/BackButton';

export const runtime = 'nodejs';

type Props = {
    params: {
        slug: string;
    };
};

// 🧠 Pre-render metadata for each post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = params;
    const filePath = path.join(process.cwd(), 'content', `${slug}.md`);

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent);

        return {
            title: data.title,
        };
    } catch {
        return {
            title: 'Post Not Found',
        };
    }
}

// 🧾 Actual blog post page
export default async function BlogPost({ params }: Props) {
    const { slug } = params;
    const filePath = path.join(process.cwd(), 'content', `${slug}.md`);

    // 1. Check if file exists
    if (!fs.existsSync(filePath)) {
        notFound(); // show 404 if not found
    }

    // 2. Read and parse
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // 3. Convert markdown to HTML
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return (
        <main className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
            <p className="text-sm text-gray-500 mb-6">{data.date}</p>
            <article
                className="prose prose-blue"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
            <div className="flex items-end mb-[10px] justify-between">
                <LikeButton />
                <BackButton />
            </div>
        </main>
    );
}
