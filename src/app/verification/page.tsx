import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";
import CopyButton from "@/components/ui/CopyButton";
import ClientPlaceholder from "@/components/ui/ClientPlaceholder";
import RegisterTable from "@/components/sections/RegisterTable";
import CertificateGallery from "@/components/sections/CertificateGallery";
import { portfolio } from "@/content/portfolio/data";
import { verificationDocuments } from "@/content/verification/data";
import { PH } from "@/lib/placeholders";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Verification",
  description: "Verify SCS's client work independently: client RC numbers and clear instructions for checking them on the Corporate Affairs Commission (CAC) website, plus certificates and acknowledgment letters.",
};

const WRAP = "max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8";

const STEPS = [
  { title: "Copy an RC number", text: "Choose any client in the register below and copy its RC number." },
  { title: "Open the CAC website", text: "Go to the Corporate Affairs Commission (CAC) website using the button below." },
  { title: "Use Public Search", text: "On the CAC website, open Public Search, enter the RC number (or the company name) and search. Compare the registered name with the one listed here." },
];

export default function VerificationPage() {
  const hasDocs = verificationDocuments.length > 0;
  return (
    <>
      <PageHero
        eyebrow="Trust hub"
        title="Verify our work independently"
        intro="Every client below can be looked up on the Corporate Affairs Commission's website using its RC number. Check the record yourself — you should not have to take our word for it."
      />

      <section className={`${WRAP} py-14`}>
        <SectionHeading eyebrow="How it works" title="Three steps to verify a registration" />
        <ol className="grid md:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <li key={s.title} className="bg-bg border border-border border-t-4 border-t-success rounded-md p-5">
              <span aria-hidden="true" className="text-3xl font-semibold text-success">{i + 1}</span>
              <h3 className="mt-1 font-semibold text-text">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a href={SITE.cacUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 min-h-11 font-medium text-white hover:bg-secondary">
            Go to the CAC website<span className="sr-only"> (opens in new tab)</span> ↗
          </a>
          <p className="text-sm text-muted">The CAC website can change its layout. If you cannot find Public Search, <a href="/contact" className="text-primary underline">contact us</a> and we will point you to it.</p>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-md border border-border border-l-4 border-l-accent bg-surface p-4">
          <p className="text-sm text-text">
            <span className="font-semibold">{SITE.legalName}</span> is itself registered with the CAC: <span className="tabular-nums font-semibold">RC {SITE.rc}</span>. You can search for us the same way.
          </p>
          <CopyButton text={SITE.rc} label={SITE.legalName} />
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className={WRAP}>
          <SectionHeading eyebrow="Client register" title={`${portfolio.length} clients, listed with their RC numbers`} />
          <RegisterTable rows={portfolio.map((e) => ({ slug: e.slug, client: e.client, sector: e.sector, rc: e.rc }))} />
          <p className="mt-4 text-sm text-muted">Confidential commercial details are withheld in line with client confidentiality.</p>
        </div>
      </section>

      <section className={`${WRAP} py-14`}>
        <SectionHeading eyebrow="Documents" title="Certificates, permits and acknowledgment letters" />
        {hasDocs ? (
          <CertificateGallery documents={verificationDocuments} />
        ) : (
          <div className="rounded-md border border-border border-l-4 border-l-accent bg-surface p-6 max-w-[70ch]">
            <p className="font-medium text-text">Scanned documents are being prepared for publication.</p>
            <p className="mt-2 text-sm text-muted">Until they are published here, certificates and client acknowledgment letters can be requested directly from our team.</p>
            <div className="mt-4"><CTAButton href="/contact#enquiry" label="Request documents" variant="secondary" /></div>
            <p className="mt-3"><ClientPlaceholder text={PH.verification} /></p>
          </div>
        )}
      </section>
    </>
  );
}
