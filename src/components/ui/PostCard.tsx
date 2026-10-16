import Link from "next/link";
import { Post } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      href={`/corporate-college/corporate-school/${post.slug}`}
      className="lift reveal block border border-border rounded-md p-6 bg-surface"
    >
      {post.category && (
        <span className="text-xs font-semibold text-primary uppercase tracking-wide">
          {post.category}
        </span>
      )}
      <h3 className="text-lg font-semibold text-text mt-2 mb-2">
        {post.title}
      </h3>
      <p className="text-sm text-muted mb-3">{post.excerpt}</p>
      <time dateTime={post.date} className="text-xs text-muted">
        {formattedDate}
      </time>
    </Link>
  );
}
