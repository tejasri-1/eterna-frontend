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




