import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";


const usersFilePath = path.join(process.cwd(), 'src/data/users.json');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, email, password, role } = body;

        if (!username || !email || !password || !role) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        // Read existing users
        let users: any[] = [];
        if (fs.existsSync(usersFilePath)) {
            const fileData = fs.readFileSync(usersFilePath, 'utf8');
            users = JSON.parse(fileData);
        }

        // check for existing user
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // save new user
        const newUser = { username, email, hashedPassword, role };
        users.push(newUser);
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}