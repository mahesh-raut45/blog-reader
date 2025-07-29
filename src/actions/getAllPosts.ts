import fs from 'fs';
import path from 'path';

const blogDirectory = path.join(process.cwd(), 'src/data/posts.json');

type Post = {
    id: string;
    title: string;
    date: string;
    content: string;
    autherEmail: string;
    tags?: string[];
    image?: string;
};

export function getAllPosts() {

    if (!fs.existsSync(blogDirectory)) {
        return [];
    }

    const fileData = fs.readFileSync(blogDirectory, 'utf-8');
    const posts: Post[] = JSON.parse(fileData);

    return posts.map(({ id, title, date, content, autherEmail, tags, image }) => ({
        id,
        title,
        date,
        summary: content.slice(0, 200) + "...",
        author: autherEmail,
        tags: tags || [],
        image: image || undefined,
    }));

}
