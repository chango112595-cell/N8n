# Design Guidelines: Aurora GitHub Changeset Manager

## Design Approach

**Selected Approach:** Reference-Based (GitHub + Linear Hybrid)
- **Primary Reference:** GitHub's clean, developer-focused interface
- **Secondary Reference:** Linear's minimalist aesthetics and typography
- **Justification:** As a developer tool for GitHub integration, adopting familiar GitHub patterns ensures immediate usability while Linear's refinement elevates the experience

**Core Principles:**
1. Function over decoration - every element serves a purpose
2. Developer-friendly dark mode as default
3. Clear status communication through color and typography
4. Minimal cognitive load with familiar patterns

## Color Palette

**Dark Mode (Primary):**
- Background Base: `220 13% 9%` (deep charcoal, similar to GitHub dark)
- Surface: `220 13% 13%` (elevated panels)
- Border: `220 13% 20%` (subtle separation)
- Text Primary: `220 9% 98%` (high contrast white)
- Text Secondary: `220 9% 65%` (muted gray)

**Semantic Colors:**
- Success: `142 71% 45%` (GitHub green for successful commits)
- Error: `0 72% 51%` (clear red for failures)
- Warning: `38 92% 50%` (amber for pending states)
- Info: `217 91% 60%` (subtle blue for informational states)

**Accent (Minimal Use):**
- Primary Action: `217 91% 60%` (blue for CTAs, similar to GitHub buttons)

## Typography

**Font Stack:**
- Primary: `Inter` via Google Fonts CDN (clean, developer-friendly)
- Monospace: `'JetBrains Mono', 'Fira Code', monospace` for code/JSON display

**Hierarchy:**
- Page Title: `text-2xl font-semibold` (32px)
- Section Heading: `text-lg font-medium` (20px)
- Body Text: `text-sm` (14px)
- Labels/Captions: `text-xs text-secondary` (12px)
- Code/JSON: `text-sm font-mono` (14px monospace)

## Layout System

**Spacing Primitives:** Use Tailwind units of `2, 4, 6, 8, 12, 16`
- Component padding: `p-4` or `p-6`
- Section spacing: `space-y-6` or `space-y-8`
- Grid gaps: `gap-4` or `gap-6`
- Container max-width: `max-w-6xl mx-auto px-4`

**Grid Structure:**
- Main layout: Single column with max-w-6xl centering
- Dashboard cards: 2-column grid on desktop (`grid-cols-1 md:grid-cols-2 gap-6`)
- Commit history: Full-width single column table/list

## Component Library

**Navigation:**
- Minimal top bar with app title and GitHub connection status
- Height: `h-16` with border-bottom
- No complex navigation needed for single-purpose tool

**Forms:**
- Textarea for JSON input: Dark background `bg-surface`, monospace font, `min-h-48`
- Submit button: `bg-blue-600 hover:bg-blue-700` with medium sizing
- Labels: `text-sm font-medium mb-2`
- Input borders: `border border-border focus:border-blue-500`

**Status Cards:**
- Rounded corners: `rounded-lg`
- Padding: `p-6`
- Background: `bg-surface`
- Border: `border border-border`
- Icon + text layout with color-coded status badges

**Commit History:**
- Table or list view with alternating row backgrounds
- Columns: Timestamp, Commit Message, Files Changed, Status
- Monospace font for commit hashes and file paths
- Status badges with semantic colors

**Webhooks Display:**
- Code block showing webhook URL with copy button
- Syntax highlighted JSON example
- Border-left accent for important configuration info

**Data Displays:**
- JSON viewer: Syntax highlighted, collapsible sections, dark theme
- File diff preview: GitHub-style green/red highlighting for changes
- Status badges: Pill-shaped with semantic background colors

**Overlays:**
- Toast notifications for success/error (top-right corner)
- Confirmation modal for destructive actions (if any)
- Background: `bg-surface border border-border shadow-xl`

## Animations

**Minimal Motion:**
- Button hover: Subtle background darkening (no transitions)
- Toast slide-in: `slide-in-from-top` (200ms)
- Loading states: Simple spinner, no elaborate animations
- No page transitions or scroll effects

## Page Structure

**Single Dashboard Layout:**
1. **Header** (h-16): App title "Aurora Changeset Manager" + GitHub connection indicator
2. **Main Content** (max-w-6xl mx-auto px-4 py-8):
   - **Webhook Info Card**: Display webhook URL with copy button
   - **Manual Commit Section**: Textarea + submit button for pasting changesets
   - **Recent Commits Table**: Last 10 commits with status, timestamp, and details
3. **Footer** (h-12): Minimal, just webhook endpoint documentation link

## Images

**No Hero Images Required**
- This is a utility dashboard, not a marketing page
- Any imagery should be:
  - GitHub Octocat icon in connection status (small, 24px)
  - Success/error icons in status badges (16px)
  - Optional: Empty state illustration when no commits exist (muted, simple line art)

**Icon Library:**
- Use Heroicons via CDN for UI icons (check, x-mark, clipboard, etc.)
- Outline style for most icons, solid for active states
- Size: 20px for standard UI, 16px for inline text

## Critical UX Patterns

- **Immediate Feedback:** Show loading state when submitting, success/error toast on completion
- **Error Handling:** Display clear error messages with actionable solutions
- **Webhook Status:** Visual indicator showing webhook connectivity (green dot = active, red = inactive)
- **Copy-to-Clipboard:** One-click copy for webhook URL and example payloads
- **Validation:** Client-side JSON validation before submission with error highlighting