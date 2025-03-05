import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export type ResourceType = 'rock' | 'sheep' | 'wood' | 'brick' | 'stone' | 'wheat';

interface HexTile {
    mesh: THREE.Mesh;
    resource: ResourceType;
    diceNumber: number;
    position: THREE.Vector3;
}

const RESOURCE_COLORS: Record<ResourceType, THREE.Color> = {
    rock: new THREE.Color(0x888888),
    sheep: new THREE.Color(0x90EE90),
    wood: new THREE.Color(0x654321),
    brick: new THREE.Color(0xCD5C5C),
    stone: new THREE.Color(0x808080),
    wheat: new THREE.Color(0xFFD700)
};

export class World {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private hexTiles: HexTile[] = [];
    private container: HTMLElement;
    private axesHelper: THREE.AxesHelper;

    constructor(container: HTMLElement) {
        this.container = container;

        // Setup scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background

        // Add axes helper
        this.axesHelper = new THREE.AxesHelper(5); // The parameter defines the length of the axes
        this.scene.add(this.axesHelper);

        // Setup camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 10, 10);
        this.camera.lookAt(0, 0, 0);

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        // Setup controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Create hex grid
        this.createHexGrid();
        this.createDiceLabels();

        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Start animation loop
        this.animate();
    }

    private createHexTile(resource: ResourceType, diceNumber: number, x: number, z: number): HexTile {
        const radius = 1;
        const hexGeometry = new THREE.CylinderGeometry(radius, radius, 0.2, 6);
        const material = new THREE.MeshStandardMaterial({ 
            color: RESOURCE_COLORS[resource],
            flatShading: true
        });
        const mesh = new THREE.Mesh(hexGeometry, material);
        
        // Position the hex tile on the XZ plane with flat faces pointing up
        mesh.position.set(x, 0, z);
        // Rotate the cylinder so its flat faces point up/down along the Y axis
        mesh.rotation.x = 0; // No rotation needed - cylinder's flat faces are already along the Y axis
        
        this.scene.add(mesh);
        return { 
            mesh, 
            resource, 
            diceNumber,
            position: mesh.position.clone()
        };
    }

    private createDiceLabels() {
        // Create container for labels if it doesn't exist
        let labelContainer = document.getElementById('dice-labels');
        if (!labelContainer) {
            labelContainer = document.createElement('div');
            labelContainer.id = 'dice-labels';
            labelContainer.style.position = 'absolute';
            labelContainer.style.top = '0';
            labelContainer.style.left = '0';
            labelContainer.style.pointerEvents = 'none';
            this.container.appendChild(labelContainer);
        }

        // Create labels for each hex
        this.hexTiles.forEach((tile, index) => {
            const label = document.createElement('div');
            label.textContent = tile.diceNumber.toString();
            label.style.position = 'absolute';
            label.style.color = 'black';
            label.style.background = 'white';
            label.style.padding = '2px 6px';
            label.style.borderRadius = '10px';
            label.style.fontSize = '14px';
            label.style.fontWeight = 'bold';
            label.style.transform = 'translate(-50%, -50%)';
            labelContainer.appendChild(label);

            // Store the label element
            (tile as any).label = label;
        });
    }

    private updateDiceLabels() {
        this.hexTiles.forEach(tile => {
            const label = (tile as any).label;
            if (label) {
                // Convert 3D position to screen coordinates
                const position = tile.position.clone();
                position.y += 0.15; // Lift the label slightly above the tile
                const screenPosition = position.project(this.camera);
                
                // Convert to pixel coordinates
                const x = (screenPosition.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-screenPosition.y * 0.5 + 0.5) * window.innerHeight;

                // Update label position
                label.style.left = `${x}px`;
                label.style.top = `${y}px`;
            }
        });
    }

    private createHexGrid() {
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);

        // Create a 3-4-5-4-3 pattern of hexes
        const resources: ResourceType[] = ['rock', 'sheep', 'wood', 'brick', 'stone', 'wheat'];
        const rows = [3, 4, 5, 4, 3];
        let hexIndex = 0;
        
        // Define hex dimensions for proper spacing
        const hexWidth = 1.732; // √3 - distance between centers of adjacent hexes
        const hexVerticalSpacing = 1.5; // Vertical distance between rows
        
        for (let row = 0; row < rows.length; row++) {
            const hexesInRow = rows[row];
            for (let col = 0; col < hexesInRow; col++) {
                const resource = resources[Math.floor(Math.random() * resources.length)];
                const diceNumber = Math.floor(Math.random() * 11) + 2; // 2-12
                
                // Calculate hex position with proper spacing
                const x = (col - (hexesInRow - 1) / 2) * hexWidth;
                const z = row * hexVerticalSpacing;
                
                this.hexTiles.push(this.createHexTile(resource, diceNumber, x, z));
                hexIndex++;
            }
        }
    }

    private onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.updateDiceLabels();
    }
} 