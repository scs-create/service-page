import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { renderArticle } from "@/lib/markdown";
import PostCard from "@/components/ui/PostCard";
import JsonLd from "@/components/ui/JsonLd";
import PageHero from "@/components/ui/PageHero";
import CTAButton from "@/components/ui/CTAButton";
import NewsletterSignup from "@/components/sections/NewsletterSignup";
import { getServiceBySlug } from "@/content/services/data";
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

  const date = new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const { html, toc } = await renderArticle(post.content); // sanitised (H-01)
  const related = getRelatedPosts(post);
  const services = (post.services ?? []).map(getServiceBySlug).filter((s): s is NonNullable<typeof s> => !!s);
  const url = `${SITE.url}/corporate-college/corporate-school/${post.slug}`;

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.excerpt, datePublished: post.date, dateModified: post.date, image: `${SITE.url}/og-image.png`, author: { "@type": "Organization", name: SITE.legalName, url: SITE.url }, publisher: { "@type": "Organization", name: SITE.legalName, logo: { "@type": "ImageObject", url: `${SITE.url}/images/logo.png` } }, mainEntityOfPage: url }} />
      <PageHero
        breadcrumbs={[{ label: "Corporate College", href: "/corporate-college" }, { label: "Corporate School", href: "/corporate-college/corporate-school" }, { label: post.title }]}
        eyebrow={post.category ?? "Corporate School"}
        title={post.title}
        intro={post.excerpt}
        meta={`${date} · ${post.readingMinutes} min read · SCS Corporate College`}
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

          <div className="prose-content text-base text-text" dangerouslySetInnerHTML={{ __html: html }} />

          {(post.help || services.length > 0) && (
            <section aria-labelledby="how-scs-helps" data-location="article_help" className="dark-surface mt-14 rounded-md border-t-4 border-accent bg-secondary p-6 md:p-8 text-white">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">Put this into practice</p>
              <h2 id="how-scs-helps" className="mt-2 text-2xl font-semibold">How SCS can help</h2>
              {post.help && <p className="mt-3 text-white/85">{post.help}</p>}
              {services.length > 0 && (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}`} className="block h-full rounded-md border border-white/15 bg-white/5 p-4 hover:border-accent">
                        <span className="block font-semibold text-white">{s.title} →</span>
                        <span className="mt-1 block text-sm text-white/85">{s.framingSentence}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <CTAButton booking label="Book a Discovery Call" variant="accent" />
                {post.tool && <CTAButton href={post.tool.href} label={post.tool.label} variant="outlineLight" />}
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
          <div data-location="article_sidebar" className="dark-surface rounded-md border-t-4 border-accent bg-secondary p-5 text-white">
            <p className="font-semibold">Talk it through with SCS</p>
            <p className="mt-1 text-sm text-white/85">A free 30-minute Discovery Call about your business.</p>
            <div className="mt-4"><CTAButton booking label="Book a Discovery Call" variant="accent" /></div>
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
