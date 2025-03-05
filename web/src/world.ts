import * as THREE from 'three';
import { CameraSetup } from './scene/camera';
import { DebugUtils } from './scene/debug';
import { LightingSetup } from './scene/lighting';
import { HexGrid } from './hex/grid';
import { PlacementManager } from './models/placement';

export class World {
    private scene: THREE.Scene;
    private cameraSetup: CameraSetup;
    private hexGrid: HexGrid;
    private placementManager: PlacementManager;

    constructor(container: HTMLElement) {
        // Setup scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background

        // Initialize scene components
        this.cameraSetup = new CameraSetup(container);
        new LightingSetup(this.scene);
        new DebugUtils(this.scene);
        this.hexGrid = new HexGrid(this.scene, container);

        // Initialize placement manager and place initial house and road
        this.placementManager = new PlacementManager(this.scene, this.hexGrid.getTiles());
        this.placementManager.placeRandomRoadAlongSide();

        // Start animation loop
        this.animate();
    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.cameraSetup.update();
        this.hexGrid.updateDiceLabels(this.cameraSetup.camera);
        this.cameraSetup.render(this.scene);
    }
} 