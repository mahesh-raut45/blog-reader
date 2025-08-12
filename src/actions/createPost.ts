"use server"

import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

const postsFilePath = path.join(process.cwd(), "src/data/posts.json");
const uploadDir = path.join(process.cwd(), "public/uploads");

export async function createPost(formData: FormData) {
    const authCookie = (await cookies()).get("auth");
    if (!authCookie) {
        return { success: false, message: "You must be logged in to create a post" };
    }

    const title = formData.get("title")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const autherEmail = formData.get("autherEmail")?.toString() || "";
    const tagsRaw = formData.get("tags")?.toString() || "";
    const tags = tagsRaw.split(',').map(tag => tag.trim()).filter(Boolean);
    const file = formData.get("image") as File | null;

    if (!title || !content || !autherEmail) {
        return { success: false, message: "All fields are required" };
    }

    let imageUrl = null;
    if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${file.name}`;
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, fileName), buffer);
        imageUrl = `/uploads/${fileName}`;
    }

    let posts = [];
    try {
        const data = await fs.readFile(postsFilePath, 'utf-8');
        posts = JSON.parse(data);
    } catch (_) {
        posts = [];
    }

    const newPost = {
        id: uuidv4(),
        title,
        content,
        autherEmail,
        tags,
        image: imageUrl,
        date: new Date().toISOString(),
    };

    posts.push(newPost);
    await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2));

    return { success: true, message: "Post created successfully", post: newPost };


}