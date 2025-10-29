# LOK|A| - Multi-Model AI Intelligence Platform

A professional, enhanced AI chatbot interface that connects to multiple AI models: Claude AI, ChatGPT, and Gemini.

## Features

✨ **Multi-Model Support**
- **Claude AI** - Anthropic's advanced AI assistant with image logo display
- **ChatGPT ֎** - OpenAI's GPT-4 model
- **Gemini ✦** - Google's Gemini Pro model

🎨 **Professional UI**
- Grok-style animated background with gradient orbs
- Smooth animations and transitions
- Clean, modern design with backdrop blur effects
- Responsive layout

🔧 **Enhanced Functionality**
- Full conversation history maintained across all models
- Switch between models seamlessly
- Real-time API integration
- Improved error handling with detailed troubleshooting
- Auto-scroll to latest messages
- Clear chat functionality

## Setup Instructions

### 1. Install Dependencies

```bash
npm install react lucide-react
# or
yarn add react lucide-react
```

### 2. Add Claude AI Logo

Place the Claude AI logo image at:
```
L0KI/images/Claude_AI_Logo.png
```

> **Note**: The original Windows path `C:\Users\Owner\Downloads\Claude_AI_Logo.png` needs to be copied to the project's `L0KI/images/` directory for web accessibility.

### 3. Configure API Keys

**IMPORTANT**: This component requires API keys for all three AI services.

#### Step 1: Copy the environment template
```bash
cp .env.example .env
```

#### Step 2: Get your API keys

- **Claude AI**: https://console.anthropic.com/
- **OpenAI (ChatGPT)**: https://platform.openai.com/api-keys
- **Google Gemini**: https://makersuite.google.com/app/apikey

#### Step 3: Update your `.env` file

```bash
# .env file (DO NOT commit this file!)
REACT_APP_CLAUDE_API_KEY=sk-ant-api03-xxxxx
REACT_APP_OPENAI_API_KEY=sk-proj-xxxxx
REACT_APP_GEMINI_API_KEY=AIzaSyxxxxx
```

#### Step 4: Restart your development server

The environment variables will be loaded when you start your React app.

> ⚠️ **Security Warning**: The `.env` file is already in `.gitignore`. Never commit API keys to version control!

### 4. Import and Use

```javascript
import MultiAIChatbot from './L0KI/AI';

function App() {
  return <MultiAIChatbot />;
}
```

## Component Architecture

### API Handlers

The component uses dedicated handler functions for each API:

- `callClaudeAPI()` - Handles Anthropic Claude API requests
- `callOpenAIAPI()` - Handles OpenAI ChatGPT API requests
- `callGeminiAPI()` - Handles Google Gemini API requests

Each handler includes:
- Proper request formatting
- Comprehensive error handling
- Response validation
- Conversation history management

### State Management

- `messages` - Array of all conversation messages
- `input` - Current user input text
- `isLoading` - Loading state for API requests
- `selectedModel` - Currently selected AI model

### Key Improvements

1. **Enhanced API Connectivity**
   - Increased token limits to 4096 for better responses
   - Improved error messages with troubleshooting tips
   - Better response parsing with validation
   - Proper conversation history formatting per API

2. **Professional Formatting**
   - JSDoc comments for all functions
   - Organized code structure with clear sections
   - Consistent naming conventions
   - Enhanced UI animations and transitions

3. **Updated Branding**
   - Claude AI: Logo image display
   - ChatGPT: "ChatGPT ֎" with special character
   - Gemini: "Gemini ✦" with special character

4. **Better Error Handling**
   - User-friendly error messages
   - Detailed troubleshooting steps
   - Visual error indicators
   - Console logging for debugging

## Styling

The component uses Tailwind CSS for styling. Required Tailwind configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        blob: "blob 10s infinite",
      },
    },
  },
};
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Fetch API support required
- CSS backdrop-filter support recommended

## Security Notes

⚠️ **Important**: API keys are currently hardcoded in the component. For production:
1. Move API keys to environment variables
2. Implement backend proxy for API calls
3. Add rate limiting
4. Implement user authentication

## License

This component is part of the Codex project.
