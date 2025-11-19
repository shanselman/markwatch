# MarkWatch - Presentation Timer

A beautiful, modern stopwatch application designed for timed presentations. Features a sleek analog stopwatch interface with smooth animations and color-coded timing indicators.

## Features

- **Classic Analog Stopwatch Design** - Modern dark theme with smooth second-hand animation
- **Topic Management** - Load multiple topics with custom durations from a text file
- **Color-Coded Status** - Visual indicators for time remaining:
  - 🔵 Cyan: Plenty of time remaining
  - 🟡 Yellow: 15 seconds remaining (wrap up)
  - 🔴 Red: Time's up (with pulsing effect)
- **Precise Timing** - Displays minutes, seconds, and milliseconds
- **Navigation Controls** - Move between topics with Previous/Next buttons
- **Responsive Design** - Works on desktop and mobile devices

## Getting Started

### Installation

```bash
cd markwatch
npm install
```

### Running the Application

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## How to Use

### 1. Create a Topics File

Create a `.txt` file with your presentation topics in the following format:

```
Topic Name|Duration in Seconds
Introduction|90
Problem Statement|120
Solution Overview|90
Technical Architecture|180
Live Demo|200
Q&A Session|300
```

**Format Rules:**
- Each line represents one topic
- Topic name and duration separated by a pipe character (`|`)
- Duration must be a positive number (in seconds)
- Empty lines are ignored

A sample file (`sample-topics.txt`) is included in the project.

### 2. Load Your Topics

1. Launch the application
2. Drag and drop your `.txt` file onto the upload area, or click to browse
3. The stopwatch will load with your first topic

### 3. Control the Timer

**Start/Pause Button** - Begin or pause the timer for the current topic

**Reset Button** - Reset the current topic timer to its full duration

**Previous/Next Buttons** - Navigate between topics

### 4. Visual Indicators

- **Second Hand** - Sweeps smoothly around the clock face showing elapsed time
- **Progress Ring** - Outer ring shows overall progress through the current topic
- **Digital Display** - Shows remaining time in MM:SS.ms format
- **Color Changes** - Automatically changes from cyan → yellow (15s) → red (0s)

## Technical Details

### Built With

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Animations and styling (no external CSS libraries)

### Key Features

- **60 FPS Animation** - Uses `requestAnimationFrame` for smooth second-hand movement
- **SVG Graphics** - Scalable vector graphics for crisp display at any size
- **Gradient Backgrounds** - Modern dark theme with subtle gradients
- **Shadow Effects** - Realistic depth and lighting effects
- **Responsive Layout** - Adapts to different screen sizes

## Project Structure

```
markwatch/
├── src/
│   ├── components/
│   │   ├── Stopwatch.tsx       # Main stopwatch component
│   │   ├── Stopwatch.css       # Stopwatch styling
│   │   ├── FileUpload.tsx      # File upload component
│   │   └── FileUpload.css      # Upload styling
│   ├── App.tsx                  # Main app logic
│   ├── App.css                  # App styling
│   └── index.css                # Global styles
├── sample-topics.txt            # Example topics file
└── README.md                    # This file
```

## Tips for Best Results

1. **Test your topics file** before your presentation
2. **Use realistic durations** - practice speaking to ensure timing is accurate
3. **Watch for color changes** - yellow at 15s means start wrapping up
4. **Prepare transitions** - use Previous/Next to move between topics
5. **Consider total time** - ensure all topic durations fit your presentation slot

## Customization

### Changing Colors

Edit the color values in `src/components/Stopwatch.tsx`:

```typescript
const getStatusColor = () => {
  if (remainingMs <= 0) return '#ef4444' // red
  if (remainingMs <= 15000) return '#f59e0b' // yellow
  return '#06b6d4' // cyan - change this for your brand color
}
```

### Adjusting Warning Threshold

Change the 15-second warning time in the same function by modifying `15000` (milliseconds).

### Modifying the Stopwatch Size

Edit `.stopwatch` in `src/components/Stopwatch.css`:

```css
.stopwatch {
  width: 500px;  /* Change both values */
  height: 500px;
}
```

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with ES6+ support

## License

Created for Mark Christinovich's presentations.

---

**Enjoy your presentation! 🎤⏱️**

