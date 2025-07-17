import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

const usersFilePath = path.join(process.cwd(), 'src/data/users.json');

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        if (!fs.existsSync(usersFilePath)) {
            return NextResponse.json({ message: "No users registered" }, { status: 404 });
        }

        const fileData = fs.readFileSync(usersFilePath, 'utf8');
        const users = JSON.parse(fileData);

        const user = users.find((u: any) => u.email === email);

        if (!user) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 404 });
        }

        // compare pain password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        return NextResponse.json({
            message: "Login successful",
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error: any) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}