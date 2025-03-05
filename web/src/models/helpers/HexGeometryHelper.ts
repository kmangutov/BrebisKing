import * as THREE from 'three';
import { HexTile } from '../../hex/types';
import { DebugVisualization } from './DebugVisualization';

export class HexGeometryHelper {
    private scene: THREE.Scene;
    private debugViz: DebugVisualization;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.debugViz = new DebugVisualization(scene);
    }

    clear() {
        this.debugViz.clear();
    }

    visualizeHex(hex: HexTile, radius: number = 1) {
        const corners = this.getHexCorners(hex.position, radius);
        
        // Visualize corners
        corners.forEach(corner => {
            this.debugViz.visualizeCorner(corner);
        });

        // Visualize sides
        for (let i = 0; i < corners.length; i++) {
            const start = corners[i];
            const end = corners[(i + 1) % corners.length];
            this.debugViz.visualizeSide(start, end);
        }
    }

    private getHexCorners(center: THREE.Vector3, radius: number): THREE.Vector3[] {
        const corners: THREE.Vector3[] = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i + Math.PI / 6; // Start at 30 degrees and increment by 60
            const x = center.x + radius * Math.cos(angle);
            const z = center.z + radius * Math.sin(angle);
            corners.push(new THREE.Vector3(x, 0, z));
        }
        return corners;
    }

    placeHouseAtRoadStart(position: THREE.Vector3) {
        return this.debugViz.placeHouseAtRoadStart(position);
    }
} 