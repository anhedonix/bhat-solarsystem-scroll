let scene, camera, renderer, planets = [];
let sun, starField;
let targetCameraPosition = new THREE.Vector3();
let activePlanetIndex = 0;
const planetData = [
    { name: 'Mercury', color: 0xC0C0C0, size: 0.8, distance: 20, diameter: 4879, dayLength: 1408, yearLength: 88, moons: 0, revolutionTime: 88, axisTilt: 0.034 },
    { name: 'Venus', color: 0xFFA500, size: 1.2, distance: 30, diameter: 12104, dayLength: 5832, yearLength: 225, moons: 0, revolutionTime: 225, axisTilt: 177.3 },
    { name: 'Earth', color: 0x0000FF, size: 1.5, distance: 40, diameter: 12742, dayLength: 24, yearLength: 365, moons: 1, revolutionTime: 365.26, axisTilt: 23.5 },
    { name: 'Mars', color: 0xFF0000, size: 1, distance: 50, diameter: 6779, dayLength: 25, yearLength: 687, moons: 2, revolutionTime: 687, axisTilt: 25.2 },
    { name: 'Jupiter', color: 0xFFA500, size: 3, distance: 70, diameter: 139820, dayLength: 10, yearLength: 4333, moons: 79, revolutionTime: 4333, axisTilt: 3.1 },
    { name: 'Saturn', color: 0xFFD700, size: 2.5, distance: 90, diameter: 116460, dayLength: 11, yearLength: 10759, moons: 82, revolutionTime: 10759, axisTilt: 26.7 },
    { name: 'Uranus', color: 0x00FFFF, size: 2, distance: 110, diameter: 50724, dayLength: 17, yearLength: 30687, moons: 27, revolutionTime: 30687, axisTilt: 97.8 },
    { name: 'Neptune', color: 0x0000FF, size: 1.8, distance: 130, diameter: 49244, dayLength: 16, yearLength: 60190, moons: 14, revolutionTime: 60190, axisTilt: 28.3 }
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

    // Add orbit lines
    addOrbitLines();

    // Add planet labels
    addPlanetLabels();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Add scroll listener
    window.addEventListener('scroll', onScroll, false);

    // Add mouse move listener for parallax effect
    document.addEventListener('mousemove', onMouseMove, false);

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
        let planetGeometry, planetMaterial;
        
        if (planet.name === 'Earth') {
            planetGeometry = new THREE.SphereGeometry(planet.size, 32, 32);
            const dayTexture = new THREE.TextureLoader().load('path/to/earth_day_texture.jpg');
            const nightTexture = new THREE.TextureLoader().load('path/to/earth_night_texture.jpg');
            planetMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    dayTexture: { value: dayTexture },
                    nightTexture: { value: nightTexture },
                    sunDirection: { value: new THREE.Vector3(1, 0, 0) }
                },
                vertexShader: earthShader.vertexShader,
                fragmentShader: earthShader.fragmentShader
            });
        } else {
            planetGeometry = new THREE.SphereGeometry(planet.size, 32, 32);
            planetMaterial = new THREE.MeshPhongMaterial({ color: planet.color });
        }

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
                <tr><td>Number of Moons</td><td>${planet.moons}</td></tr>
                <tr><td>Revolution Time</td><td>${planet.revolutionTime.toLocaleString()} Earth days</td></tr>
                <tr><td>Axis Tilt</td><td>${planet.axisTilt}°</td></tr>
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
        
        // Calculate the distance to make the planet fill 60% of the screen
        const planetSize = planetData[activePlanetIndex].size;
        const vFov = camera.fov * Math.PI / 180;
        const desiredHeight = planetSize * 2; // Diameter of the planet
        const distance = (desiredHeight / 2) / Math.tan(vFov / 2) / 0.6; // 0.6 for 60% of screen space

        const cameraOffset = new THREE.Vector3(0, 0, distance);
        const targetCameraPosition = planetPosition.clone().add(cameraOffset);
        camera.position.lerp(targetCameraPosition, 0.1);
        camera.lookAt(planetPosition);
    }

    // Rotate planets
    planets.forEach((planet, index) => {
        planet.rotation.y = scrollProgress * Math.PI * 2 * (index + 1);
    });
}

const orbitalSpeeds = planetData.map(planet => 1 / planet.revolutionTime);
let mouseX = 0, mouseY = 0;

function animate() {
    requestAnimationFrame(animate);

    // Update active planet
    const scrollY = window.scrollY;
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = scrollY / totalHeight;
    activePlanetIndex = Math.floor(scrollProgress * planetData.length);
    const activePlanet = planets[activePlanetIndex];

    if (activePlanet) {
        const planetPosition = activePlanet.position;
        
        // Calculate target camera position
        const planetSize = planetData[activePlanetIndex].size;
        const vFov = camera.fov * Math.PI / 180;
        const distance = (planetSize / 2) / Math.tan(vFov / 2) / 0.6;
        targetCameraPosition.set(
            planetPosition.x,
            planetPosition.y + distance * 0.1,
            planetPosition.z + distance
        );

        // Smooth camera movement
        camera.position.lerp(targetCameraPosition, 0.05);
        camera.lookAt(planetPosition);
    }

    // Apply parallax effect
    camera.position.x += (mouseX * 0.0005 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.0005 - camera.position.y) * 0.05;

    // Update planet positions
    const time = Date.now() * 0.0001;
    planets.forEach((planet, index) => {
        const angle = time * orbitalSpeeds[index];
        planet.position.x = Math.cos(angle) * planetData[index].distance;
        planet.position.z = Math.sin(angle) * planetData[index].distance;
        planet.rotation.y += 0.005 / (index + 1);
    });

    // Rotate sun
    sun.rotation.y += 0.001;

    renderer.render(scene, camera);
}

function onMouseMove(event) {
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
}

init();
function addOrbitLines() {
    planetData.forEach((planet) => {
        const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.1, planet.distance + 0.1, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
        const orbitMesh = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbitMesh.rotation.x = Math.PI / 2;
        scene.add(orbitMesh);
    });
}

function addPlanetLabels() {
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        planets.forEach((planet, index) => {
            const textGeometry = new THREE.TextGeometry(planetData[index].name, {
                font: font,
                size: 1,
                height: 0.1,
            });
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(planet.position.x, planet.position.y + planetData[index].size + 2, planet.position.z);
            scene.add(textMesh);
        });
    });
}

const earthShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
            float intensity = dot(vNormal, sunDirection);
            intensity = clamp(intensity, 0.0, 1.0);
            vec4 dayColor = texture2D(dayTexture, vUv);
            vec4 nightColor = texture2D(nightTexture, vUv);
            gl_FragColor = mix(nightColor, dayColor, intensity);
        }
    `
};
