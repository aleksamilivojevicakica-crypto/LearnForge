# ⚡ LearnForge

**Learn smarter. Remember longer.**

LearnForge is an AI-powered study companion that helps students understand unfamiliar topics, practice with short quizzes, and track their learning progress.

## The problem

Students often need an explanation at the right difficulty level and a quick way to check whether they understood it. Finding both can take time and interrupt studying.

## The solution

LearnForge brings explanations, practice questions, immediate feedback, and a simple progress dashboard together in one website.

## Features

- **Personalized explanations:** Enter a topic, choose a subject and difficulty level, and generate an explanation.
- **AI-generated quizzes:** Generate three multiple-choice questions about the selected topic.
- **Instant feedback:** Check your answers and see explanations for each question.
- **Progress dashboard:** View completed quizzes, average score, and recent sessions.
- **Offline demo:** Explore built-in sample lessons and quizzes without an API key.
- **Local progress storage:** Quiz scores and session history are saved in the browser using `localStorage`.

## Tech stack

- HTML5 and CSS3 — interface and styling
- Vanilla JavaScript — quiz interaction, scoring, and progress tracking
- Node.js — HTTP server and API endpoint
- Google Gemini API — AI-generated learning content

No frontend framework or database is required.

## Run locally

### Requirements

- Node.js 20 or newer
- A Gemini API key for AI-powered features

### Setup

1. Download or clone this repository.
2. In the project folder, create a file named `.env`:

   ```env
   GEMINI_API_KEY=your_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   PORT=3003
   ```

3. Start the server:

   ```bash
   node --env-file=.env server.js
   ```

4. Open the local address printed in the terminal (for example, `http://localhost:3003`).

Without an API key, you can still use the built-in demo lessons and quizzes. To use AI generation, configure a valid key.

## How to use

1. Choose a subject: Mathematics, Science, History, English, or Computer Science.
2. Enter a topic and select Beginner, Intermediate, or Advanced.
3. Click **Explain topic** for an explanation or **Generate quiz** for practice questions.
4. Answer all three quiz questions and click **Check my answers**.
5. Review your feedback and progress dashboard.

## Privacy and limitations

- **Never commit `.env` or API keys to GitHub.** Set `GEMINI_API_KEY` as a secret environment variable when deploying.
- Quiz scores and recent sessions are stored locally in the user's browser.
- When AI mode is used, the chosen subject, topic, and difficulty level are sent to the server and processed by the AI provider.
- AI-generated explanations and quiz answers may contain mistakes; important facts should be verified.
- The app currently supports text-based topics. Photo-based homework checking is not implemented.
- The server applies a basic per-IP request limit to reduce misuse.

## Project status

Built as an educational hackathon MVP for ForgeHacks, in the AI for Education category.

## Future improvements

- Photo-based homework checking
- More question types and personalized revision recommendations
- More detailed progress analytics
