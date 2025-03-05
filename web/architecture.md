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
6. src/models/ - 3D model definitions and placement logic
   - house.ts - House model definition
   - road.ts - Road model definition
   - placement.ts - Logic for placing models in the world
   - helpers/ - Helper classes for visualizing hex geometry
7. src/textures.ts - Generates hex tile textures for resources, roads, cities, hotels, etc.
8. src/controls.ts - Mouse input and UI

Component Responsibilities:
- World: Main orchestrator that coordinates all other components
- HexGrid: Manages the creation and state of hex tiles
- CameraSetup: Handles camera, renderers, and orbit controls
- DebugUtils: Provides debugging tools like the 3D axes helper
- LightingSetup: Manages scene lighting
- PlacementManager: Handles placement of buildings and roads at valid locations
- HouseModel: Defines the 3D model for houses
- RoadModel: Defines the 3D model for roads

## Project Structure

```
web/
├── src/
│   ├── models/
│   │   ├── helpers/
│   │   │   ├── DebugVisualization.ts   # Debug visualization utilities
│   │   │   └── HexGeometryHelper.ts    # Helper class for hex geometry
│   │   ├── house.ts                    # House model definition and placement
│   │   ├── road.ts                     # Road model definition and placement
│   │   └── placement.ts                # Manages model placement and intersection detection
│   ├── hex/
│   │   └── types.ts                    # Hex tile type definitions
│   └── scene/
│       └── lighting.ts                 # Scene lighting configuration
```

## Component Responsibilities

### Models System

The models system is responsible for defining and managing 3D models in the game world. It consists of several key components:

#### DebugVisualization (`src/models/helpers/DebugVisualization.ts`)
- Provides debug visualization tools for development
- Handles visualization of hex corners, sides, and placement points
- Can be enabled/disabled via debug mode flag
- Manages cleanup of debug objects

#### HexGeometryHelper (`src/models/helpers/HexGeometryHelper.ts`)
- Provides geometry calculations for hex tiles
- Manages hex corner and side calculations
- Coordinates with DebugVisualization for debug rendering
- Controls debug mode state

#### PlacementManager (`src/models/placement.ts`)
- Manages the placement of models in the game world
- Handles intersection detection between models
- Uses HexGeometryHelper for geometry calculations
- Controls debug visualization state
- Provides methods for road and house placement

#### HouseModel (`src/models/house.ts`)
- Defines the 3D model for houses
- Handles house placement and orientation
- Manages house-specific properties

#### RoadModel (`src/models/road.ts`)
- Defines the 3D model for roads
- Handles road segment creation and placement
- Manages road dimensions and elevation

### Scene System

#### Lighting (`src/scene/lighting.ts`)
- Configures scene lighting
- Sets up ambient and directional lights
- Manages shadow properties

### Hex System

#### Types (`src/hex/types.ts`)
- Defines hex tile data structures
- Contains interfaces for hex grid operations

### Debug Mode

The system includes a comprehensive debug visualization system that can be enabled/disabled:
- Debug visualizations are disabled by default
- When enabled, shows:
  - Hex corners (red markers)
  - Hex sides (yellow lines)
  - Road placement points
- Can be toggled at runtime via `setDebugMode`
- Debug objects are automatically cleaned up when disabled