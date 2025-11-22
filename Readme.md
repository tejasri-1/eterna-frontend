// README.md
# Axiom Trade — Token Discovery (Mock)

**What this is**
- A Next.js 14 + TypeScript + Tailwind mock of Axiom Trade's token discovery table.
- Real-time price mock (WebSocket-like), sorting, popovers, tooltips, modal-ready structure, skeletons and shimmer, responsive down to 320px.

**Run locally**
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

**Project highlights**
- Next.js 14 App Router with server route `/api/mock/tokens`.
- Redux Toolkit to store tokens and apply live updates.
- React Query for fetching and caching.
- Radix UI for popovers/tooltips.
- Framer Motion for subtle transitions.
- Tailwind CSS with shimmer skeletons.
- Simple mock websocket via `useWebSocketMock`.

**Deployment**
- Push to GitHub and deploy to Vercel (auto-detects Next.js).
- Provide public YouTube 1-2 minute video showing app features (record local demo, upload, paste link in README).

**Notes for pixel-perfect verification**
- The UI uses modern layout with `transform`/opacity transitions to avoid layout shifts.
- To reach ≤2px diff, tune Tailwind spacing variables and fonts to match target. Use visual-regression tooling (Regress, Percy) with baseline screenshot.

**Auto-layout snapshots**
- Make screenshots at widths: 320, 375, 768, 1024, 1280 and add to repo `screenshots/` for evaluation.

**Next steps (suggested)**
- Wire a deterministic WebSocket feed for reproducible visual-regression snapshots.
- Add unit tests (Jest + React Testing Library) focusing on sorting and row updates.

