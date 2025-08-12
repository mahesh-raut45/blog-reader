"use server";

import { cookies } from "next/headers";
import path from "path";
import fs from "fs";


const postsFilePath = path.join(process.cwd(), 'src/data/posts.json');

type Post = {
    id: string;
    title: string;
    date: string;
    content: string;
    autherEmail: string;
    tags?: string[];
    image?: string;
};

export async function deletePost(postId: string) {
    const cookieStore = (await cookies()).get("auth");
    if (!cookieStore) {
        return { success: false, message: "Unauthorized" };
    }

    const user = JSON.parse(cookieStore.value);
    if (user.role !== "admin") {
        return { success: false, message: "Forbidden" };
    }

    const file = await fs.readFileSync(postsFilePath, 'utf8');
    const posts: Post[] = JSON.parse(file);

    const filteredPosts = posts.filter((p) => p.id !== postId);

    if (filteredPosts.length === posts.length) {
        return { success: false, message: "Post not found" };
    }

    await fs.writeFileSync(postsFilePath, JSON.stringify(filteredPosts, null, 2));

    return { success: true, message: "Post deleted successfully" };
}

