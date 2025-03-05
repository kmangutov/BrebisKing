import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

export class DebugUtils {
    private axesHelper: THREE.Group = new THREE.Group();

    constructor(scene: THREE.Scene) {
        this.createCustomAxesHelper();
        scene.add(this.axesHelper);
    }

    private createCustomAxesHelper() {
        // Define axis length and thickness
        const axisLength = 1.5;
        const axisThickness = 0.06;
        
        // Create X axis (red)
        const xAxis = new THREE.Mesh(
            new THREE.CylinderGeometry(axisThickness, axisThickness, axisLength, 8),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        xAxis.rotation.z = -Math.PI / 2;
        xAxis.position.x = axisLength / 2;
        this.axesHelper.add(xAxis);
        
        // Create Y axis (green)
        const yAxis = new THREE.Mesh(
            new THREE.CylinderGeometry(axisThickness, axisThickness, axisLength, 8),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        yAxis.position.y = axisLength / 2;
        this.axesHelper.add(yAxis);
        
        // Create Z axis (blue)
        const zAxis = new THREE.Mesh(
            new THREE.CylinderGeometry(axisThickness, axisThickness, axisLength, 8),
            new THREE.MeshBasicMaterial({ color: 0x0000ff })
        );
        zAxis.rotation.x = Math.PI / 2;
        zAxis.position.z = axisLength / 2;
        this.axesHelper.add(zAxis);
        
        // Add labels
        this.addAxisLabel('X', axisLength, 0, 0, 'red');
        this.addAxisLabel('Y', 0, axisLength, 0, 'green');
        this.addAxisLabel('Z', 0, 0, axisLength, 'blue');
        
        // Position in upper left corner of scene
        this.axesHelper.position.set(-5, 3, -5);
    }
    
    private addAxisLabel(text: string, x: number, y: number, z: number, color: string) {
        const div = document.createElement('div');
        div.className = 'axis-label';
        div.textContent = text;
        div.style.color = color;
        div.style.fontWeight = 'bold';
        div.style.fontSize = '16px';
        
        const label = new CSS2DObject(div);
        label.position.set(x, y, z);
        this.axesHelper.add(label);
    }
} 