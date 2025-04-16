# Siargao Today

A community-focused platform for Siargao Island that lists daily events and surf instructors.

## Features

- Daily events listing (surf, yoga, parties)
- Surf instructor profiles with Instagram/WhatsApp contacts
- Social login (Google + GitHub) via Clerk.dev
- Comments on instructor profiles
- Mobile-first design

## Tech Stack

- **Frontend**: Next.js + Tailwind CSS + shadcn/ui
- **Auth**: Clerk.dev
- **CMS**: Airtable
- **API**: Next.js API routes
- **Comments**: In-memory storage (MVP)
- **Deployment**: Vercel

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/siargao-today.git
   cd siargao-today
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your environment variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   AIRTABLE_API_KEY=your_airtable_api_key
   AIRTABLE_BASE_ID=your_airtable_base_id
   ```

4. Set up your Airtable base with two tables:
   - **Events**: name (text), time (datetime), location (text)
   - **Surf Instructors**: name (text), instagram (text), whatsapp (text), tags (multiple select)

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The app is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add your environment variables in Vercel's project settings
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
