import PageHero from "@/components/ui/PageHero";
import LegalText from "@/components/ui/LegalText";
import { hasPlaceholders } from "@/lib/legal";
import type { LegalBlock, LegalDocumentData } from "@/lib/types";

function Block({ block }: { block: LegalBlock }) {
  if (block.type === "p") return block.internal ? null : <p className="mb-4 text-text"><LegalText text={block.text} /></p>;
  if (block.type === "list") {
    return (
      <ul className="mb-4 list-disc space-y-1.5 pl-6 text-text">
        {block.items.map((item, i) => (
          <li key={i}><LegalText text={item} /></li>
        ))}
      </ul>
    );
  }
  const keyValue = block.rows[0]?.length === 2; // 2-column tables are label/value pairs, not data grids
  const head = keyValue ? null : block.rows[0];
  const body = keyValue ? block.rows : block.rows.slice(1);
  return (
    <div className="mb-6 overflow-x-auto rounded-md border border-border">
      <table className="w-full text-left text-sm">
        {head && (
          <thead className="bg-surface">
            <tr>
              {head.map((c, i) => (
                <th key={i} scope="col" className="px-3 py-2 font-semibold text-secondary"><LegalText text={c} /></th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {body.map((row, r) => (
            <tr key={r} className="border-t border-border align-top">
              {row.map((c, i) =>
                keyValue && i === 0 ? (
                  <th key={i} scope="row" className="w-1/3 bg-surface px-3 py-2 font-semibold text-secondary"><LegalText text={c} /></th>
                ) : (
                  <td key={i} className="px-3 py-2 text-text"><LegalText text={c} /></td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LegalDocument({ doc }: { doc: LegalDocumentData }) {
  const draft = hasPlaceholders(doc);
  const dateLine = [doc.effective && `Effective date: ${doc.effective}`, doc.updated && `Last updated: ${doc.updated}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <PageHero eyebrow="Legal" title={doc.title} intro={dateLine || undefined} />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12 grid lg:grid-cols-[280px_minmax(0,1fr)] gap-10 items-start">
        <nav aria-label={`${doc.title} contents`} className="lg:sticky lg:top-28 rounded-md border border-border bg-surface p-4 lg:max-h-[75vh] lg:overflow-y-auto">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">Contents</p>
          <ul className="space-y-1 text-sm">
            {doc.sections.map((s) => (
              <li key={s.id} className={s.level === 3 ? "pl-3" : "pt-1 font-semibold"}>
                <a href={`#${s.id}`} className={s.level === 3 ? "text-muted hover:text-primary" : "text-text hover:text-primary"}>
                  {s.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <article className="max-w-[80ch]">
          {draft && (
            <div role="note" className="mb-8 rounded-md border border-border border-l-4 border-l-accent bg-surface p-4 text-sm text-text">
              <strong>Draft notice.</strong> Items shown as{" "}
              <mark className="rounded-sm bg-accent px-1 text-secondary">[highlighted text]</mark> are still being confirmed by SCS and are not yet final.
            </div>
          )}
          {doc.intro.map((b, i) => (
            <Block key={i} block={b} />
          ))}
          {doc.sections.map((s) => {
            const H = s.level === 2 ? "h2" : "h3";
            return (
              <section key={s.id} className="mt-8">
                <H id={s.id} className={s.level === 2 ? "mb-3 border-l-4 border-accent pl-3 text-2xl font-semibold text-secondary" : "mb-2 text-lg font-semibold text-text"}>
                  {s.heading}
                </H>
                {s.blocks.map((b, i) => (
                  <Block key={i} block={b} />
                ))}
              </section>
            );
          })}
        </article>
      </div>
    </>
  );
}
