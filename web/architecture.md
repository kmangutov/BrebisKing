This is the web/ folder, all frontend goes here.

Directory Structure:
1. index.html - Imports the js logic from src/main.ts
2. src/main.ts - Main logic for the game loop, handles dice rolls, resource distribution, building placement, etc.
3. src/world.ts - Main game world orchestrator, coordinates all 3D components
4. src/hex/ - Hex tile related code
   - types.ts - Type definitions and constants for hex tiles
   - grid.ts - Hex grid creation and management
5. src/scene/ - Three.js scene setup components
   - camera.ts - Camera and renderer setup
   - debug.ts - Debug utilities (axes helper, etc.)
   - lighting.ts - Scene lighting setup
6. src/textures.ts - Generates hex tile textures for resources, roads, cities, hotels, etc.
7. src/controls.ts - Mouse input and UI

Component Responsibilities:
- World: Main orchestrator that coordinates all other components
- HexGrid: Manages the creation and state of hex tiles
- CameraSetup: Handles camera, renderers, and orbit controls
- DebugUtils: Provides debugging tools like the 3D axes helper
- LightingSetup: Manages scene lighting