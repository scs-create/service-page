import { SITE } from "@/lib/site";

const WA = `https://wa.me/${SITE.whatsappHref}?text=${encodeURIComponent("Hello SCS, I would like to speak with your team.")}`;

const Icon = ({ d }: { d: string }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const PHONE = "M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z";
const CHAT = "M21 11.5a8.4 8.4 0 01-12.4 7.4L3 21l1.9-5.4A8.5 8.5 0 1121 11.5z";
const CAL = "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z";

// Mobile: fixed bottom bar (Call / WhatsApp / Book). Desktop: floating WhatsApp button.
export default function ContactDock() {
  const item = "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium text-white hover:text-accent";
  return (
    <>
      <nav aria-label="Quick contact" className="dark-surface fixed inset-x-0 bottom-0 z-40 border-t-2 border-accent bg-secondary pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="flex">
          <a href={`tel:${SITE.phoneHref}`} data-track="Dock Call" className={item}><Icon d={PHONE} />Call</a>
          <a href={WA} target="_blank" rel="noopener noreferrer" data-track="Dock WhatsApp" className={item}>
            <Icon d={CHAT} />WhatsApp<span className="sr-only"> (opens in new tab)</span>
          </a>
          <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" data-track="Dock Book" data-booking="" className={item}>
            <Icon d={CAL} /><span>Book <span aria-hidden="true">↗</span></span><span className="sr-only"> a Discovery Call (opens Cal.com in a new tab)</span>
          </a>
        </div>
      </nav>
      <a
        href={WA}
        target="_blank"
        rel="noopener noreferrer"
        data-track="Float WhatsApp"
        data-location="floating_button"
        aria-label="Chat with SCS on WhatsApp (opens in new tab)"
        className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-2 ring-accent transition-transform hover:scale-105 md:flex"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={CHAT} /></svg>
      </a>
    </>
  );
}
