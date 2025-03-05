import * as THREE from 'three';
import { ResourceType, HexTile, RESOURCE_COLORS } from './types';

export class HexGrid {
    private hexTiles: HexTile[] = [];
    private scene: THREE.Scene;
    private labelContainer: HTMLElement = document.createElement('div');

    constructor(scene: THREE.Scene, container: HTMLElement) {
        this.scene = scene;
        this.createLabelContainer(container);
        this.createGrid();
    }

    getTiles(): HexTile[] {
        return this.hexTiles;
    }

    private createLabelContainer(container: HTMLElement) {
        this.labelContainer.id = 'dice-labels';
        this.labelContainer.style.position = 'absolute';
        this.labelContainer.style.top = '0';
        this.labelContainer.style.left = '0';
        this.labelContainer.style.pointerEvents = 'none';
        container.appendChild(this.labelContainer);
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

    private createGrid() {
        // Create a 3-4-5-4-3 pattern of hexes
        const resources: ResourceType[] = ['rock', 'sheep', 'wood', 'brick', 'stone', 'wheat'];
        const rows = [3, 4, 5, 4, 3];
        
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
            }
        }

        this.createDiceLabels();
    }

    private createDiceLabels() {
        // Create labels for each hex
        this.hexTiles.forEach((tile) => {
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
            this.labelContainer.appendChild(label);

            // Store the label element
            (tile as any).label = label;
        });
    }

    updateDiceLabels(camera: THREE.Camera) {
        this.hexTiles.forEach(tile => {
            const label = (tile as any).label;
            if (label) {
                // Convert 3D position to screen coordinates
                const position = tile.position.clone();
                position.y += 0.15; // Lift the label slightly above the tile
                const screenPosition = position.project(camera);
                
                // Convert to pixel coordinates
                const x = (screenPosition.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-screenPosition.y * 0.5 + 0.5) * window.innerHeight;

                // Update label position
                label.style.left = `${x}px`;
                label.style.top = `${y}px`;
            }
        });
    }
} 