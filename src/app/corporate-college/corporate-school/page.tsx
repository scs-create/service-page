import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import PageHero from "@/components/ui/PageHero";
import PostCard from "@/components/ui/PostCard";
import NewsletterSignup from "@/components/sections/NewsletterSignup";

export const metadata: Metadata = {
  title: "Corporate School",
  description: "Insights on our services, corporate-world updates, and business learnings from Stephen Corporate Services Ltd.",
};

export default function CorporateSchoolIndexPage() {
  const posts = getAllPosts();
  return (
    <>
      <PageHero breadcrumbs={[{ label: "Corporate College", href: "/corporate-college" }, { label: "Corporate School" }]} eyebrow="Corporate College" title="Corporate School" intro="Insights on our services, corporate-world updates, and business learnings." />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <p className="text-muted">No posts published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">{posts.map((post) => <PostCard key={post.slug} post={post} />)}</div>
        )}
        <div className="mt-12 max-w-[640px]"><NewsletterSignup sourcePage="/corporate-college/corporate-school" /></div>
        <p className="mt-6 text-sm text-muted"><a href="/rss.xml" className="text-primary hover:underline">Subscribe via RSS</a></p>
      </div>
    </>
  );
}
