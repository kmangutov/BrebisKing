import * as THREE from 'three';
import { HouseModel } from '../house';

export class DebugVisualization {
    private scene: THREE.Scene;
    private debugObjects: THREE.Object3D[] = [];
    private isDebugMode: boolean;

    constructor(scene: THREE.Scene, isDebugMode: boolean = false) {
        this.scene = scene;
        this.isDebugMode = isDebugMode;
    }

    clear() {
        this.debugObjects.forEach(obj => this.scene.remove(obj));
        this.debugObjects = [];
    }

    visualizeCorner(position: THREE.Vector3, color: number = 0xff0000) {
        if (!this.isDebugMode) return null;

        const marker = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8),
            new THREE.MeshBasicMaterial({ color })
        );
        marker.position.copy(position);
        marker.position.y = 0.15;
        this.scene.add(marker);
        this.debugObjects.push(marker);
        return marker;
    }

    visualizeSide(start: THREE.Vector3, end: THREE.Vector3, color: number = 0xffff00) {
        if (!this.isDebugMode) return;

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

    placeHouseAtRoadStart(position: THREE.Vector3) {
        const house = HouseModel.create();
        house.position.copy(position);
        this.scene.add(house);
        this.debugObjects.push(house);
        return house;
    }

    setDebugMode(enabled: boolean) {
        this.isDebugMode = enabled;
        if (!enabled) {
            this.clear();
        }
    }
} 