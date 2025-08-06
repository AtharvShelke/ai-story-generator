# AI Story Generator

AI Story Generator is a full-stack web application that allows users to generate, play, and manage AI-generated stories based on custom themes. The project leverages modern web technologies for the frontend and a robust Python backend with database support.

## Features

- Generate unique stories using AI based on user-provided themes
- Interactive story game mode
- Save and load generated stories
- Job management for story generation tasks
- Responsive and modern UI

## Tech Stack

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** FastAPI, Python
- **Database:** SQLite
- **Other:** RESTful API, modular code structure

## Project Structure
ai-story-generator/
├── backend/
│ ├── core/
│ ├── db/
│ ├── models/
│ ├── routers/
│ ├── schemas/
│ ├── main.py
│ └── requirements.txt
└── frontend/
├── public/
├── src/
├── package.json
└── vite.config.js


## Getting Started

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

- Open the frontend in your browser (default: `http://localhost:5173`)
- Enter a theme and generate a story
- Play the story game or manage your generated stories

