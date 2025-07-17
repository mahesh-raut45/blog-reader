import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';


// Reads all .md files in content/
// Parses the front matter using gray-matter
// Returns post slug, title, date, and summary

const blogDirectory = path.join(process.cwd(), 'content');

export function getAllPosts() {
    const fileNames = fs.readdirSync(blogDirectory);

    return fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(blogDirectory, fileName);
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContent);

        return {
            slug,
            ...data,
        };
    });
}
