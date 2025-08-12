"use server";

import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';

const usersFilePath = path.join(process.cwd(), 'src/data/users.json');

export async function registerUser({ username, email, password, role }: { username: string, email: string, password: string, role: string }) {

    try {
        let users: any[] = [];

        try {
            const data = await fs.readFile(usersFilePath, 'utf8');
            users = JSON.parse(data);
        } catch (error) {
            users = [];
        }

        if (users.find(user => user.email === email)) {
            return {
                success: false,
                message: "User with this email already exists"
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { username, email, hashedPassword, role };
        users.push(newUser);

        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

        return {
            success: true,
            message: "User registered successfully",
        }
    } catch (error) {
        console.error("Error registering user:", error);
        return {
            success: false,
            message: "Internal Server Error"
        };
    }

}