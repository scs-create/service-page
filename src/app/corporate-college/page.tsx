import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ExternalLinkCard from "@/components/ui/ExternalLinkCard";
import ClientPlaceholder from "@/components/ui/ClientPlaceholder";
import PostCard from "@/components/ui/PostCard";
import TagList from "@/components/ui/TagList";
import NetlifyForm from "@/components/sections/NetlifyForm";
import { CONSENT_FIELD, type FormField } from "@/lib/formSchema";
import { trainingTopics, audienceTypes } from "@/content/academy/topics";
import { getAllPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Corporate College",
  description: "Request learning and training on topics related to SCS services, for individuals, companies, NGOs and government agencies, and read our Corporate School blog.",
};

const WRAP = "max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8";

const fields: FormField[] = [
  { name: "name", label: "Full Name", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel" },
  { name: "organisation", label: "Organisation", type: "text", autoComplete: "organization" },
  { name: "audience", label: "I am requesting as a...", type: "select", required: true, options: audienceTypes },
  { name: "topic", label: "Training topic", type: "select", required: true, options: [...trainingTopics, "A topic not listed (describe below)"] },
  { name: "details", label: "Describe the topic or the outcome you want", type: "textarea", rows: 4, hint: "Not listed above? Tell us the topic you need and we will respond." },
  CONSENT_FIELD,
];

export default function CorporateCollegePage() {
  const posts = getAllPosts().slice(0, 3);
  return (
    <>
      <PageHero breadcrumbs={[{ label: "Corporate College" }]}
        eyebrow="Corporate College"
        title="Learn from real corporate practice"
        intro="Corporate College is where you can request learning and training on topics related to our services, or on a topic you need that is not listed. It is also home to our blog, Corporate School."
      />

      <div className={`${WRAP} py-14`}>
        <section className="mb-14 rounded-md bg-surface border border-border p-6 md:p-10">
          <SectionHeading eyebrow="Request learning or training" title="For individuals, companies, NGOs and government agencies" intro="Tell us what you need and we'll follow up directly." />
          <div className="max-w-[640px]">
            <NetlifyForm formName="enquiry" requestType="training-request" sourcePage="/corporate-college" fields={fields} submitLabel="Request Training" successTitle="Request received." successMessage="Thank you. We'll be in touch about your training request." />
          </div>
        </section>

        <section className="mb-14">
          <SectionHeading eyebrow="Training areas" title="Topics we can teach" />
          <TagList items={trainingTopics} />
        </section>

        <section className="mb-14">
          <SectionHeading eyebrow="Corporate School" title="Our blog" intro="Insights on our services, corporate-world updates, and business learnings." />
          {posts.length > 0 && <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">{posts.map((p) => <PostCard key={p.slug} post={p} />)}</div>}
          <Link href="/corporate-college/corporate-school" className="text-primary font-medium hover:underline">Visit Corporate School →</Link>
        </section>

        <section className="mb-14 max-w-[640px]">
          <ExternalLinkCard label="Stephen Corporate Academy (SCA)" description="Our main academy, with its own website: courses, programmes and enrolment." href={SITE.academyUrl} />
          <p className="mt-2"><ClientPlaceholder text="[CLIENT TO CONFIRM: SCA description]" /></p>
        </section>

        <section className="border-t border-border pt-10">
          <p className="text-lg text-text">Want to build your career with us? <Link href="/career" className="font-semibold text-primary hover:underline">Career →</Link></p>
        </section>
      </div>
    </>
  );
}
