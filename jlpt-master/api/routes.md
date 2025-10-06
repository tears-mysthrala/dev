# API Routes Plan

## Authentication Routes
- POST /api/auth/register - Register new user (no auth required)
- POST /api/auth/login - Login user (no auth required)
- GET /api/auth/me - Get current user info (auth required)

## Content Routes
- GET /api/vocab?level=N5 - Get vocabulary by level (auth optional)
- GET /api/kanji?char=日 - Get kanji details (auth optional)
- GET /api/grammar?level=N5 - Get grammar rules (auth optional)
- GET /api/reading?level=N5 - Get reading passages (auth optional)
- GET /api/listening?level=N5 - Get listening exercises (auth optional)

## Progress Routes
- GET /api/progress - Get user progress (auth required)
- POST /api/progress - Update user progress (auth required)

## Search Route
- GET /api/search?term=word - Search across content (auth optional)

All routes requiring auth will use JWT in Authorization header.
