import * as THREE from 'three';
import { CameraSetup } from './scene/camera';
import { DebugUtils } from './scene/debug';
import { LightingSetup } from './scene/lighting';
import { HexGrid } from './hex/grid';

export class World {
    private scene: THREE.Scene;
    private cameraSetup: CameraSetup;
    private hexGrid: HexGrid;

    constructor(container: HTMLElement) {
        // Setup scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background

        // Initialize scene components
        this.cameraSetup = new CameraSetup(container);
        new LightingSetup(this.scene);
        new DebugUtils(this.scene);
        this.hexGrid = new HexGrid(this.scene, container);

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