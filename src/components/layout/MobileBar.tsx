import { SITE } from "@/lib/site";

const WA = `https://wa.me/${SITE.whatsappHref}?text=${encodeURIComponent("Hello SCS, I would like to speak with your team.")}`;

// v2 mobile action bar (docs/v2/design/MobileBar.dc.html): Call / WhatsApp / Book a call, on every page, mobile only.
// The body has matching bottom padding (layout.tsx), so the bar never covers the footer.
export default function MobileBar() {
  const outline = "flex min-h-12 items-center justify-center gap-1.5 rounded-md border border-border text-text";
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_1fr_1.4fr] gap-2 border-t border-border bg-bg px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 text-[15px] font-medium md:hidden"
    >
      <a href={`tel:${SITE.phoneHref}`} data-track="Dock Call" className={outline}>
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
        </svg>
        Call
      </a>
      <a href={WA} target="_blank" rel="noopener noreferrer" data-track="Dock WhatsApp" className={outline}>
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
        </svg>
        WhatsApp<span className="sr-only"> (opens in new tab)</span>
      </a>
      <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" data-track="Dock Book" data-booking="" className="flex min-h-12 items-center justify-center rounded-md bg-primary text-white">
        Book a call<span className="sr-only"> (opens Cal.com in a new tab)</span>
      </a>
    </nav>
  );
}
