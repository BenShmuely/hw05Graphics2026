# Computer Graphics - Exercise 5 - WebGL Bowling Alley

## Group Members
- Ben Shmuely

## How to Run
1. Make sure `Node.js` is installed.
2. From the project directory, start the local server:
   `node index.js`
3. Open your browser at:
   `http://localhost:8000`

## What This Submission Includes
- A bowling lane with:
  - foul line
  - approach dots
  - lane arrows
  - gutters
  - distinct approach area
- Ten bowling pins in the standard `1-2-3-4` triangular formation
- A distinct pin deck behind the pins
- A static bowling ball with three finger holes on the approach area
- Orbit camera controls with `O` key toggle
- Multiple camera views and a rolling-camera slider
- HTML/CSS UI scaffolding for:
  - future bowling scorecard display
  - future controls display

## Additional Features Implemented
- Multiple saved camera presets: default, bowler-end, and pin-end views
- Rolling-camera slider for scrubbing the camera from the bowler view toward the pins
- Layered lighting setup using a directional light plus spotlights for clearer shadows

## Known Issues / Limitations
- The bowling ball holes are modeled using dark embedded cylinders, which have a weird artifact when interacting with the ball.
- Every object looks a bit detached from its shadow. There is a small lit up circle at the object's "feet".