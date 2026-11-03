import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import PageHero from "@/components/ui/PageHero";
import PostCard from "@/components/ui/PostCard";
import NewsletterSignup from "@/components/sections/NewsletterSignup";
import Link from "next/link";
import { TOPICS } from "@/content/v2/topics";

export const metadata: Metadata = {
  title: "Corporate School",
  description: "Practical guides for businesses in Nigeria and abroad, dated and sourced, from Stephen Corporate Services - SCS Ltd.",
  alternates: { canonical: "/corporate-college/corporate-school" },
};

export default function CorporateSchoolIndexPage() {
  const posts = getAllPosts();
  return (
    <>
      <PageHero breadcrumbs={[{ label: "Corporate College", href: "/corporate-college" }, { label: "Corporate School" }]} eyebrow="Insights" title="Corporate School" intro="Practical guides, dated and sourced. Each one explains common practice in plain language and links to the official source where a rule applies." />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <nav aria-labelledby="topics-title" className="mb-12">
          <h2 id="topics-title" className="font-sans text-sm font-semibold uppercase tracking-wider text-primary">Browse by topic</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <li key={t.slug}>
                <Link href={`/corporate-college/corporate-school/topics/${t.slug}`} className="inline-flex min-h-11 items-center rounded-sm border border-border bg-surface px-4 text-sm font-medium text-text hover:border-primary hover:text-primary">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
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
