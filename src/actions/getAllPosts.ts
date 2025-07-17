import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const blogDirectory = path.join(process.cwd(), 'content');

export async function getAllPosts() {
    const fileNames = fs.readdirSync(blogDirectory);

    return fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(blogDirectory, fileName);
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContent);

        return {
            slug,
            title: data.title,
            date: data.date,
            summary: data.summary,
            tags: data.tags || [],
        };
    });
}
