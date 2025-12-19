# CompSync - MRA Compliance Platform

AI-powered MRA (Matters Requiring Attention) remediation tracking and lifecycle management platform for banks and financial institutions.

## 🎯 What is CompSync?

CompSync helps banks track and remediate MRA findings from regulatory examinations. It provides:

- **MRA Tracker**: Track findings through their lifecycle from open to closed
- **Evidence Library**: Centralize compliance documents and link them to findings
- **AI Response Generator**: Generate examiner-ready narratives using ChatGPT

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
cd compsync

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔑 API Configuration

To enable AI-powered response generation, you'll need an OpenAI API key:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Add your OpenAI API key to `.env`:
   ```
   VITE_OPENAI_API_KEY=your-api-key-here
   ```

3. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

**Note**: The app works in demo mode without an API key, using mock responses for demonstration purposes.

## 📁 Project Structure

```
compsync/
├── src/
│   ├── components/
│   │   ├── Dashboard/       # Dashboard overview
│   │   ├── MRATracker/      # MRA tracking components
│   │   ├── EvidenceLibrary/ # Document management
│   │   ├── Layout/          # App layout components
│   │   └── ui/              # Reusable UI components
│   ├── services/
│   │   └── openai.ts        # ChatGPT API integration
│   ├── store/
│   │   └── useStore.ts      # Zustand state management
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   └── lib/
│       └── utils.ts         # Utility functions
├── public/                   # Static assets
└── ...config files
```

## 🛠 Customizing AI Prompts

The AI prompts for generating examiner responses are located in `src/services/openai.ts`:

- **SYSTEM_PROMPT**: Defines the AI's role and response guidelines
- **GENERATE_RESPONSE_PROMPT**: Template for generating MRA responses

You can modify these prompts to:
- Adjust tone and formality
- Add specific regulatory requirements
- Include custom response structures
- Add domain-specific terminology

## ✨ Features

### MRA Stages

1. **Open** - Finding received, needs attention
2. **In Progress** - Remediation work underway
3. **Evidence Gathering** - Collecting supporting documents
4. **Under Review** - Response being finalized
5. **Closed** - Remediation complete

### Evidence Categories

- Policies
- Procedures
- Reports
- Training
- Board Minutes
- Other

### AI Response Generation

The AI generates responses that include:
- Professional narrative addressing the finding
- Evidence citations with document references
- Gap analysis for missing documentation

## 🎨 Design System

CompSync uses a professional teal color scheme suitable for compliance software:

- Primary: Deep teal (#0d7377)
- Accent: Bright teal for emphasis
- Status colors for MRA states
- Clean, accessible typography

## 📦 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Radix UI** - Accessible components
- **OpenAI API** - AI response generation

## 🔒 Security Notes

For MVP/demo purposes, this prototype:
- Stores data in browser localStorage
- Does not include authentication
- Should not be used with real customer data

For production deployment, you would need:
- Proper backend with database
- Authentication and authorization
- Data encryption
- SOC 2 compliance measures

## 📝 License

Proprietary - All rights reserved
