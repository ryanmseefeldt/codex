# Quick Start Guide - Running LOK|A| AI Chatbot

## Prerequisites

Make sure you have Node.js and npm installed on your system.

## Option 1: Standalone React App (Recommended)

### Step 1: Create a new React app

```bash
npx create-react-app loki-ai-app
cd loki-ai-app
```

### Step 2: Install dependencies

```bash
npm install lucide-react
```

### Step 3: Copy the LOK|A| component

Copy the entire `L0KI` folder into your `src` directory:

```bash
cp -r /path/to/codex/L0KI ./src/
```

### Step 4: Configure environment variables

Create a `.env` file in the root of your project:

```bash
cp src/L0KI/.env.example .env
```

Edit `.env` and add your API keys:

```env
REACT_APP_CLAUDE_API_KEY=your-claude-api-key
REACT_APP_OPENAI_API_KEY=your-openai-api-key
REACT_APP_GEMINI_API_KEY=your-gemini-api-key
```

### Step 5: Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Copy the Tailwind configuration:

```bash
cp src/L0KI/tailwind.config.example.js tailwind.config.js
```

Update `src/index.css` to include Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 6: Update App.js

Replace the contents of `src/App.js`:

```javascript
import React from 'react';
import MultiAIChatbot from './L0KI/AI';
import './index.css';

function App() {
  return <MultiAIChatbot />;
}

export default App;
```

### Step 7: Run the app

```bash
npm start
```

The app will open at `http://localhost:3000`

## Option 2: Quick Test with Code Sandbox

1. Go to https://codesandbox.io/
2. Create a new React sandbox
3. Copy the contents of `L0KI/AI.jsx` into a new file
4. Install dependencies: `lucide-react`, `tailwindcss`
5. Configure Tailwind CSS
6. Add your API keys to environment variables
7. Import and use the component

## Option 3: Integration into Existing React App

If you already have a React app:

1. Copy the `L0KI` folder to your `src` directory
2. Install dependencies: `npm install lucide-react`
3. Configure Tailwind CSS (see Step 5 above)
4. Add environment variables to your `.env` file
5. Import and use the component:

```javascript
import MultiAIChatbot from './L0KI/AI';

function MyPage() {
  return (
    <div className="h-screen">
      <MultiAIChatbot />
    </div>
  );
}
```

## Getting API Keys

### Claude AI
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `sk-ant-api03-`)

### OpenAI (ChatGPT)
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new secret key
5. Copy the key (starts with `sk-proj-`)

### Google Gemini
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Create an API key
4. Copy the key (starts with `AIzaSy`)

## Troubleshooting

### Error: "Module not found: Can't resolve 'lucide-react'"

```bash
npm install lucide-react
```

### Error: "Module not found: Can't resolve 'tailwindcss'"

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### API Key Error: "Invalid API key"

- Double-check your API keys in the `.env` file
- Make sure there are no extra spaces or quotes
- Restart your development server after updating `.env`
- Verify the keys are active and have credits/quota

### Styling Issues

Make sure:
1. Tailwind CSS is properly configured
2. `@tailwind` directives are in your CSS file
3. The Tailwind config includes the L0KI directory in `content`

### CORS Errors

This is normal when running in development. For production:
1. Implement a backend proxy to make API calls
2. Never expose API keys in the frontend
3. Use environment variables on the server side

## Need Help?

- Check the README.md for detailed documentation
- Review the CHANGELOG.md for recent updates
- Ensure all dependencies are installed
- Verify your API keys are valid and active

## Current Version

**LOK|A| v2.1.0**

Features:
- Claude AI ❋
- ChatGPT ֎
- Gemini ✦

All three models with enhanced API connectivity and professional styling!
