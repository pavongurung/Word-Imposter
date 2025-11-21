# Imposter Word Game

## Overview
An interactive multiplayer party game where players try to identify the imposter who doesn't know the secret word. Built with React, TypeScript, Express, and WebSockets for real-time gameplay.

## Recent Changes
- Initial project setup (November 21, 2025)
- Created complete frontend with all game screens
- Implemented vibrant party game color scheme
- Added comprehensive word database with 15 categories
- Set up WebSocket architecture for real-time multiplayer

## Project Architecture

### Frontend (React + TypeScript)
- **Home Screen**: Room creation and joining interface
- **Lobby**: Player management, game settings, and waiting room
- **Role Reveal**: Dramatic reveal showing imposter or secret word
- **Gameplay**: Turn-based clue giving with visual turn indicators
- **Voting**: Player voting interface to identify the imposter
- **Results**: Game outcome reveal with vote tallies

### Backend (Express + WebSockets)
- Real-time game state synchronization across all players
- Room management with unique 6-character codes
- Turn-based game flow orchestration
- Vote counting and imposter detection logic
- Comprehensive word database with 15 categories and 3 difficulty levels

### Design System
- Color Scheme: Vibrant party game aesthetic with purple primary, cyan secondary, and pink accent colors
- Typography: Outfit for display text, Inter for body text, JetBrains Mono for codes
- Components: Shadcn UI components with custom party game styling
- Mobile-first responsive design

## Technology Stack
- **Frontend**: React, TypeScript, Wouter, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, WebSocket (ws)
- **State Management**: In-memory storage for game rooms
- **Real-time Communication**: WebSocket protocol

## Game Features
- 4-10 player multiplayer support
- 15 word categories (Food, Animals, Movies, Sports, Places, Jobs, Objects, Vehicles, Holidays, School, Silly, Fantasy, Technology, Nature, Music)
- 3 difficulty levels (Easy, Medium, Hard)
- Customizable game settings (clue rounds, phrase mode)
- Real-time player synchronization
- Automatic imposter assignment
- Turn-based clue system
- Voting mechanics with majority rule
- Beautiful animations and transitions

## Development Status
- ✅ Frontend components complete
- ⏳ Backend WebSocket server (in progress)
- ⏳ Game logic implementation (pending)
- ⏳ Word database setup (pending)
- ⏳ Integration and testing (pending)
