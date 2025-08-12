'use server';

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

const usersFilePath = path.join(process.cwd(), 'src/data/users.json');

export async function loginUser({ email, password }: { email: string, password: string }) {

    if (!email || !password) {
        return { success: false, message: "Email and password are required" };
    }

    if (!fs.existsSync(usersFilePath)) {
        return { success: false, message: "No users registered" };
    }

    const fileData = fs.readFileSync(usersFilePath, 'utf8');
    const users = JSON.parse(fileData);

    const user = users.find((u: any) => u.email === email);

    if (!user) {
        return { success: false, message: "Invalid email or password" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
        return { success: false, message: "Invalid email or password" };
    }

    (await cookies()).set("auth", JSON.stringify({
        username: user.username,
        email: user.email,
        role: user.role
    }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
    });

    return {
        success: true,
        message: "Login successful",
        user: {
            username: user.username,
            email: user.email,
            role: user.role,
        },
    }
}