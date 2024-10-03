let scene, camera, renderer, planets = [];
let sun, starField;
const planetData = [
    { name: 'Mercury', color: 0xC0C0C0, size: 0.8, distance: 20, diameter: 4879, dayLength: 1408, yearLength: 88 },
    { name: 'Venus', color: 0xFFA500, size: 1.2, distance: 30, diameter: 12104, dayLength: 5832, yearLength: 225 },
    { name: 'Earth', color: 0x0000FF, size: 1.5, distance: 40, diameter: 12742, dayLength: 24, yearLength: 365 },
    { name: 'Mars', color: 0xFF0000, size: 1, distance: 50, diameter: 6779, dayLength: 25, yearLength: 687 },
    { name: 'Jupiter', color: 0xFFA500, size: 3, distance: 70, diameter: 139820, dayLength: 10, yearLength: 4333 },
    { name: 'Saturn', color: 0xFFD700, size: 2.5, distance: 90, diameter: 116460, dayLength: 11, yearLength: 10759 },
    { name: 'Uranus', color: 0x00FFFF, size: 2, distance: 110, diameter: 50724, dayLength: 17, yearLength: 30687 },
    { name: 'Neptune', color: 0x0000FF, size: 1.8, distance: 130, diameter: 49244, dayLength: 16, yearLength: 60190 }
];

function init() {
    // Create scene
    scene = new THREE.Scene();

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(30, 20, 60);
    camera.lookAt(0, 0, 0);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    // Add starfield background
    createStarfield();

    // Add sun
    createSun();

    // Add lights
    addLights();

    // Create planets
    createPlanets();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Add scroll listener
    window.addEventListener('scroll', onScroll, false);

    // Hide loading screen
    document.getElementById('loading-screen').style.display = 'none';

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

function addLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFFFFF, 1);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);
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
        detailSection.innerHTML = `
            <h2>${planet.name}</h2>
            <table>
                <tr><th>Property</th><th>Value</th></tr>
                <tr><td>Diameter</td><td>${planet.diameter.toLocaleString()} km</td></tr>
                <tr><td>Day Length</td><td>${planet.dayLength} hours</td></tr>
                <tr><td>Year Length</td><td>${planet.yearLength.toLocaleString()} Earth days</td></tr>
            </table>
        `;
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

    const activePlanetIndex = Math.floor(scrollProgress * planetData.length);
    const activePlanet = planets[activePlanetIndex];

    if (activePlanet) {
        const planetPosition = new THREE.Vector3(activePlanet.position.x, activePlanet.position.y, activePlanet.position.z);
        const cameraOffset = new THREE.Vector3(15, 10, 20);
        const targetCameraPosition = planetPosition.clone().add(cameraOffset);
        camera.position.lerp(targetCameraPosition, 0.1);
        camera.lookAt(planetPosition);
    }

    // Rotate planets
    planets.forEach((planet, index) => {
        planet.rotation.y = scrollProgress * Math.PI * 2 * (index + 1);
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate planets
    planets.forEach((planet, index) => {
        planet.rotation.y += 0.005 / (index + 1);
    });

    // Rotate sun
    sun.rotation.y += 0.001;

    renderer.render(scene, camera);
}

init();
