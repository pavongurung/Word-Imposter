# Design Guidelines: Interactive Imposter Word Game

## Design Approach

**Reference-Based: Social Party Games**
Drawing inspiration from successful multiplayer party games like Jackbox Party Pack, Among Us, and Kahoot - focusing on playful energy, crystal-clear game states, and immediate visual feedback. The design prioritizes fun, readability, and instant comprehension across all game phases.

## Typography

**Font Families:**
- Primary: 'Fredoka' (Google Fonts) - Rounded, friendly display font for headings and game UI
- Secondary: 'Inter' (Google Fonts) - Clean sans-serif for body text and player lists

**Hierarchy:**
- Game Title/Headers: text-4xl to text-6xl, font-bold
- Room Codes/Key Info: text-3xl to text-4xl, font-semibold, tracking-wider
- Player Names: text-xl, font-medium
- Clues/Game Text: text-2xl, font-semibold
- Body/Instructions: text-base to text-lg
- Buttons: text-lg, font-semibold

## Layout System

**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-6, p-8
- Section spacing: gap-4, gap-6, gap-8
- Page margins: p-4 (mobile), p-8 (desktop)
- Card spacing: space-y-4, space-y-6

**Container Strategy:**
- Max-width: max-w-4xl for game screens
- Centered layouts: mx-auto
- Full-width mobile: w-full with controlled inner max-widths

## Component Library

### Core Game Screens

**1. Lobby/Join Screen:**
- Large centered card with room code display
- Player list with live join animations
- Category/difficulty selector with pill-style buttons
- Start button (disabled until minimum players)
- Player avatars: colorful circles with initials

**2. Role Assignment Screen:**
- Full-screen reveal with dramatic entrance
- Large card showing either "THE SECRET WORD" or "YOU ARE THE IMPOSTER"
- Countdown timer before game starts
- Pulsing animation for emphasis

**3. Game Play Screen:**
- Top bar: Round indicator, timer, player count
- Center stage: Current player spotlight with large avatar
- Clue display area: Previous clues shown as flowing cards/bubbles
- Player grid: Shows all players with turn indicators
- Your turn highlight: Glowing border, input field appears

**4. Voting Screen:**
- Grid of player cards (2-3 columns on desktop, 1 on mobile)
- Each card: Avatar, name, clickable for selection
- Selected state: prominent border, checkmark
- Vote counter showing who voted
- Submit vote button (large, bottom-fixed on mobile)

**5. Reveal Screen:**
- Dramatic full-screen reveal
- Imposter identity shown with special styling
- Secret word displayed prominently
- Score update with animation
- "Play Again" and "New Word" buttons

### UI Components

**Player Cards:**
- Rounded corners (rounded-xl)
- Padding: p-6
- Avatar circles: Large colorful initials (w-16 h-16)
- Name below avatar
- Status indicators (turn arrow, imposter badge, voted checkmark)

**Room Code Display:**
- Monospace-style presentation
- Extra large text (text-5xl)
- Letter-spacing for clarity
- Copy button with icon

**Clue Bubbles:**
- Flowing horizontal scroll on mobile
- Stacked vertically on desktop
- Each bubble: rounded-2xl, p-4
- Player name small above clue
- Alternating alignment (left/right) for variety

**Category Selector:**
- Horizontal scrollable pill buttons
- Active state: filled background
- Inactive: outline style
- Icons for each category (Food 🍕, Animals 🦁, Movies 🎬, etc.)

**Timer Display:**
- Circular progress indicator
- Numbers in center
- Pulsing when time running low
- Positioned top-right or centered in header

**Buttons:**
- Primary actions: Large rounded buttons (rounded-xl), py-4 px-8
- Secondary: Outlined style, same padding
- Icon + text combinations where helpful
- Hover states: slight scale transform
- Disabled state: opacity-50, cursor-not-allowed

### Game State Indicators

**Turn Arrows/Highlights:**
- Glowing outline on current player card
- Arrow icon pointing to active player
- Subtle pulse animation

**Status Badges:**
- Small pill-shaped badges
- "Host", "Waiting", "Voted", "Imposter" (only on reveal)
- Absolute positioned top-right of player cards

**Loading States:**
- Spinner for joining/waiting
- Skeleton screens for player loading
- "Waiting for players..." messaging

## Navigation & Structure

**Header (Lobby & Game):**
- Game logo/title (left)
- Room code (center)
- Settings/Leave button (right)
- Sticky on scroll

**Mobile Optimization:**
- Bottom-fixed action buttons for key interactions
- Larger tap targets (min h-12)
- Simplified grids (1-2 columns max)
- Horizontal scrolling for clue history

## Responsive Breakpoints

- Mobile-first approach
- sm (640px): 2-column player grids
- md (768px): Enhanced spacing, larger text
- lg (1024px): 3-column layouts where appropriate
- Full game playable on mobile devices in portrait

## Animations

**Minimal & Purposeful:**
- Player join: Fade-in + slide-up (200ms)
- Turn transition: Spotlight effect on active player
- Vote submission: Confetti burst on reveal
- Imposter reveal: Dramatic flip/rotation
- NO scroll-triggered animations
- NO background parallax

## Images

**No hero images needed** - this is a game interface, not a marketing site. Focus on:
- Placeholder avatar system with generated colors
- Category icons (use emoji or icon library)
- Victory/game-over illustrations (simple SVG icons)
- Optional: Confetti effect on game conclusion

## Accessibility

- High contrast text on all backgrounds
- Keyboard navigation for all interactions
- Clear focus states (ring-2 ring-offset-2)
- ARIA labels for game state announcements
- Screen reader friendly turn notifications