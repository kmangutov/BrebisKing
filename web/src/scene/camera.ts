import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

export class CameraSetup {
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    labelRenderer: CSS2DRenderer;
    controls: OrbitControls;

    constructor(container: HTMLElement) {
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 10, 10);
        this.camera.lookAt(0, 0, 0);

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        // Setup CSS2D renderer for labels
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0';
        this.labelRenderer.domElement.style.pointerEvents = 'none';
        container.appendChild(this.labelRenderer.domElement);

        // Setup controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    private onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    update() {
        this.controls.update();
    }

    render(scene: THREE.Scene) {
        this.renderer.render(scene, this.camera);
        this.labelRenderer.render(scene, this.camera);
    }
} 