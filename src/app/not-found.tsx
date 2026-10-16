import PageHero from "@/components/ui/PageHero";
import CTAButton from "@/components/ui/CTAButton";

export default function NotFound() {
  return (
    <>
      <PageHero eyebrow="Error 404" title="We couldn't find that page" intro="The page may have moved, or the link may be incorrect. These routes will get you back on track." />
      <section className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-16 flex flex-wrap gap-4">
        <CTAButton href="/" label="Back to Home" />
        <CTAButton href="/services" label="Explore Services" variant="secondary" />
        <CTAButton href="/contact" label="Contact Us" variant="secondary" />
      </section>
    </>
  );
}
