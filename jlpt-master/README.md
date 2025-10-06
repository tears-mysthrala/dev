# JLPT Master - Japanese Language Learning Platform

A comprehensive web application for mastering the Japanese Language Proficiency Test (JLPT), built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Complete JLPT Learning Modules**: Vocabulary, Kanji, Grammar, Reading, Listening, and Quizzes
- **Progressive Web App (PWA)**: Installable with offline capabilities
- **Accessibility First**: WCAG compliant with ARIA labels, keyboard navigation, and screen reader support
- **Gamification**: Badges, streaks, and progress tracking
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Automatic theme switching with user preference persistence
- **Comprehensive Testing**: Unit tests, integration tests, and E2E tests

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Testing**: Jest, React Testing Library, Cypress
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/jlpt-master.git
cd jlpt-master
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/jlptdb
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run unit and integration tests
- `npm run test:e2e` - Run E2E tests
- `npm run test:e2e:open` - Open Cypress test runner

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
# Run tests headlessly
npm run test:e2e

# Open Cypress UI
npm run test:e2e:open
```

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `DB_URL`: Your MongoDB connection string
   - `JWT_SECRET`: Secure JWT secret key
   - `NEXT_PUBLIC_APP_URL`: Your Vercel app URL

3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## Project Structure

```
jlpt-master/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (pages)/           # Application pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
├── models/                # MongoDB models
├── public/                # Static assets
├── __tests__/             # Test files
├── cypress/               # E2E tests
└── styles/                # Global styles
```

## Accessibility

This application follows WCAG 2.1 guidelines and includes:
- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Skip links for navigation
- Focus management
- High contrast support

## PWA Features

- Installable on desktop and mobile
- Offline functionality with service worker
- App manifest with proper metadata
- Native app-like experience

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- JLPT content and structure
- Open source contributors
- Next.js and React communities
