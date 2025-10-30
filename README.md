# LandLord.ly

AirBnB-like full-stack web app simulation.

## Installation

1. Clone the repo

`git clone https://github.com/dugalcedo/bnb-uppgift-doug <desired folder name or .>`

2. Install both apps (it's two apps)

- with npm
    `npm run install-full:npm`
- or with pnpm
    `pnpm run install-full`
- or with bun
    `bun run install-full:bun`

3. Ensure environment variables are present in the root folder

```env
# .env

PORT=6392

MONGO_DB_URI="enter mongodb connection uri here"

JWT_SECRET="make up a secret here "

FRONTEND_DOMAIN="http://localhost:5173"

GEOCODING_API_KEY="geocoding api key here"
# Get a free API key from https://www.geoapify.com/geocoding-api/

```

## Development

- with npm
    `npm run dev:npm`
- or with pnpm
    `pnpm run dev`
- or with bun
    `bun run dev:bun`

## Live URL

https://bnb-uppgift-doug.onrender.com/
There may be a slow cold-start because it's on Render's free tier.