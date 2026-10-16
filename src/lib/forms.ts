// Client helper: POST a form to Netlify's static skeleton (/__forms.html).
// Multipart when files are attached, urlencoded otherwise. Throws on any non-2xx response.
export const MAX_FILE_BYTES = 3 * 1024 * 1024; // keeps two uploads under Netlify's per-submission limit

export async function submitToNetlify(form: HTMLFormElement): Promise<void> {
  const data = new FormData(form);
  const hasFile = Array.from(form.querySelectorAll<HTMLInputElement>('input[type="file"]')).some((i) => (i.files?.length ?? 0) > 0);
  let res: Response;
  if (hasFile) {
    res = await fetch("/__forms.html", { method: "POST", body: data }); // browser sets the multipart boundary
  } else {
    const body = new URLSearchParams();
    data.forEach((v, k) => {
      if (typeof v === "string") body.append(k, v);
    });
    res = await fetch("/__forms.html", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
  }
  if (!res.ok) throw new Error(`Form submission failed (${res.status})`);
}
