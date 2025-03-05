import * as THREE from 'three';

export class RoadModel {
    static create(length: number = 1): THREE.Group {
        const road = new THREE.Group();

        // Create road segment (flat rectangle)
        const segment = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.1, length), // Wider and taller
            new THREE.MeshStandardMaterial({ 
                color: 0x444444,
                side: THREE.DoubleSide
            })
        );
        
        // Position higher above ground to prevent z-fighting
        segment.position.y = 0.05;
        // Center the road on its start point
        segment.position.z = length / 2;
        
        // Add debug markers at start and end
        const startMarker = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        startMarker.position.y = 0.1;
        road.add(startMarker);

        const endMarker = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8),
            new THREE.MeshBasicMaterial({ color: 0x0000ff })
        );
        endMarker.position.set(0, 0.1, length);
        road.add(endMarker);

        road.add(segment);
        return road;
    }
} 