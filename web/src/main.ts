import { World } from './world';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app');
    if (!container) {
        throw new Error('No container element found');
    }
    
    new World(container);
});

// Logic goes here
console.log('hello world')