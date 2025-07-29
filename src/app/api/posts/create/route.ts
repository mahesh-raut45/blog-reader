import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const config = {
    api: {
        bodyParser: false,
    },
};

const postsFilePath = path.join(process.cwd(), "src/data/posts.json");
const uploadDir = path.join(process.cwd(), "public/uploads");

await fs.mkdir(uploadDir, { recursive: true });

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const title = formData.get("title")?.toString() || "";
        const content = formData.get("content")?.toString() || "";
        const autherEmail = formData.get("autherEmail")?.toString() || "";
        const tagsRaw = formData.get("tags")?.toString() || "[]";
        const tags = tagsRaw.split(',').map(tag => tag.trim());


        const file = formData.get("image") as File | null;

        if (!title || !content || !autherEmail) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        let imageUrl = null;

        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join(uploadDir, fileName);
            await fs.writeFile(filePath, buffer);
            imageUrl = `/uploads/${fileName}`;
        }

        // Read existing posts
        let posts = [];
        try {
            const data = await fs.readFile(postsFilePath, "utf-8");
            posts = JSON.parse(data);
        } catch (_) {
            // kept empty if file doesn't exist the app wont crash
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

        return NextResponse.json({ message: "Post created successfully", post: newPost }, { status: 201 });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json({ err: "Upload failed" }, { status: 500 });
    }
}
