# Vocabulary Explorer

A beautiful React application for exploring and learning vocabulary words with real-time word definitions.

## Features

- **Vocabulary Chips**: Display of 10 curated vocabulary words in beautiful chip components
- **Search Functionality**: Large search bar with real-time API integration
- **Word Definitions**: Get definitions for any word you search
- **Error Handling**: Graceful error handling with "Do you mean..." suggestions
- **Beautiful Design**: Modern glassmorphism design with gradient backgrounds
- **Responsive**: Works perfectly on desktop and mobile devices

## Environment Configuration

The application uses environment variables to manage API URLs for different environments:

### Environment Variables (.env file)

```env
# Development API URL
VITE_API_URL_DEV=http://localhost:88

# Production API URL
VITE_API_URL_PROD=https://api.dictionaryapi.dev/api/v2/entries/en

# Current environment (dev or prod)
VITE_ENV=dev
```

### Switching Between Environments

- **Development**: Set `VITE_ENV=dev` to use `http://localhost:88`
- **Production**: Set `VITE_ENV=prod` to use the external dictionary API

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your environment variables in `.env` file

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) to view the application

## API Integration

The application automatically switches between development and production API endpoints based on the `VITE_ENV` variable:

- **Development**: Uses your local API server at `http://localhost:88`
- **Production**: Uses the public Dictionary API

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

- **React 19** - UI Framework
- **Vite** - Build tool and development server
- **CSS3** - Styling with modern features (backdrop-filter, gradients)
- **Dictionary API** - Word definitions and meanings
