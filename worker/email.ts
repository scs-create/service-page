// Emails for /api/forms (06-TECH-SPEC.md §3 steps 8–9), both sent through Resend. Cloudflare Email Routing is not
// used: enabling it would take over the root MX that Google Workspace relies on (§5), so internal notifications also
// go through Resend. Files are never attached; staff open uploads from the admin view.
import type { Env } from "./types";
import type { FormName } from "../src/lib/formFields";

export type Mail = { to: string[]; subject: string; text: string; html: string; replyTo?: string; idempotencyKey: string };

const NAME = "Stephen Corporate Services - SCS Ltd";
const PROMISE = "We respond within 24 hours.";
const LABEL: Record<FormName, string> = { enquiry: "enquiry", proposal: "proposal request", career: "application", expert: "expert-network application" };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const fieldLabel = (k: string) => k.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export function internalMail(env: Env, form: FormName, ref: string, fields: Record<string, string>, files: string[], to: string): Mail {
  const rows = Object.entries(fields).filter(([k]) => k !== "consent_contact");
  const text = [`New ${LABEL[form]} ${ref}`, "", ...rows.map(([k, v]) => `${fieldLabel(k)}: ${v}`), "", files.length ? `Files stored (open them from the admin view): ${files.join(", ")}` : "No files."].join("\n");
  const html = `<p><strong>New ${LABEL[form]} ${esc(ref)}</strong></p><table cellpadding="4">${rows
    .map(([k, v]) => `<tr><td valign="top"><strong>${esc(fieldLabel(k))}</strong></td><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table><p>${files.length ? `Files stored (open them from the admin view): ${esc(files.join(", "))}` : "No files."}</p>`;
  return { to: [to], subject: `[${ref}] New ${LABEL[form]}${fields.name ? ` from ${fields.name}` : ""}`, text, html, replyTo: fields.email, idempotencyKey: `${ref}-internal` };
}

export function confirmationMail(env: Env, form: FormName, ref: string, fields: Record<string, string>): Mail {
  const booking = env.BOOKING_URL ?? "https://cal.com/support-stephen-corporate-services-scs/30min";
  const first = (fields.name ?? "").split(/\s+/)[0] || "there";
  const steps = ["We have received your " + LABEL[form] + ".", "The right person at SCS reviews it.", PROMISE, form === "career" || form === "expert" ? "If there is a fit, we arrange a conversation." : "We arrange a call or prepare a proposal."];
  const text = [
    `Hello ${first},`,
    "",
    `Thank you for your ${LABEL[form]}. Your reference is ${ref}.`,
    "",
    "What happens next:",
    ...steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    form === "career" || form === "expert" ? "" : `If you would like to talk sooner, book a Discovery Call: ${booking}`,
    "",
    NAME,
    "SD20 Belham Estate, Karsana, FCT, Abuja, Nigeria · +234 812 813 8222",
  ].join("\n");
  const html = `<p>Hello ${esc(first)},</p><p>Thank you for your ${LABEL[form]}. Your reference is <strong>${esc(ref)}</strong>.</p><p><strong>What happens next</strong></p><ol>${steps
    .map((s) => `<li>${esc(s)}</li>`)
    .join("")}</ol>${form === "career" || form === "expert" ? "" : `<p>If you would like to talk sooner, <a href="${esc(booking)}">book a Discovery Call</a>.</p>`}<p>${NAME}<br>SD20 Belham Estate, Karsana, FCT, Abuja, Nigeria · +234 812 813 8222</p>`;
  return { to: [fields.email], subject: `We have received your ${LABEL[form]} (${ref})`, text, html, replyTo: env.MAIL_REPLY_TO, idempotencyKey: `${ref}-confirmation` };
}

// POST https://api.resend.com/emails (Resend API reference). Returns false, never throws: a failed email must not
// lose a submission that is already stored.
export async function sendMail(env: Env, mail: Mail, fetcher: typeof fetch = fetch): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM) return false;
  try {
    const res = await fetcher("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": mail.idempotencyKey },
      body: JSON.stringify({ from: env.MAIL_FROM, to: mail.to, subject: mail.subject, text: mail.text, html: mail.html, ...(mail.replyTo ? { reply_to: mail.replyTo } : {}) }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
