import * as THREE from 'three';

export class LightingSetup {
    constructor(scene: THREE.Scene) {
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);
    }
} 