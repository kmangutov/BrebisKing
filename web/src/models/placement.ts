import * as THREE from 'three';
import { HexTile } from '../hex/types';
import { HouseModel } from './house';
import { RoadModel } from './road';
import { HexGeometryHelper } from './helpers/HexGeometryHelper';

export interface Intersection {
    position: THREE.Vector3;
    adjacentHexes: HexTile[];
}

export interface HexSide {
    start: THREE.Vector3;
    end: THREE.Vector3;
    hex: HexTile;
}

export class PlacementManager {
    private scene: THREE.Scene;
    private hexTiles: HexTile[];
    private geometryHelper: HexGeometryHelper;

    constructor(scene: THREE.Scene, hexTiles: HexTile[]) {
        this.scene = scene;
        this.hexTiles = hexTiles;
        this.geometryHelper = new HexGeometryHelper(scene);
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

    private getHexSides(hex: HexTile, radius: number): HexSide[] {
        const corners = this.getHexCorners(hex.position, radius);
        const sides: HexSide[] = [];
        
        for (let i = 0; i < 6; i++) {
            sides.push({
                start: corners[i],
                end: corners[(i + 1) % 6],
                hex: hex
            });
        }
        return sides;
    }

    placeRandomRoadAlongSide() {
        this.geometryHelper.clear();
        const hexRadius = 1;

        // Get all hex sides and visualize hex geometry
        const allSides: HexSide[] = [];
        this.hexTiles.forEach(hex => {
            this.geometryHelper.visualizeHex(hex, hexRadius);
            const sides = this.getHexSides(hex, hexRadius);
            allSides.push(...sides);
        });

        // Choose a random side
        const randomSide = allSides[Math.floor(Math.random() * allSides.length)];
        
        // Create and place road
        const length = randomSide.start.distanceTo(randomSide.end);
        const road = RoadModel.create(length);
        road.position.copy(randomSide.start);
        road.position.y = 0.1; // Lift higher to prevent z-fighting
        
        // Calculate rotation to align with the side
        const direction = new THREE.Vector3().subVectors(randomSide.end, randomSide.start).normalize();
        const angle = Math.atan2(direction.x, direction.z);
        road.rotation.y = angle;

        this.scene.add(road);

        // Place house at road start
        this.geometryHelper.placeHouseAtRoadStart(randomSide.start);

        console.log('Road placed along hex side:', {
            start: randomSide.start,
            end: randomSide.end,
            length,
            angle
        });
    }

    // Keep the original method for reference, but we won't use it for now
    private findIntersections(): Intersection[] {
        const intersections: Intersection[] = [];
        const hexRadius = 1; // This should match the radius in HexGrid
        const threshold = 0.3; // Increased threshold for intersection detection

        // Debug: log hex positions
        console.log('Hex positions:', this.hexTiles.map(hex => hex.position));

        // For each hex, check its vertices against other hexes
        for (let i = 0; i < this.hexTiles.length; i++) {
            const hex = this.hexTiles[i];
            const center = hex.position;

            // Generate 6 vertices for the hex
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
                const vertexPos = new THREE.Vector3(
                    center.x + hexRadius * Math.cos(angle),
                    0,
                    center.z + hexRadius * Math.sin(angle)
                );

                // Debug sphere to visualize vertex positions
                const debugSphere = new THREE.Mesh(
                    new THREE.SphereGeometry(0.05),
                    new THREE.MeshBasicMaterial({ color: 0xffff00 })
                );
                debugSphere.position.copy(vertexPos);
                debugSphere.position.y = 0.1; // Lift slightly above ground
                this.scene.add(debugSphere);

                // Check if this vertex is shared by other hexes
                const adjacentHexes = [hex];
                
                // Debug: log vertex checking
                console.log(`Checking vertex at ${vertexPos.x.toFixed(2)}, ${vertexPos.z.toFixed(2)}`);

                for (let j = 0; j < this.hexTiles.length; j++) {
                    if (i !== j) {
                        const otherHex = this.hexTiles[j];
                        // Calculate distance from vertex to hex center
                        const distance = vertexPos.distanceTo(otherHex.position);
                        console.log(`  Distance to hex ${j}: ${distance.toFixed(2)}`);
                        
                        if (distance <= hexRadius + threshold) {
                            adjacentHexes.push(otherHex);
                            console.log(`  Added hex ${j} as adjacent`);
                        }
                    }
                }

                // If we found a vertex shared by 3 hexes
                if (adjacentHexes.length === 3) {
                    // Check if this intersection is already recorded
                    const exists = intersections.some(intersection => 
                        intersection.position.distanceTo(vertexPos) < threshold
                    );

                    if (!exists) {
                        console.log('Found valid intersection at:', vertexPos);
                        // Change debug sphere color to red for valid intersections
                        debugSphere.material.color.setHex(0xff0000);
                        
                        intersections.push({
                            position: vertexPos,
                            adjacentHexes
                        });
                    }
                }
            }
        }

        console.log('Final intersections found:', intersections.length);
        return intersections;
    }
} 