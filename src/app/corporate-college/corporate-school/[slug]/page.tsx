import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { renderArticle } from "@/lib/markdown";
import PostCard from "@/components/ui/PostCard";
import PageHero from "@/components/ui/PageHero";
import JsonLd from "@/components/ui/JsonLd";
import CTAButton from "@/components/ui/CTAButton";
import NewsletterSignup from "@/components/sections/NewsletterSignup";
import { v2LinkForV1 } from "@/content/v2/catalogue";
import { topicsForPost } from "@/content/v2/topics";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date, images: [{ url: "/og-image.png", width: 1200, height: 630 }] },
  };
}

const WRAP = "max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8";

export default async function CorporateSchoolPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const date = fmt(post.date);
  const reviewed = fmt(post.reviewed ?? post.date);
  const topics = topicsForPost(post.slug);
  const { html, toc } = await renderArticle(post.content); // sanitised (H-01)
  const related = getRelatedPosts(post);
  const services = [...new Map((post.services ?? []).map(v2LinkForV1).filter((s) => !!s).map((s) => [s.href, s])).values()];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          dateModified: post.reviewed ?? post.date,
          image: `${SITE.url}/og-image.png`,
          author: { "@id": `${SITE.url}/#organization` },
          publisher: { "@id": `${SITE.url}/#organization` },
          mainEntityOfPage: `${SITE.url}/corporate-college/corporate-school/${post.slug}`,
        }}
      />
      <PageHero
        breadcrumbs={[{ label: "Corporate College", href: "/corporate-college" }, { label: "Corporate School", href: "/corporate-college/corporate-school" }, { label: post.title }]}
        eyebrow={post.category ?? "Corporate School"}
        title={post.title}
        intro={post.excerpt}
        meta={`By ${SITE.titleName} · Published ${date} · Last reviewed ${reviewed} · ${post.readingMinutes} min read`}
      />

      <div className={`${WRAP} py-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] items-start`}>
        <article className="min-w-0 max-w-[75ch]">
          {post.takeaways && post.takeaways.length > 0 && (
            <section aria-labelledby="takeaways" className="mb-10 rounded-md border border-border border-t-4 border-t-accent bg-surface p-6">
              <h2 id="takeaways" className="text-lg font-semibold text-text">Key takeaways</h2>
              <ul className="mt-3 space-y-2">
                {post.takeaways.map((t) => (
                  <li key={t} className="flex gap-3 text-text">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Item 20 (owner decision): the standard reader note on every guide. */}
          <p className="mb-10 rounded-sm border border-border bg-surface px-4 py-3 text-sm text-muted">
            <strong className="text-text">For general information only.</strong> This guide explains common practice. It is not advice on your
            situation: seek specialist professional advice for your situation, or confirm current requirements with the regulator, before you act.
          </p>

          <div className="prose-content text-base text-text" dangerouslySetInnerHTML={{ __html: html }} />

          {post.sources && post.sources.length > 0 && (
            <section aria-labelledby="sources" className="mt-12 border-t border-border pt-6">
              <h2 id="sources" className="text-lg font-semibold text-text">Official sources</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {post.sources.map((src) => (
                  <li key={src.url}>
                    <a href={src.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                      {src.title}<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in new tab)</span>
                    </a>
                    <span className="text-muted"> · retrieved {fmt(src.retrieved)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {topics.length > 0 && (
            <p className="mt-8 text-sm text-muted">
              Topics:{" "}
              {topics.map((t, i) => (
                <span key={t.slug}>{i > 0 && " · "}<Link href={`/corporate-college/corporate-school/topics/${t.slug}`} className="font-medium text-primary hover:underline">{t.name}</Link></span>
              ))}
            </p>
          )}

          {(post.help || services.length > 0) && (
            <section aria-labelledby="how-scs-helps" data-location="article_help" className="mt-14 rounded-sm border border-border border-t-4 border-t-accent bg-surface p-6 md:p-8">
              <p className="type-eyebrow text-primary">Put this into practice</p>
              <h2 id="how-scs-helps" className="mt-2 text-2xl font-semibold text-text">How SCS can help</h2>
              {post.help && <p className="mt-3 text-muted">{post.help}</p>}
              {services.length > 0 && (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {services.map((s) => (
                    <li key={s.href}>
                      <Link href={s.href} className="block h-full rounded-sm border border-border bg-bg p-4 hover:border-primary">
                        <span className="block font-semibold text-text">{s.label} →</span>
                        <span className="mt-1 block text-sm text-muted">{s.summary}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <CTAButton booking label="Ask a question: book a Discovery Call" />
                {post.tool && <CTAButton href={post.tool.href} label={post.tool.label} variant="secondary" />}
              </div>
            </section>
          )}

          <div className="mt-12 max-w-[640px]"><NewsletterSignup sourcePage={`/corporate-college/corporate-school/${post.slug}`} /></div>
        </article>

        <aside className="hidden lg:block lg:sticky lg:top-28 space-y-6">
          {toc.length > 1 && (
            <nav aria-label="In this guide" className="rounded-md border border-border bg-surface p-5 max-h-[60vh] overflow-y-auto">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">In this guide</p>
              <ol className="space-y-2 text-sm">
                {toc.map((t) => (
                  <li key={t.id}><a href={`#${t.id}`} className="text-muted hover:text-primary">{t.title}</a></li>
                ))}
              </ol>
            </nav>
          )}
          <div data-location="article_sidebar" className="rounded-sm border border-border border-t-4 border-t-accent bg-bg p-5">
            <p className="font-semibold text-text">Talk it through with SCS</p>
            <p className="mt-1 text-sm text-muted">A free 30-minute Discovery Call about your organisation.</p>
            <div className="mt-4"><CTAButton booking label="Book a Discovery Call" /></div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="bg-surface py-14">
          <div className={WRAP}>
            <h2 className="text-xl font-semibold text-text mb-6">Related reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">{related.map((p) => <PostCard key={p.slug} post={p} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
