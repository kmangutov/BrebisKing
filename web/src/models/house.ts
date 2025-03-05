import * as THREE from 'three';

export class HouseModel {
    static create(): THREE.Group {
        const house = new THREE.Group();

        // Base (cube)
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.4, 0.4),
            new THREE.MeshStandardMaterial({ 
                color: 0xcc8866,
                side: THREE.DoubleSide // Make sure both sides are visible
            })
        );
        base.position.y = 0.2; // Lift base above ground
        house.add(base);

        // Roof (pyramid)
        const roof = new THREE.Mesh(
            new THREE.ConeGeometry(0.3, 0.3, 4),
            new THREE.MeshStandardMaterial({ 
                color: 0x883333,
                side: THREE.DoubleSide // Make sure both sides are visible
            })
        );
        roof.position.y = 0.55; // Position on top of base
        roof.rotation.y = Math.PI / 4; // Rotate 45 degrees to align with base
        house.add(roof);

        // Add a debug sphere to mark the position
        const debugMarker = new THREE.Mesh(
            new THREE.SphereGeometry(0.1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        debugMarker.position.y = 0;
        house.add(debugMarker);

        return house;
    }
} 