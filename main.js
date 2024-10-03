let scene, camera, renderer, planets = [];
let sun, starField;
const planetData = [
    { name: 'Mercury', color: 0xC0C0C0, size: 0.5, distance: 10 },
    { name: 'Venus', color: 0xFFA500, size: 0.8, distance: 15 },
    { name: 'Earth', color: 0x0000FF, size: 1, distance: 20 },
    { name: 'Mars', color: 0xFF0000, size: 0.7, distance: 25 },
    { name: 'Jupiter', color: 0xFFA500, size: 2, distance: 35 },
    { name: 'Saturn', color: 0xFFD700, size: 1.8, distance: 45 },
    { name: 'Uranus', color: 0x00FFFF, size: 1.3, distance: 55 },
    { name: 'Neptune', color: 0x0000FF, size: 1.2, distance: 65 }
];

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
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
}

function createSun() {
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
}

function createPlanets() {
    planetData.forEach((planet, index) => {
        const planetGeometry = new THREE.SphereGeometry(planet.size, 32, 32);
        const planetMaterial = new THREE.MeshPhongMaterial({ color: planet.color });
        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        planetMesh.position.x = planet.distance;
        planets.push(planetMesh);
        scene.add(planetMesh);

        // Add planet details section to HTML
        const detailSection = document.createElement('section');
        detailSection.className = 'planet-section';
        detailSection.innerHTML = `<h2>${planet.name}</h2><p>Details about ${planet.name} go here.</p>`;
        document.getElementById('planet-details').appendChild(detailSection);

        // Add planet to menu
        const menuItem = document.createElement('button');
        menuItem.textContent = planet.name;
        menuItem.addEventListener('click', () => scrollToPlanet(index));
        document.getElementById('planet-menu').appendChild(menuItem);
    });
}

function scrollToPlanet(index) {
    const planetSection = document.querySelectorAll('.planet-section')[index];
    planetSection.scrollIntoView({ behavior: 'smooth' });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onScroll() {
    const scrollY = window.scrollY;
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = scrollY / totalHeight;

    // Move camera based on scroll
    camera.position.z = 50 - scrollProgress * 40;

    // Rotate planets
    planets.forEach((planet, index) => {
        planet.rotation.y = scrollProgress * Math.PI * 2 * (index + 1);
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate planets
    planets.forEach((planet, index) => {
        planet.rotation.y += 0.01 / (index + 1);
    });

    renderer.render(scene, camera);
}

init();
