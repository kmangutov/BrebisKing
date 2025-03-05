import * as THREE from 'three';

export type ResourceType = 'rock' | 'sheep' | 'wood' | 'brick' | 'stone' | 'wheat';

export interface HexTile {
    mesh: THREE.Mesh;
    resource: ResourceType;
    diceNumber: number;
    position: THREE.Vector3;
}

export const RESOURCE_COLORS: Record<ResourceType, THREE.Color> = {
    rock: new THREE.Color(0x888888),
    sheep: new THREE.Color(0x90EE90),
    wood: new THREE.Color(0x654321),
    brick: new THREE.Color(0xCD5C5C),
    stone: new THREE.Color(0x808080),
    wheat: new THREE.Color(0xFFD700)
}; 