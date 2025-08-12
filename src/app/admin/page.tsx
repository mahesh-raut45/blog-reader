import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    const cookieStore = await cookies();
    const auth = cookieStore.get("auth");

    if (!auth) {
        redirect("/login");
    }

    const user = JSON.parse(auth.value);

    if (user.role !== "admin") {
        redirect("/");
    }

    return (
        <main className="p-4 mt-4 m-auto flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <p>Welcome, {user.username}!</p>
            <ul className="mt-4 list-disc list-inside">
                <li><Link href={"/"}> View all posts</Link></li>
                <li>Manage users</li>
            </ul>
        </main>
    )
}