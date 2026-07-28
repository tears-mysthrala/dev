# dev — JLPT Master (archived learning prototype)

> **Prototype warning:** this repository is an unfinished learning prototype. It is
> kept for historical reference and will be archived. It is **not** production-ready,
> was never deployed, and should not be used as the basis for anything without a
> substantial redesign.

## What this was

A prototype for learning Japanese, structured around the JLPT (Japanese Language
Proficiency Test, levels N5–N1). It was built as an experiment in spec-driven,
AI-assisted development: the project started from detailed specification documents
and an AI agent implemented against them phase by phase.

Specification documents (the actual starting point of the project):

- [Project Specs](project_specs.md)
- [Optimized Project Specs](optimized_project_specs.md)
- [Questions / decisions log](questions.md)

## Status

Archived prototype. Development stopped at an early MVP stage:

- Implemented (basic working state):
  - Next.js app scaffold with pages for vocabulary, kanji, grammar, listening,
    flashcards, quizzes, progress dashboard, login, and register.
  - API routes for auth, vocab, kanji, grammar, listening, reading, search, and
    user progress (MongoDB/Mongoose models with seed scripts).
  - Audio playback for the listening module via Howler.js.
  - PWA scaffold (manifest, install prompt), search bar with keyboard navigation.
  - Initial Jest + React Testing Library tests and Cypress E2E skeletons.
- Never finished or verified end-to-end:
  - No reading page (API route and model exist, UI was never built).
  - No deployment was performed (Vercel config exists but was never used).
  - Test coverage is minimal; content seeding depends on external APIs/datasets.
  - The `jlpt-master/README.md` feature list describes the *intended* scope from
    the specs, not verified, working behavior.

## Technologies

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS
- MongoDB with Mongoose, JWT + bcryptjs auth
- Howler.js (audio), Chart.js (progress charts)
- Jest, React Testing Library, Cypress
- Vercel-oriented deployment config (never exercised)

## What was learned

- Spec-driven AI development workflow: writing granular specs with acceptance
  criteria first, then having an agent implement against them (`questions.md`
  captures the decision log of that process).
- Setting up a full-stack Next.js app from scratch: App Router structure, API
  routes, Mongoose models, JWT auth, testing setup (Jest/RTL/Cypress), PWA basics.
- Where the approach broke down: the spec grew far beyond what an early prototype
  could deliver, and the UI/UX, content pipeline, and learning methodology
  (Spanish meanings, furigana, reading-first approach) were never designed for
  the actual learner's needs.

## Why it needs a substantial redesign

The prototype targeted "JLPT prep app" generically and in English. Any future
version would need a different learning model (reading-first, furigana support,
meanings in Spanish, optional Basque as an intermediate language, dictation,
technical vocabulary, local progress tracking — possibly as a Flutter app instead
of a web app). Reusing this codebase would cost more than rebuilding around those
requirements.

## License

No license file is present. The inner `jlpt-master/README.md` mentions MIT, but
this was never confirmed — treat as undecided.
