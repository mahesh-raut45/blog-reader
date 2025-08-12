"use client"
import { createPost } from '@/actions/createPost';
import { RootState } from '@/redux/store';
import { cookies } from 'next/headers';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const CreateBlogPage = () => {

    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);
    // const cookieStore = await cookies();
    // const authValue = cookieStore.get("auth")?.value;
    // const user = authValue ? JSON.parse(authValue) : null;

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        image: null as File | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                image: file,
            }));
        }
    };


    // useEffect(() => {
    //     if (!user) {
    //         toast.error("You must be logged in to create a blog post");
    //         router.push('/login');
    //     }
    // }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = new FormData();
        form.append('title', formData.title);
        form.append('content', formData.content);
        form.append('autherEmail', user?.email || '');
        form.append('tags', formData.tags);
        if (formData.image) {
            form.append('image', formData.image);
        }

        const res = await fetch('/api/posts/create', {
            method: 'POST',
            body: form,
        });
        // const res = await createPost(form);

        // console.log("res", res);
        // if (!res.success) {
        //     toast.error(res.message);
        //     return;
        // }

        // toast.success(res.message);
        // setFormData({ title: '', content: '', tags: '', image: null });
        // router.push('/');

        const data = await res.json();

        console.log("FormData entries:");
        for (let pair of form.entries()) {
            console.log(pair[0], pair[1]);
        }

        if (res.ok) {
            toast.success('Blog post created successfully!');
            setFormData({
                title: '',
                content: '',
                tags: '',
                image: null as File | null,
            })
            router.push('/');
        } else {
            toast.error(data.message || 'Failed to create post.');
        }
    };


    return (
        <main className="max-w-2xl bg-slate-700 mx-auto py-12 px-6 my-5 rounded-lg">
            <h1 className="text-3xl font-bold mb-8 text-center text-slate-100">
                Create a New Blog Post
            </h1>

            <form
                // action={"/api/posts/create"}
                // method='POST'
                // encType='multipart/form-data'
                onSubmit={handleSubmit}
                className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-200 mb-1">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        placeholder="e.g. Building a Blog with Next.js"
                        className="bg-transparent border border-gray-600 rounded-lg p-3 w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-slate-200 mb-1">
                        Content
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        rows={10}
                        placeholder="Write your blog post..."
                        className="bg-transparent border border-gray-600 rounded-lg p-3 w-full text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-slate-200 mb-1">
                        Cover Image
                    </label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="border border-gray-600 rounded-lg p-2 w-full text-white file:bg-blue-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded file:mr-3"
                        onChange={handleImageChange}
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-slate-200 mb-1">
                        Tags <span className="text-gray-400 text-sm">(comma separated)</span>
                    </label>
                    <input
                        id="tags"
                        type="text"
                        name="tags"
                        placeholder="e.g. faith, meditation, lifestyle"
                        className="bg-transparent border border-gray-600 rounded-lg p-3 w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.tags}
                        onChange={handleChange}
                    />
                </div>

                <input type="hidden" name='autherEmail' value={user?.email || ""} />

                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    Publish Post
                </button>
            </form>
        </main>


    );
}

export default CreateBlogPage;