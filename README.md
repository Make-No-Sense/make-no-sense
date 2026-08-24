# Make No Sense

Website and admin portal for Make No Sense, a Nashville food truck.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

```bash
npm run lint
npm run build
npm run start
```

## Main Services

- Next.js app routes live in `src/app`
- Sanity content schemas live in `src/sanity/schemaTypes`
- Supabase admin tools live in `src/app/admin`
- Contact and alert emails use Resend
- Truck location data uses Google Calendar, Google Maps, and Street Food Finder
