let scene, camera, renderer, planets = [];

function init() {
    // Create scene
    scene = new THREE.Scene();

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    // Add starfield background
    createStarfield();

    // Add sun
    createSun();

    // Create planets
    createPlanets();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Add scroll listener
    window.addEventListener('scroll', onScroll, false);

    // Start animation loop
    animate();
}

function createStarfield() {
    // Implement starfield creation here
}

function createSun() {
    // Implement sun creation here
}

function createPlanets() {
    // Implement planet creation here
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onScroll() {
    // Implement scroll-based animation here
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();
