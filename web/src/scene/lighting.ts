import * as THREE from 'three';

export class LightingSetup {
    constructor(scene: THREE.Scene) {
        // Add stronger ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        
        // Add directional light from above
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

        // Add directional light from another angle
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight2.position.set(-5, 8, -5);
        scene.add(directionalLight2);
    }
} 