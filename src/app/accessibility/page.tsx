import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility statement",
  description: `How ${SITE.titleName} makes this website accessible, the standard we work to, and how to tell us about a problem.`,
  alternates: { canonical: "/accessibility" },
};

// Accessibility statement (05-SITE-SPEC.md §5: WCAG 2.2 AA). Approved by the owner; the QA PR adds the test results.
export default function AccessibilityPage() {
  const H2 = "mb-3 mt-10 text-[24px] font-semibold leading-tight text-text first:mt-0";
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Accessibility statement" }]}
        eyebrow="Policies"
        title="Accessibility statement"
        intro={`${SITE.titleName} wants everyone to be able to use this website, whatever device, browser or assistive technology they use.`}
      />
      <div className="mx-auto max-w-[760px] px-4 py-12 md:px-6 md:py-20 lg:px-8">
        <h2 className={H2}>The standard we work to</h2>
        <p>We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. In practice this means:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>every page works with a keyboard alone, with a visible focus ring, and starts with a &ldquo;Skip to main content&rdquo; link;</li>
          <li>text and controls meet the contrast ratios the guidelines set, and the site works when text is enlarged to 200%;</li>
          <li>buttons and links are at least 44 by 44 pixels, and forms have visible labels and explain errors in words;</li>
          <li>movement is switched off when your device asks for reduced motion;</li>
          <li>images that carry meaning have text alternatives, and decorative images are hidden from screen readers.</li>
        </ul>

        <h2 className={H2}>Known limitations</h2>
        <p>
          Some documents linked from the site, such as scanned certificates on the Verification page, are images and may not be readable by screen
          readers. If you need any document in another format, contact us and we will provide it.
        </p>

        <h2 className={H2}>Tell us about a problem</h2>
        <p>
          If something on this site is hard to use, email <a href={`mailto:${SITE.email}`} className="font-medium text-primary underline">{SITE.email}</a> or call{" "}
          <a href={`tel:${SITE.phoneHref}`} className="font-medium text-primary underline">{SITE.phone}</a>. Tell us the page and what went wrong. {SITE.responsePromise}
        </p>

        <h2 className={H2}>How we check</h2>
        <p>We test the site with automated checks, keyboard-only use and a screen reader before each release, and fix issues as we find them.</p>
      </div>
    </>
  );
}
