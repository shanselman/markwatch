# Quick Start Guide for MarkWatch

Hey Mark! Your presentation timer is ready. Here's everything you need:

## What You Got

✅ **Modern stopwatch app** with a sleek analog design
✅ **Color-coded timing** - cyan → yellow (15s warning) → red (time's up!)
✅ **Smooth animations** - 60fps second-hand sweep
✅ **Topic management** - load all your presentation segments from a text file
✅ **Navigation controls** - easily move between topics

## To Run It

```bash
cd markwatch
npm run dev
```

Then open: http://localhost:5173

## Create Your Topics File

Just make a `.txt` file like this:

```
Introduction|90
Problem Statement|120
Solution Overview|90
Technical Deep Dive|180
Live Demo|200
Q&A|300
```

Format: `Topic Name|Seconds`

I included `sample-topics.txt` as an example - feel free to use it or create your own!

## Using During Your Talk

1. **Load your file** - Drag & drop your topics.txt file
2. **Hit Start** - Big cyan button starts the timer
3. **Watch the colors**:
   - **Cyan** = You're good, keep talking
   - **Yellow** = 15 seconds left, wrap it up!
   - **Red** = Time's up, move on!
4. **Navigate** - Use Previous/Next buttons between topics
5. **Reset** if needed - The reset button resets just the current topic

## The UI

- **Big analog clock** - Classic stopwatch look with modern styling
- **Second hand** - Sweeps smoothly (not jumpy)
- **Digital time** - Shows MM:SS.milliseconds for precision
- **Progress ring** - Outer glow shows how far through the topic you are
- **Topic name** - Big and clear at the top

## Pro Tips

- Test run your file before the actual presentation
- The yellow warning at 15s is your cue to start concluding that point
- When red, the watch pulses/glows - hard to miss!
- Pause/Resume works if you get interrupted
- Each topic is independent - reset/navigate as needed

## Customization (If You Want)

Everything's in the code and documented in the README.md:
- Change colors (if cyan isn't your brand)
- Adjust warning time (default 15s)
- Resize the stopwatch
- Tweak animations

## File Structure

```
markwatch/
├── src/
│   ├── components/
│   │   ├── Stopwatch.tsx      # The main clock
│   │   ├── FileUpload.tsx     # File upload screen
│   │   └── *.css              # All the styling
│   └── App.tsx                # Main app logic
├── sample-topics.txt          # Example file
└── README.md                  # Full docs
```

## Troubleshooting

**Timer not starting?** - Make sure you loaded a topics file first

**Colors not changing?** - Check your topic duration is long enough to see transitions

**Need to add/change topics?** - Just edit your .txt file and reload it in the app

---

Have a great talk! 🎤

The stopwatch is designed to be unobtrusive but clear - you'll see the colors in your peripheral vision while presenting. The 45-minute talk with 90-second segments should work perfectly with this.

Let me know if you need any tweaks!
