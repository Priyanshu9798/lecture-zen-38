

# AI Lecture Assistant — Phase 1

## Design System
- **Modern & Bold** style with vibrant purple/violet gradients, rounded cards, and shadcn/ui components
- Dark/Light mode toggle from day one
- Fully responsive (mobile-first)
- Clean typography with academic readability

## Pages & Features (Phase 1)

### 1. Authentication Pages
- **Login** and **Signup** pages with email/password forms
- Clean card-centered layout with purple gradient accents
- JWT token stored in memory/localStorage
- Protected route wrapper for authenticated pages
- Secure logout with token cleanup

### 2. Dashboard
- Welcome header with user greeting
- **Lecture list** as modern cards showing title, date, quiz score, and next flashcard review date
- **Search bar** at the top (prepared for semantic search endpoint)
- **Date filter** dropdown
- Empty state for new users with call-to-action to upload first lecture
- Loading skeletons while data loads

### 3. Upload Page
- **Drag & drop zone** with visual feedback (highlight on hover)
- Support for audio (.mp3/.wav) and PDF (up to 30 pages) uploads
- Title input field
- Upload **progress bar** with percentage
- **Processing animation** (pulsing/spinner) after upload completes
- File type validation and size limits with error messages

### 4. Lecture Detail Page
- **Audio Player** bar at the top — seek bar, play/pause, timestamp display, jump-to-timestamp
- **Tabbed interface** with 6 tabs:
  - **Transcript** — scrollable text with clickable timestamps that seek the audio player
  - **Summary** — structured with headings and bullet points
  - **Notes** — editable text area for personal notes
  - **Quiz** — launches quiz interface
  - **Flashcards** — launches flashcard interface
  - **Chat** — ChatGPT-style conversation UI

### 5. Quiz Interface
- One question at a time with progress indicator
- Multiple choice answer selection
- Submit button reveals correct answer + explanation
- Navigation to next question
- Final score screen with percentage and emoji feedback
- Mock "save attempt" action

### 6. Flashcard Interface
- Card with flip animation (question → answer)
- Difficulty rating buttons (1–5) after reveal
- Next review date displayed per card
- Progress through deck indicator

### 7. Chat Interface
- ChatGPT-style message bubbles
- Conversation history panel
- Simulated streaming text responses (character-by-character reveal)
- Auto-scroll to latest message
- Clickable timestamp references in AI responses

## Technical Architecture
- **API service layer** with all endpoints defined (`/upload`, `/generate/{id}`, `/chat/{id}`, etc.) — currently returning mock data, easily swappable
- **React Query** for data fetching and caching
- **React Router** for navigation with protected routes
- **Modular components** organized by feature (auth, dashboard, upload, lecture, quiz, flashcards, chat)
- Clean state management with React hooks and context where needed

## What's NOT in Phase 1
- PDF export button (Phase 2)
- Real backend integration (Phase 2)
- Advanced semantic search (Phase 2 — when backend is ready)

