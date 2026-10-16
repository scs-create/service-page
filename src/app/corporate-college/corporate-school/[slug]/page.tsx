import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import PostCard from "@/components/ui/PostCard";
import JsonLd from "@/components/ui/JsonLd";
import NewsletterSignup from "@/components/sections/NewsletterSignup";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function CorporateSchoolPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const date = new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const html = await renderMarkdown(post.content); // sanitised (H-01)
  const related = getRelatedPosts(post);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.excerpt, datePublished: post.date, author: { "@type": "Organization", name: SITE.legalName }, publisher: { "@type": "Organization", name: SITE.legalName }, mainEntityOfPage: `${SITE.url}/corporate-college/corporate-school/${post.slug}` }} />
      <article className="max-w-[75ch]">
        {post.category && <span className="text-xs font-semibold text-primary uppercase tracking-wide">{post.category}</span>}
        <h1 className="text-3xl md:text-4xl font-semibold text-text mt-2 mb-3">{post.title}</h1>
        <p className="text-sm text-muted"><time dateTime={post.date}>{date}</time> · {post.readingMinutes} min read</p>
        <div className="prose-content mt-8 text-base text-text space-y-4" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <div className="mt-12 max-w-[640px]"><NewsletterSignup sourcePage={`/corporate-college/corporate-school/${post.slug}`} /></div>
      {related.length > 0 && (
        <section className="mt-14 pt-10 border-t border-border">
          <h2 className="text-xl font-semibold text-text mb-6">Related reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">{related.map((p) => <PostCard key={p.slug} post={p} />)}</div>
        </section>
      )}
    </div>
  );
}
