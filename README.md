# Samish Digital Wave consultation funnel

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Run `npm run dev` and open `http://localhost:3000`.

The home page is `/`. The separate confirmation route is `/thank-you`.

## Connect consultation requests

The form is intentionally inactive until all delivery settings are configured. It sends the owner notification and buyer confirmation from the server through Resend, then redirects only after Resend accepts both messages. It does not save leads to a local file or browser storage.

Set these server-only variables in `.env.local` for local development and in the Vercel project's Environment Variables for each environment:

- `RESEND_API_KEY`: a Resend API key. Keep it server-side; do not prefix it with `NEXT_PUBLIC_`.
- `LEADS_FROM_EMAIL`: a sender address on a domain verified with Resend. This project accepts senders only on `consultation.samish.com.np`; do not set it until Resend shows that domain as Verified.
- `LEADS_TO_EMAIL`: the business inbox that should receive consultation requests.
- `SUBMISSION_TOKEN_SECRET`: a random secret with at least 32 characters. It signs a short-lived receipt so `/thank-you` only shows confirmation after an accepted request.

Resend must be configured for the sending domain before launch. Add the DNS records Resend provides and wait until the domain is Verified before setting `LEADS_FROM_EMAIL`. The API returns accepted message ids for both emails before issuing the thank-you receipt; acceptance does not guarantee placement in the recipient's inbox.

The API validates the submitted fields on the server, applies a small in-memory rate limit, uses Resend idempotency keys to reduce duplicate messages, and returns a generic error if delivery is not configured or fails. The in-memory rate limit is best-effort on serverless deployments; use a shared rate-limit service if the public endpoint needs stronger abuse protection.

## Optional public contact and media settings

These variables control visible links and must not contain secrets:

- `NEXT_PUBLIC_SITE_URL`: the production site origin. When set to a valid HTTPS URL, it also enables the brand image in social-sharing metadata.
- `NEXT_PUBLIC_CONTACT_EMAIL`: displays a direct email link beside the form.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: international digits with country code (8 to 15 digits); enables the WhatsApp button on the accepted thank-you page.
- `NEXT_PUBLIC_VIMEO_URL`: a Vimeo video URL; enables the responsive video on the accepted thank-you page.
- `NEXT_PUBLIC_SCHEDULING_URL`: reserved for a real scheduling link; no scheduling link is shown until one is implemented and supplied.

The optional public settings are read from `lib/site-config.ts`. The original logo files are copied unchanged to `public/images/` and are used by the page and favicon.

## Checks and deployment

- `npm run lint` runs ESLint.
- `npm run build` creates the production build.
- `npm run start` serves the production build locally.

To deploy, import this folder as a Next.js project in Vercel, configure the environment variables above, and deploy. Configure the required Resend values in Vercel before inviting visitors to submit the form.
