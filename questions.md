# Questions for User

1. Should I continue implementing the backend API routes (vocab, kanji, etc.) or start on the frontend?
Follow the roadmap phases.
2. For data seeding, should I fetch from the provided APIs or create sample data first?
Try to fetch from provided APIs first, fallback to sample data if issues arise.
3. Any specific preferences for UI design or additional features?
No specific preferences, but a clean and user-friendly design is important.
4. Do you want me to integrate the backend into Next.js API routes instead of separate Express server?
yes, integrate into Next.js API routes.
5. The build is failing due to ESLint errors (prefer-const, no-explicit-any, etc.) in API routes and lib files. Should I fix them by updating the code or disable the rules in ESLint config? The warnings in React components are about missing dependencies in useEffect, which can be fixed by adding useCallback or ignoring.
Fix the ESLint errors by updating the code where feasible, and disable rules only if absolutely necessary.
6. Should I set up Vercel deployment now or later?
you can set up Vercel deployment later, after the main features are implemented and tested.