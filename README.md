# Rarely - Digital Health Diary

With our app, Rarely, we tackle the challenges faced by individuals with rare diseases by providing access to information, personalized guidance, and a supportive community. At the same time, we collect anonymized data to advance research and drive progress in treatment development.
Your rare story, our shared mission.

## Key Features
- 📊 Dashboard with daily health overview
- 💊 Medication tracking with multiple time slots
- 🏃‍♂️ Activity logging with intensity levels
- 😊 Mood tracking
- 🤒 Symptom monitoring
- 📱 Mobile-first responsive design

## Project Structure
```
rarely/
├── app/
│   ├── chat/                # Chat interface with AI assistant
│   │   └── page.tsx
│   ├── forum/              # Community forum pages
│   │   └── page.tsx
│   ├── resources/          # ACM resources and information
│   │   └── page.tsx
│   ├── sharing/            # Data sharing settings
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Dashboard.tsx       # Main dashboard view
│   ├── DiaryDialog.tsx     # Daily diary entry dialog
│   ├── Onboarding.tsx     # First-time user setup
│   ├── bottom-nav.tsx     # Bottom navigation bar
│   └── ui/                # Reusable UI components
├── contexts/
│   └── UserContext.tsx    # User data and state management
├── data/
│   ├── diary.ts          # Default data and types
│   └── mock-data.ts      # Mock data for development
├── hooks/
│   ├── use-media-query.ts
│   └── useDiaryState.tsx # Shared state management
├── lib/
│   └── utils.ts          # Utility functions
├── public/
│   ├── assets/           # Static assets
│   └── icons/            # Icon assets
└── styles/
    └── globals.css       # Global styles
```

## Technology Stack
- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide Icons
- React Icons
- Shadcn UI Components

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Installation

#### Clone the repository
```sh
git clone https://github.com/yourusername/rarely.git
```

#### Install dependencies
```sh
cd rarely
npm install
```

#### Start development server
```sh
npm run dev
```

## Key Components



### Onboarding Dialog
First-time user setup process including:
- Personal health profile creation
- Symptom frequency assessment
- Medication schedule setup
- Exercise preference configuration
- Data sharing preferences

### Dashboard
The main interface showing:
- Daily medication tracking
- Activity monitoring
- Symptom logging
- Quick access to diary entries

### Diary Dialog
Handles daily health data entry including:
- Medication adherence tracking
- Symptom severity recording
- Activity logging
- Mood tracking

### Forum Page
Community engagement platform featuring:
- Discussion groups for different ACM topics
- Treatment and medication discussions
- Exercise and lifestyle advice sharing
- Direct messaging with other patients
- Expert medical professional interactions

### Chat Page
AI-powered assistant that provides:
- Medical document analysis and explanation
- Answers to ACM-related questions
- Personalized health insights
- Document upload capabilities
- Secure and confidential data processing

## Data Management
- Session storage for daily entries
- Local storage for user preferences
- Type-safe data structures with TypeScript

