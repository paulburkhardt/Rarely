# Rarely - Digital Health Diary

## Overview
Rarely is a digital health diary application designed for patients with rare cardiac conditions. It helps users track their:
- Daily medications and adherence
- Symptoms and their severity
- Physical activities and exercise
- Mood and general wellbeing

## Key Features
- 📊 Dashboard with daily health overview
- 💊 Medication tracking with multiple time slots
- 🏃‍♂️ Activity logging with intensity levels
- 😊 Mood tracking
- 🤒 Symptom monitoring
- 📱 Mobile-first responsive design

## Project Structure
rarely/
├── components/
│   ├── Dashboard.tsx        # Main dashboard view
│   ├── DiaryDialog.tsx      # Daily diary entry dialog
│   ├── Onboarding.tsx      # First-time user setup
│   └── ui/                  # Reusable UI components
├── data/
│   └── diary.ts            # Default data and types
├── hooks/
│   └── useDiaryState.tsx   # Shared state management
├── public/
│   └── assets/             # Static assets
└── styles/
    └── globals.css         # Global styles

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

# Clone the repository
```sh
git clone https://github.com/yourusername/rarely.git
```

# Install dependencies
```sh
cd rarely
npm install
```

# Start development server
```sh
npm run dev
```

## Key Components

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

## Data Management
- Session storage for daily entries
- Local storage for user preferences
- Type-safe data structures with TypeScript

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Design inspiration from modern health apps
- Shadcn UI for component library
- Community feedback and contributions