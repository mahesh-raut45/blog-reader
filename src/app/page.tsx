import { getAllPosts } from "@/actions/getAllPosts";
import HomeClient from "@/components/HomeClient";


export default async function Home({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const allPosts = await getAllPosts();
  const params = await searchParams;
  const tag = params.tag;

  const posts = tag
    ? allPosts.filter((p) => p.tags.includes(tag))
    : allPosts;


  const uniqueTags = [...new Set(allPosts.flatMap((p) => Array.isArray(p.tags) ? p.tags : []))];

  return (
    <HomeClient posts={posts} uniqueTags={uniqueTags} currentTag={tag || ""} />
  );
}
