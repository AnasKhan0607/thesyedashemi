# Security Measures

This document describes the security protections in place for the application form on this static site. The site is hosted on GitHub Pages (no backend) and submissions flow to a public Google Apps Script endpoint that writes to a Google Sheet.

Because the endpoint must be publicly accessible (so visitors can submit without signing into Google), anti-abuse protection happens at the form layer and inside the Apps Script.

---

## 1. Honeypot Field

**Where:** `index.html` (hidden input named `website`), `google-apps-script.js` (check)

A hidden form field positioned off-screen and marked `aria-hidden`. Real users never see or fill it. Bots that blindly fill every input will fill it, and the Apps Script silently drops those submissions.

**Why it works:** costs bots nothing to defeat individually, but catches the overwhelming majority of drive-by spam bots that don't parse CSS.

---

## 2. Shared Secret Header

**Where:** `script.js` (sends `secret`), `google-apps-script.js` (validates `secret`)

The site's JavaScript includes a shared string in every submission. The Apps Script rejects any submission where the secret doesn't match.

**Why it works:** filters out anyone who discovers the Apps Script URL (e.g., via browser devtools or scraping) and tries to POST to it directly without going through the site. It is **not** strong cryptographic protection — the secret is visible in the public JS — but it raises the bar from "trivial" to "has to read the JS first."

---

## 3. Rate Limiting

**Where:** `google-apps-script.js` (uses `CacheService`)

Each unique fingerprint (email + name combination) is capped at 5 submissions per hour. Excess submissions are silently dropped.

**Why it works:** prevents a single actor from flooding the Google Sheet with junk, while allowing a legitimate user to resubmit a couple of times if they made a mistake.

---

## 4. Input Sanitization (CSV Injection Defense)

**Where:** `google-apps-script.js` (`sanitize()` function)

Any field value starting with `=`, `+`, `-`, `@`, tab, or carriage return has a single-quote prefix added before being written to the sheet. This prevents a malicious submission from turning into an active formula (e.g., `=HYPERLINK(...)` that phones home) if the sheet is later exported or opened in Excel.

**Why it matters:** Google Sheets and Excel both evaluate cells that start with `=` as formulas. A crafted submission could exfiltrate data or redirect clicks when a non-technical user opens the exported CSV.

---

## 5. Field Length Caps

**Where:** `google-apps-script.js` (`MAX_FIELD_LENGTH`, `MAX_MESSAGE_LENGTH`)

Regular fields are truncated at 500 characters; the message field at 2000. Longer input is cut off before it reaches the sheet.

**Why it matters:** prevents someone from trying to fill a cell with megabytes of text, which could make the sheet unusable or hit Apps Script quotas.

---

## 6. Silent Drop on Security Failures

**Where:** `google-apps-script.js`

When a submission fails the secret check, trips the honeypot, or exceeds the rate limit, the script returns a fake `status: success` response without writing to the sheet.

**Why it works:** bots (and attackers) think they succeeded and move on instead of retrying with different payloads until one works.

---

## What's Not Protected (Known Trade-offs)

- **The Apps Script URL is public by design.** It has to be, so unauthenticated visitors can submit. The protections above mitigate abuse of that endpoint; they don't replace authentication.
- **The shared secret is visible in client JS.** Anyone who reads `script.js` can see it. It's a speed bump, not a lock. Rotate it periodically.
- **No CAPTCHA.** Turnstile/hCaptcha would stop more bots but require registering a domain on a third-party dashboard. Not used to keep the stack zero-signup.
- **No HTTPS headers / CSP.** GitHub Pages doesn't allow custom response headers, so no CSP, HSTS (beyond the default), or frame-ancestors lock-down.
- **Leads are PII.** Email, phone, and Instagram handle are submitted in plain text to Google Sheets. Keep the sheet private (not shared publicly) and be aware of data-handling obligations in your jurisdiction.

---

## Deployment Note

Changes to `google-apps-script.js` in this repo are **not automatically applied** to the live Apps Script. After editing:

1. Open the Apps Script editor for the deployed project.
2. Paste the updated contents.
3. Deploy → Manage Deployments → Edit → Version: "New version" → Deploy.

The existing Web app URL stays the same.
