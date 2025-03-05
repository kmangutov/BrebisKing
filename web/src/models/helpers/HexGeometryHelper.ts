import * as THREE from 'three';
import { HexTile } from '../../hex/types';

export class HexGeometryHelper {
    private scene: THREE.Scene;
    private debugObjects: THREE.Object3D[] = [];

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    clear() {
        this.debugObjects.forEach(obj => this.scene.remove(obj));
        this.debugObjects = [];
    }

    visualizeCorner(position: THREE.Vector3, color: number = 0xff0000) {
        // Create a taller cylinder for corners
        const marker = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8),
            new THREE.MeshBasicMaterial({ color })
        );
        marker.position.copy(position);
        marker.position.y = 0.15; // Half height of cylinder
        this.scene.add(marker);
        this.debugObjects.push(marker);
        return marker;
    }

    visualizeSide(start: THREE.Vector3, end: THREE.Vector3, color: number = 0xffff00) {
        // Create a line for the side
        const points = [
            new THREE.Vector3(start.x, 0.1, start.z),
            new THREE.Vector3(end.x, 0.1, end.z)
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({ color, linewidth: 2 })
        );
        this.scene.add(line);
        this.debugObjects.push(line);

        // Add small cylinders at start and end
        const startMarker = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8),
            new THREE.MeshBasicMaterial({ color })
        );
        startMarker.position.copy(start);
        startMarker.position.y = 0.1;
        this.scene.add(startMarker);
        this.debugObjects.push(startMarker);

        const endMarker = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8),
            new THREE.MeshBasicMaterial({ color })
        );
        endMarker.position.copy(end);
        endMarker.position.y = 0.1;
        this.scene.add(endMarker);
        this.debugObjects.push(endMarker);
    }

    visualizeHex(hex: HexTile, radius: number = 1) {
        const corners = this.getHexCorners(hex.position, radius);
        
        // Visualize corners
        corners.forEach(corner => {
            this.visualizeCorner(corner);
        });

        // Visualize sides
        for (let i = 0; i < corners.length; i++) {
            const start = corners[i];
            const end = corners[(i + 1) % corners.length];
            this.visualizeSide(start, end);
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
} 