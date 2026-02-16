# UI Specification

## 1. Purpose / Scope

- Target: Specification for user-facing UI
- MVP scope:
  - Authentication and onboarding
  - Home screen
  - Core features
  - History and results display
  - Settings and payments

## 2. User Personas / Key Scenarios

### User Personas
- [Define application-specific user personas]

### Key Scenarios
- First-time onboarding -> Profile setup -> Start using features
- Configuration -> Use features -> Review results

### Experience Goals by User Journey Phase
| Phase | Goal | Emotional Design |
|-------|------|------------------|
| First visit | Understand the value within 30 seconds | "This looks easy to get started with" |
| Onboarding | Complete within 2 minutes | "That was easy, I'm ready to go" |
| First use | Complete smoothly | "That was easier than I expected" |
| Reviewing results | Gain tangible value | "I want to try again" |
| Continued use | Feel growth and build a habit | "I'm definitely improving" |

## 3. Information Architecture / Navigation

### Global Navigation
- Footer nav (mobile) / Side nav (desktop)
  - Home
  - Start feature
  - History
  - Pricing / Plans
  - Settings

### Screen Structure (MVP)
1. Landing / Value proposition
2. Sign up / Log in
3. Onboarding (profile setup)
4. Home (dashboard)
5. Feature configuration
6. Core feature
7. Results / Feedback
8. History list / Details
9. Plan selection / Payment
10. Settings (account / notifications)

### Navigation Design Principles
- **Shortest path guaranteed**: Any feature can be started within 2 taps from any screen
- **Context preservation**: Users can resume where they left off after interruption
- **Progressive disclosure**: Show only essentials at first, reveal advanced settings as users become familiar

## 4. Screen-by-Screen UI Specification

### 4.1 Landing
- Purpose: Value proposition / Sign-up conversion
- Key elements:
  - Hero: Value message
  - Key feature highlights
  - Pricing table
  - CTA ("Get started for free")

### 4.2 Sign Up / Log In
- Purpose: Account creation / Returning login
- Key elements:
  - Email / Password / Social login
  - Terms of service consent checkbox
  - Error display (empty fields / invalid format)

### 4.3 Onboarding

#### Step 1: Basic Information (Required)
- Nickname (display name)
- Basic profile

#### Step 2: Goal Setting (Optional, multiple selection)
- Select usage purpose

#### Step 3: Environment Check
- Required permission requests
- Functionality verification

- Behavior:
  - **Each step is skippable** (labeled "can be configured later")
  - **CTA to start using features immediately** shown after completion

### 4.4 Home (Dashboard)
- Purpose: Clear path to features + motivation for continued use

#### Main CTA Area
- **Start button**: "Get Started"
- **Shortcuts**: Select frequently used settings with one tap

#### Progress / Statistics Area
- Total usage count
- Days used this week
- **Growth graph**: Historical trends

#### Recommendations / Feedback Area
- Today's recommendations
- Recent result highlights
- "Previous improvement points" reminder

### 4.5 Feature Configuration

**Step 1: Configuration Selection**
- Mode selection
- Option selection

**Step 2: Environment Check (Required on first use only, skippable afterwards)**
- Verify required settings
- "Ready to Go" button to start

### 4.6 Core Feature
- Purpose: Deliver the core functionality

#### Screen Layout
- Main content display
- Progress indicator
- End button

### 4.7 Results / Feedback
- Purpose: Help users understand results immediately and guide them to next actions

#### Overall Evaluation Area
- **Score display**: Rating
- **One-line summary**: Brief overview

#### Key Points
- Strengths (1-2 points)
- Areas for improvement (1-2 points)

#### Next Actions
- **Try again now**: Retry
- **Use with different settings**
- **Return to home**

### 4.8 History List / Details
- Purpose: Visualize usage and foster a sense of growth

#### List View
- History list (date/time / settings / results)
- **Filters**: By setting / By time period
- **Growth graph**: Visualize trends

#### Detail View
- Full results
- Detailed information

### 4.9 Plan Selection / Payment
- Purpose: Pricing comprehension and upsell
- Key elements:
  - Pricing table
  - Plan comparison
  - Payment input / Confirmation screen

### 4.10 Settings
- Purpose: Account / Notification management
- Key elements:
  - Profile editing
  - Notification settings
  - Account deletion / Data removal

## 5. UI Component Specification (Shared)

### Buttons
- Primary: Start / Submit / Next
- Secondary: Skip / Later / Cancel
- Ghost: Supplementary actions
- Destructive: Delete / Unsubscribe

### Cards
- History / Feedback summary / Suggestions
- Tone: glass / soft / ink

### Tags and Badges
- Category
- Difficulty
- Status (Complete / In Progress / Not Started)

### Status Indicators
- Connection status / In progress
- Loading / Error / Success

### Progress Indicators
- Step indicator
- Progress bar

### Modals / Overlays
- Confirmation dialog
- Survey modal
- Error overlay

### Feedback Display
- Toast notifications (success / error / info)
- Inline errors (during form input)

## 6. State Management and Error Handling (UI)

### Network Errors
- Retry button + auto-reconnect indicator
- Progress indicator during reconnection

### Permission Denied
- Permission guidance display
- OS-specific setup instructions

### Interruption
- Interruption reason selection (optional) + history save
- "Resume where you left off" feature

### Loading States
- Skeleton UI (maintains content shape)
- Descriptive text explaining the ongoing process

## 7. Accessibility / Devices

- Mobile-first
- Focus management and screen reader label support
- Keyboard navigation support
- High contrast mode
- Font size adjustment option
- Screen reader support (ARIA attributes)

## 8. Micro-interactions / Animations

### Purpose
- Provide clear feedback for user actions
- Reduce perceived wait time
- Create a sense of fun and achievement

### Application Points
- Button hover / tap: Subtle scale change
- Page transitions: Fade or slide
- Start: Countdown animation
- Completion: Achievement effect
- Score display: Count-up animation

### Notes
- Keep animations short (200-300ms)
- Support reduced motion preference (prefers-reduced-motion)

## 9. API Integration Notes (MVP)

### User API
- Get user info: `GET /me`
- Update user info: `PUT /me`
- Dashboard: `GET /me/dashboard`

### Task API
- Start task: `POST /tasks`
  - Request: `{ type, config? }`
  - Response: `{ id, status, ... }`
- Get task: `GET /tasks/{taskId}`
- Complete task: `POST /tasks/{taskId}/completion`

### Implementation Status
- Authentication: Implemented (Google OAuth + Better Auth)
- Session management: Implemented
- Payments: Implemented (Stripe)
