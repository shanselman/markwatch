# MarkWatch - Visual Design Reference

## Main Screen Layout

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                  Solution Overview                     │  ← Topic Name
│           (Large, gradient cyan-to-blue text)          │     (2.5rem, bold)
│                                                        │
│    ╔═══════════════════════════════════════════╗     │
│    ║         ◉ Progress Ring (cyan)            ║     │  ← Outer bezel ring
│    ║    ╔══════════════════════════════╗      ║     │     (metallic gradient)
│    ║    ║           12                  ║      ║     │
│    ║    ║      9     ●     3           ║      ║     │  ← Hour markers
│    ║    ║                               ║      ║     │     (12 white dots)
│    ║    ║           ↑                  ║      ║     │
│    ║    ║           │ Second Hand      ║      ║     │  ← Sweeping hand
│    ║    ║           │ (cyan colored)   ║      ║     │     (6px wide)
│    ║    ║           ●══════════>       ║      ║     │
│    ║    ║                               ║      ║     │
│    ║    ║                               ║      ║     │
│    ║    ║          01:23.45             ║      ║     │  ← Digital time
│    ║    ║    (Large cyan numbers)       ║      ║     │     (MM:SS.ms)
│    ║    ║           6                   ║      ║     │
│    ║    ╚══════════════════════════════╝      ║     │
│    ╚═══════════════════════════════════════════╝     │
│                                                        │
│         ┌─────────┐  ┌─────────┐                     │
│         │ ▶ START │  │ ↻ RESET │                     │  ← Control buttons
│         └─────────┘  └─────────┘                     │     (rounded, cyan)
│                                                        │
│         ┌─────────────────────────────┐              │
│         │ ← Previous   2/7   Next →  │              │  ← Navigation
│         └─────────────────────────────┘              │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## File Upload Screen

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                     MarkWatch                          │  ← App title
│           (Huge gradient logo, 4rem)                   │     (cyan gradient)
│              PRESENTATION TIMER                        │  ← Subtitle
│                                                        │
│    ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐          │
│    │                                       │          │
│    │              ⬆                        │          │  ← Upload icon
│    │                                       │          │     (large, white)
│    │   Drop your topics file here          │          │
│    │                                       │          │  ← Dashed border
│    │      or click to browse               │          │     (hover effect)
│    │                                       │          │
│    │         Supports .txt files           │          │
│    │                                       │          │
│    └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘          │
│                                                        │
│    ┌──────────────────────────────────────┐          │
│    │ File Format                          │          │  ← Format guide
│    │                                      │          │     (example code)
│    │  Topic Name|Duration in Seconds     │          │
│    │  Introduction|90                    │          │
│    │  Problem Statement|120              │          │
│    │  Solution Overview|90               │          │
│    └──────────────────────────────────────┘          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Color States

### Normal State (Cyan - Plenty of Time)
```
Clock colors: Cyan (#06b6d4)
- Second hand: Bright cyan
- Progress ring: Cyan glow
- Center dot: Cyan
- Digital display: Cyan numbers
- Mood: Calm, professional
```

### Warning State (Yellow - 15 Seconds Left)
```
Clock colors: Amber (#f59e0b)
- Second hand: Yellow/amber
- Progress ring: Yellow glow
- Center dot: Yellow
- Digital display: Yellow numbers
- Mood: Attention-getting, but not alarming
```

### Alert State (Red - Time's Up!)
```
Clock colors: Red (#ef4444)
- Second hand: Bright red with glow
- Progress ring: Red with pulse
- Center dot: Red with glow
- Digital display: Red numbers
- Mood: Clear signal to move on
- Animation: Pulsing glow effect
```

## Dimensions & Spacing

```
Stopwatch:
- Total size: 500px × 500px
- Bezel padding: 20px
- Clock face: 90% of bezel (450px)
- Second hand: 40% of radius (90px from center)
- Hand width: 6px
- Center dot: 20px diameter
- Progress ring: 4px stroke width

Typography:
- Topic name: 2.5rem (40px), weight 700
- Digital time: 3rem (48px), weight 700
- Milliseconds: 2rem (32px)
- Button text: 1.1rem (17.6px), weight 600
- Navigation: 1rem (16px)

Spacing:
- Component gap: 2.5rem (40px)
- Button gap: 1rem (16px)
- Topic to clock: 2.5rem
- Clock to controls: 2.5rem
- Controls to navigation: (built into controls section)
```

## Animation Specs

```
Second Hand:
- Rotation: 0° to 360° over topic duration
- Timing: requestAnimationFrame (~60 FPS)
- Easing: Linear
- Transform origin: bottom center

Progress Ring:
- SVG circle with stroke-dashoffset
- Animates from full to empty
- Smooth stroke cap (rounded ends)
- 0.3s transition for color changes

Color Transitions:
- Duration: 0.3s
- Easing: ease
- Applies to: hand, ring, dot, text

Button Hover:
- translateY: -2px
- Shadow increase
- Duration: 0.2s
- Easing: ease

Time's Up Effect:
- Glow shadow on hand: 0 0 20px red
- Glow shadow on dot: 0 0 20px red
- Glow shadow on text: 0 0 20px red
- Ring glow via filter: drop-shadow
```

## Responsive Breakpoints

```
Desktop (Default):
- Stopwatch: 500px
- Topic text: 2.5rem
- Digital time: 3rem
- Full featured layout

Tablet/Mobile (<768px):
- Stopwatch: 350px
- Topic text: 1.8rem
- Digital time: 2rem
- Milliseconds: 1.4rem
- Reduced button padding
- Maintains aspect ratios
```

## Material Effects

```
Bezel (Outer Ring):
- Gradient: #2a2a3e → #1f1f2e
- Shadow: 0 20px 60px rgba(0,0,0,0.5)
- Inset shadow: 0 0 30px rgba(0,0,0,0.3)
- Inset highlight: 0 2px 4px rgba(255,255,255,0.1)
- Effect: Chrome/metallic appearance

Clock Face (Inner Circle):
- Gradient: #2d2d44 → #1a1a2a
- Deep inset: 0 4px 20px rgba(0,0,0,0.6)
- Subtle highlight: 0 -2px 10px rgba(255,255,255,0.03)
- Effect: Recessed, matte finish

Markers:
- Hour (12): White dots with glow
  - Size: 12px
  - Opacity: 0.4
  - Shadow: 0 0 8px rgba(255,255,255,0.3)
- Minute (60): Smaller white dots
  - Size: 3px
  - Opacity: 0.2

Second Hand:
- Gradient: Solid color to white at tip
- Drop shadow: 0 0 4px currentColor
- Hand tip: 12px circle with glow

Buttons:
- Background: rgba(255,255,255,0.05)
- Border: 2px solid rgba(255,255,255,0.1)
- Start: Gradient cyan with glow shadow
- Pause: Gradient amber with glow shadow
- Hover: Lift effect with increased shadow
```

---

This design creates a professional, easy-to-read timer that works perfectly for presentations!
