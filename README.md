# Make No Sense 🚚

> Nashville's boldest food truck. Unforgettable flavors, zero apologies.

Official website for **Make No Sense**, a Nashville-based food truck business. Built as a full-stack web application with a headless CMS, live event scheduling, and a contact form.

🔗 **Live site:** [make-no-sense.vercel.app](https://make-no-sense.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| CMS | Sanity.io |
| Hosting | Vercel |
| Email | Resend |
| Maps | Google Maps Embed API |
| Events | Google Calendar API |

---

## Pages

- `/` — Homepage with hero section and truck intro
- `/menu` — Full menu managed via Sanity CMS
- `/find-us` — Live event schedule via Google Calendar + map embed
- `/gallery` — Photo gallery managed via Sanity CMS
- `/about` — Brand story and team
- `/contact` — Contact form powered by Resend
- `/studio` — Sanity Studio (CMS dashboard)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Sanity account
- Google Cloud project (for Calendar + Maps APIs)
- Resend account

### Installation

```bash
git clone https://github.com/Jadjei21/makenosense.git
cd makenosense
npm install
```

### Environment Variables

Create a `.env.local` file in the root with the following:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Google
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
GOOGLE_CALENDAR_ID=your_calendar_id
GOOGLE_API_KEY=your_api_key

# Resend
RESEND_API_KEY=your_resend_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## CMS

Content is managed through Sanity Studio at `/studio`. The following content types are available:

- **Menu items** — name, description, price, category, image
- **Gallery images** — photos with captions
- **Site settings** — truck image, social links, contact info

---

## Design

- **Color palette:** Dark-first, truck-red primary accent, neon-cyan reserved for the Find Us page
- **Typography:** Fredoka One (headings), DM Sans (body)

---

## Deployment

The site is deployed on **Vercel** with automatic deployments on push to `main`.

DNS is managed through **GoDaddy** pointing to Vercel.

---

## Contact

**Developer:** [Lanski](https://github.com/mayaajike)
