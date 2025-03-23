// Realistic Space Scene with Planets, Stars and Galaxies
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/postprocessing/UnrealBloomPass.js';

// Global variables
// Global variables
let scene, camera, renderer, composer;
let starField, planets = [], galaxies = [];
let mouseX = 0, mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let cameraDistance = 2000; // Base camera distance
let cameraHeight = 300;    // Base camera height
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let clock = new THREE.Clock();
let zoomLevel = 1;         // For zoom control
let sunMesh; // Central sun mesh

// Space colors
const spaceColors = {
  deepBlue: new THREE.Color(0x0a0a30),
  brightBlue: new THREE.Color(0x1a3b8c),
  purple: new THREE.Color(0x4b0082),
  pink: new THREE.Color(0xff1493),
  orange: new THREE.Color(0xff4500),
  white: new THREE.Color(0xffffff),
  yellow: new THREE.Color(0xffff44),
  red: new THREE.Color(0xff4444),
  green: new THREE.Color(0x44ff88),
  teal: new THREE.Color(0x44dddd)
};
// Initialize the scene
function init() {
  console.log("Space scene initialization starting...");
  
  // Add info text for camera controls

  
  // Add Ma Doman watermark
  
  // Find canvas
  const canvas = document.getElementById('webgl-canvas');
  console.log("Canvas element:", canvas);
  
  if (!canvas) {
    console.error('Cannot find canvas element!');
    return;
  }

  // Create scene with deep space background
  scene = new THREE.Scene();
  scene.background = spaceColors.deepBlue;
  scene.fog = new THREE.FogExp2(0x080830, 0.00005); // Reduced fog
  
  // Create camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 10000);
  camera.position.z = 2000;
  camera.position.y = 300;
  camera.lookAt(0, 0, 0);
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Setup post-processing (bloom effect)
  setupPostprocessing();

  // Create the sun at the center
  createSun();
  
  // Create space elements
  createStarField();
  createNebula();
  createPlanets();
  createOrbitalPaths();
  createDistantGalaxies();
  
  // Setup event handlers
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('touchmove', onDocumentTouchMove, false);
  document.addEventListener('wheel', onMouseWheel, false);
  document.addEventListener('keydown', onKeyDown, false);
  window.addEventListener('resize', onWindowResize, false);
  
  console.log("Space scene initialization completed");
  
  // Start animation
  animate();
}

// Add Ma Doman watermark
function addWatermark() {
  const watermark = document.createElement('div');
  watermark.id = 'watermark';
  watermark.textContent = 'Ma Doman';
  watermark.style.position = 'absolute';
  watermark.style.bottom = '10px';
  watermark.style.right = '10px';
  watermark.style.color = 'rgba(255, 255, 255, 0.3)';
  watermark.style.fontSize = '14px';
  watermark.style.zIndex = '100';
  watermark.style.pointerEvents = 'none';
  document.body.appendChild(watermark);
}

// Add information text for controls
function addInfoText() {
  const infoDiv = document.createElement('div');
  infoDiv.style.position = 'absolute';
  infoDiv.style.bottom = '10px';
  infoDiv.style.left = '10px';
  infoDiv.style.color = 'white';
  infoDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
  infoDiv.style.padding = '10px';
  infoDiv.style.borderRadius = '5px';
  infoDiv.style.fontFamily = 'Inter, sans-serif';
  infoDiv.style.fontSize = '14px';
  infoDiv.style.zIndex = '1000';
  infoDiv.style.pointerEvents = 'none'; // Don't block clicks
  
  infoDiv.innerHTML = `
    <div style="margin-bottom: 5px; font-weight: bold;">Camera Controls:</div>
    <div>Mouse: Look around</div>
    <div>Scroll: Zoom in/out</div>
    <div>WASD: Move camera</div>
    <div>QE: Up/Down</div>
    <div>R: Reset view</div>
  `;
  
  document.body.appendChild(infoDiv);
  
  // Fade out after 10 seconds
  setTimeout(() => {
    infoDiv.style.transition = 'opacity 2s';
    infoDiv.style.opacity = '0';
    
    // Remove after fade
    setTimeout(() => {
      document.body.removeChild(infoDiv);
    }, 2000);
  }, 10000);
}

// Setup post-processing (bloom effect)
function setupPostprocessing() {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.2,  // strength
    0.4,  // radius
    0.2   // threshold
  );
  composer.addPass(bloomPass);
}
// Create central sun
function createSun() {
  // Create sun geometry
  const sunGeometry = new THREE.SphereGeometry(100, 64, 64);
  
  // Create sun material with emissive glow
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff99,
    emissive: 0xff8800,
    emissiveIntensity: 1
  });
  
  // Create sun mesh
  sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
  sunMesh.position.set(0, 0, 0);
  scene.add(sunMesh);
  
  // Create a point light at the sun's position
  const sunLight = new THREE.PointLight(0xffffdd, 2, 2000);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);
  
  // Add ambient light for general scene illumination
  const ambientLight = new THREE.AmbientLight(0x333355, 0.3);
  scene.add(ambientLight);
}

// Create orbital paths for planets
function createOrbitalPaths() {
  planets.forEach(planet => {
    const orbitData = planet.orbitData;
    if (!orbitData) return;
    
    // Create circular orbit with slight elliptical variation
    const orbitShape = new THREE.EllipseCurve(
      0, 0,                         // Center of ellipse
      orbitData.radius, orbitData.radius * orbitData.eccentricity, // x radius, y radius
      0, 2 * Math.PI,               // Start and end angle
      false,                        // Anti-clockwise
      0                             // Rotation
    );
    
    const points = orbitShape.getPoints(128);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    
    // Create orbit line
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true, 
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });
    
    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2; // Rotate to horizontal plane
    
    // Apply orbit inclination
    orbit.rotation.z = orbitData.inclination || 0;
    
    scene.add(orbit);
  });
}
// Create star field
function createStarField() {
  // Background stars
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 15000;
  
  const positions = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);
  const colors = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    // Distribute stars in a sphere around the camera
    const radius = 3000 + Math.random() * 2000;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
    
    // Vary star sizes
    sizes[i] = Math.random() * 3 + 0.5;
    
    // Star colors: mostly white with some blue and yellow tints
    const colorChoice = Math.random();
    if (colorChoice > 0.9) {
      // Blue tint
      colors[i3] = 0.8;
      colors[i3 + 1] = 0.9;
      colors[i3 + 2] = 1.0;
    } else if (colorChoice > 0.8) {
      // Yellow tint
      colors[i3] = 1.0;
      colors[i3 + 1] = 1.0;
      colors[i3 + 2] = 0.8;
    } else if (colorChoice > 0.7) {
      // Red tint
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.8;
      colors[i3 + 2] = 0.8;
    } else if (colorChoice > 0.6) {
      // Greenish tint (for rare green stars)
      colors[i3] = 0.8;
      colors[i3 + 1] = 1.0;
      colors[i3 + 2] = 0.9;
    } else {
      // White
      colors[i3] = 1.0;
      colors[i3 + 1] = 1.0;
      colors[i3 + 2] = 1.0;
    }
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Star shader material
  const starMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float time;
      
      void main() {
        vColor = color;
        
        // Simple twinkling effect
        float twinkle = sin(time * 3.0 + position.x * 0.01 + position.y * 0.01) * 0.2 + 0.8;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * twinkle * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      
      void main() {
        // Circular star shape
        float distanceToCenter = length(gl_PointCoord - vec2(0.5));
        float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
        
        // Apply color and fading at edges
        gl_FragColor = vec4(vColor, strength);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);
}

// Create nebula cloud effect
function createNebula() {
  // Create multiple nebula clouds
  createNebulaCloud(-400, 0, -200, 1000, spaceColors.brightBlue, spaceColors.purple, 0.2);
  createNebulaCloud(600, -200, -500, 1200, spaceColors.purple, spaceColors.pink, 0.15);
  createNebulaCloud(-800, 200, -800, 900, spaceColors.pink, spaceColors.orange, 0.1);
  
  // Add some more colorful nebulae
  createNebulaCloud(900, 100, -1200, 800, spaceColors.green, spaceColors.teal, 0.12);
  createNebulaCloud(-600, -300, -900, 700, spaceColors.red, spaceColors.orange, 0.14);
}

// Create a single nebula cloud
function createNebulaCloud(x, y, z, size, color1, color2, opacity) {
  const particleCount = 5000;
  const geometry = new THREE.BufferGeometry();
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Create nebula shape (elliptical cloud)
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.random() * size * (1 + 0.4 * Math.sin(phi * 4)); // Create interesting shape
    
    positions[i3] = x + r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = y + r * 0.5 * Math.sin(phi) * Math.sin(theta); // Flatten a bit
    positions[i3 + 2] = z + r * Math.cos(phi);
    
    // Color gradient based on distance from center
    const distRatio = Math.min(1, Math.sqrt(positions[i3]**2 + positions[i3+1]**2 + positions[i3+2]**2) / size);
    const mixedColor = color1.clone().lerp(color2, distRatio);
    
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
    
    // Varied particle sizes
    scales[i] = 50 + Math.random() * 150;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
  
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      opacity: { value: opacity }
    },
    vertexShader: `
      attribute vec3 color;
      attribute float scale;
      varying vec3 vColor;
      uniform float time;
      
      void main() {
        vColor = color;
        
        // Slow drift animation
        vec3 pos = position;
        pos.x += sin(time * 0.1 + position.z * 0.01) * 10.0;
        pos.y += cos(time * 0.1 + position.x * 0.01) * 10.0;
        pos.z += sin(time * 0.1 + position.y * 0.01) * 10.0;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = scale * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      uniform float opacity;
      
      void main() {
        // Soft cloud-like texture
        float distanceToCenter = length(gl_PointCoord - vec2(0.5));
        float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
        strength = pow(strength, 2.0);
        
        gl_FragColor = vec4(vColor, strength * opacity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  const nebula = new THREE.Points(geometry, material);
  scene.add(nebula);
}
// Create planets
function createPlanets() {
  const planetTypes = [
    { name: 'mercury', radius: 20, color: 0xaa9988, emissive: 0x220000, type: 'rocky', distance: 180, eccentricity: 0.95, inclination: 0.02, orbitSpeed: 0.0003 },
    { name: 'venus', radius: 28, color: 0xddaa77, emissive: 0x441100, type: 'lava', distance: 240, eccentricity: 0.97, inclination: 0.01, orbitSpeed: 0.00025 },
    { name: 'earth', radius: 30, color: 0x1a66cc, emissive: 0x001133, type: 'earth', distance: 300, eccentricity: 0.98, inclination: 0.00, orbitSpeed: 0.0002 },
    { name: 'mars', radius: 22, color: 0xdd5533, emissive: 0x331100, type: 'rocky', distance: 380, eccentricity: 0.94, inclination: 0.03, orbitSpeed: 0.00018 },
    { name: 'jupiter', radius: 75, color: 0xddbb88, emissive: 0x332211, type: 'gas', distance: 520, eccentricity: 0.96, inclination: 0.01, orbitSpeed: 0.00015 },
    { name: 'saturn', radius: 65, color: 0xddcc88, emissive: 0x332211, type: 'ringed', distance: 650, eccentricity: 0.93, inclination: 0.02, orbitSpeed: 0.00012 },
    { name: 'uranus', radius: 45, color: 0x99ddff, emissive: 0x113344, type: 'ice', distance: 780, eccentricity: 0.97, inclination: 0.04, orbitSpeed: 0.0001 },
    { name: 'neptune', radius: 42, color: 0x3377ff, emissive: 0x112244, type: 'ice', distance: 900, eccentricity: 0.98, inclination: 0.03, orbitSpeed: 0.00008 },
    
    // Additional planets with increased speeds
    { name: 'purple-gas', radius: 55, color: 0x9966dd, emissive: 0x221133, type: 'gas', distance: 1050, eccentricity: 0.94, inclination: 0.02, orbitSpeed: 0.00007 },
    { name: 'green-gas', radius: 60, color: 0x66dd99, emissive: 0x113322, type: 'gas', distance: 1200, eccentricity: 0.95, inclination: 0.01, orbitSpeed: 0.00006 },
    { name: 'red-desert', radius: 35, color: 0xff4422, emissive: 0x331100, type: 'desert', distance: 1350, eccentricity: 0.96, inclination: 0.03, orbitSpeed: 0.00005 },
    { name: 'blue-ringed', radius: 70, color: 0x22aaff, emissive: 0x002244, type: 'ringed', distance: 1500, eccentricity: 0.93, inclination: 0.02, orbitSpeed: 0.00004 },
    { name: 'lava-world', radius: 38, color: 0xff3300, emissive: 0x551100, type: 'lava', distance: 430, eccentricity: 0.92, inclination: 0.05, orbitSpeed: 0.00022 },
    { name: 'ice-world', radius: 32, color: 0xaaddff, emissive: 0x113355, type: 'ice', distance: 470, eccentricity: 0.97, inclination: 0.01, orbitSpeed: 0.0002 },
    
    // Thêm một số hành tinh siêu nhỏ và siêu nhanh
    { name: 'comet1', radius: 5, color: 0xaaaaaa, emissive: 0x222222, type: 'rocky', distance: 150, eccentricity: 0.8, inclination: 0.1, orbitSpeed: 0.0008 },
    { name: 'comet2', radius: 6, color: 0xbbbbbb, emissive: 0x222222, type: 'rocky', distance: 200, eccentricity: 0.75, inclination: 0.12, orbitSpeed: 0.0006 },
    { name: 'mini1', radius: 10, color: 0xff9966, emissive: 0x331100, type: 'rocky', distance: 350, eccentricity: 0.9, inclination: 0.07, orbitSpeed: 0.0004 },
    { name: 'mini2', radius: 12, color: 0x66ffaa, emissive: 0x113322, type: 'ice', distance: 420, eccentricity: 0.88, inclination: 0.09, orbitSpeed: 0.0003 }
  ];
  
  planetTypes.forEach(planetData => {
    // Calculate initial position on orbit
    const angle = Math.random() * Math.PI * 2;
    const xRadius = planetData.distance;
    const zRadius = planetData.distance * planetData.eccentricity;
    
    const x = Math.cos(angle) * xRadius;
    const z = Math.sin(angle) * zRadius;
    
    // Create planet mesh
    const planet = createPlanet(planetData.radius, 32, new THREE.MeshStandardMaterial({
      color: planetData.color,
      emissive: planetData.emissive,
      roughness: 0.7,
      metalness: 0.2
    }));
    
    // Set initial position
    planet.position.set(x, 0, z);
    
    // Apply slight inclination to orbital plane
    planet.position.y = Math.sin(angle) * planetData.distance * planetData.inclination;
    
    // Store orbit data for animation and path creation
    planet.userData.orbitData = {
      radius: planetData.distance,
      eccentricity: planetData.eccentricity,
      inclination: planetData.inclination,
      angle: angle,
      speed: planetData.orbitSpeed
    };
    
    // Store planet type
    planet.userData.type = planetData.type;
    planet.userData.name = planetData.name;
    
    // Add detail and effects based on planet type
    switch(planetData.type) {
      case 'earth':
        // Add atmospheric glow
        addAtmosphereGlow(planet, 1.1, 0x4060ff, 0.3);
        // Add cloud layer
        addClouds(planet, planetData.radius * 1.02);
        break;
        
      case 'gas':
        // Add atmospheric glow
        addAtmosphereGlow(planet, 1.06, 0xddddff, 0.2);
        break;
        
      case 'rocky':
        // Add craters to rocky planets
        addCraters(planet, planetData.radius);
        break;
        
      case 'lava':
        // Add lava glow
        addAtmosphereGlow(planet, 1.1, 0xff5500, 0.4);
        // Add lava detail
        addLavaDetail(planet, planetData.radius);
        break;
        
      case 'ice':
        // Add soft glow
        addAtmosphereGlow(planet, 1.08, 0x88ccff, 0.2);
        break;
        
      case 'ringed':
        // Add planetary rings
        const ringColor1 = new THREE.Color(planetData.color).multiplyScalar(1.2);
        const ringColor2 = new THREE.Color(planetData.emissive).multiplyScalar(3.0);
        
        const rings = createPlanetRings(
          planetData.radius * 1.3, 
          planetData.radius * 2.5, 
          ringColor1.getHex(), 
          ringColor2.getHex()
        );
        
        rings.rotation.x = Math.PI / 4;
        rings.rotation.z = Math.PI / 6;
        planet.add(rings);
        break;
        
      case 'desert':
        // Add craters
        addCraters(planet, planetData.radius);
        break;
    }
    
    // Add to planets array for animation
    planets.push({
      mesh: planet,
      rotationSpeed: 0.001 + Math.random() * 0.01, // Rotation speed
      orbitData: planet.userData.orbitData
    });
    
    scene.add(planet);
  });
}

// Create a planet mesh
function createPlanet(radius, segments, material) {
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  return new THREE.Mesh(geometry, material);
}
// Function to add atmospheric glow
function addAtmosphereGlow(planet, scale, color, opacity) {
  const geometry = new THREE.SphereGeometry(planet.geometry.parameters.radius * scale, 32, 32);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      c: { value: 0.2 },
      p: { value: 3.0 },
      glowColor: { value: new THREE.Color(color) },
      viewVector: { value: new THREE.Vector3(0, 0, 1) }
    },
    vertexShader: `
      uniform vec3 viewVector;
      uniform float c;
      uniform float p;
      varying float intensity;
      void main() {
        vec3 vNormal = normalize(normalMatrix * normal);
        vec3 vNormel = normalize(normalMatrix * viewVector);
        intensity = pow(c - dot(vNormal, vNormel), p);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      varying float intensity;
      void main() {
        gl_FragColor = vec4(glowColor, intensity * ${opacity});
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  planet.add(mesh);
  
  // Store atmosphere for updates
  planet.userData.atmosphere = mesh;
}

// Add craters to rocky planets
function addCraters(planet, radius) {
  const craterCount = Math.floor(20 + Math.random() * 30);
  
  for (let i = 0; i < craterCount; i++) {
    // Random position on sphere
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    
    const craterRadius = (0.05 + Math.random() * 0.1) * radius;
    const craterGeometry = new THREE.CircleGeometry(craterRadius, 16);
    const craterMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    
    const crater = new THREE.Mesh(craterGeometry, craterMaterial);
    
    // Position on sphere
    crater.position.x = radius * Math.sin(phi) * Math.cos(theta);
    crater.position.y = radius * Math.sin(phi) * Math.sin(theta);
    crater.position.z = radius * Math.cos(phi);
    
    // Orient to face outward from center
    crater.lookAt(0, 0, 0);
    
    // Offset slightly to prevent z-fighting
    crater.translateZ(0.1);
    
    planet.add(crater);
  }
}

// Add cloud layer to Earth-like planets
function addClouds(planet, cloudRadius) {
  const cloudGeometry = new THREE.SphereGeometry(cloudRadius, 32, 32);
  const cloudMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x222222,
    transparent: true,
    opacity: 0.6,
    roughness: 1.0,
    metalness: 0.0
  });
  
  // Add noise texture to clouds
  cloudMaterial.onBeforeCompile = shader => {
    shader.uniforms.time = { value: 0 };
    
    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      `
      uniform float time;
      varying vec3 vPos;
      void main() {
        vPos = position;
      `
    );
    
    shader.fragmentShader = shader.fragmentShader.replace(
      'varying vec3 vViewPosition;',
      `
      varying vec3 vViewPosition;
      varying vec3 vPos;
      uniform float time;
      
      // Noise functions
      float hash(float n) {
        return fract(sin(n) * 43758.5453);
      }
      
      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        return mix(
          mix(
            mix(hash(dot(i, vec3(7.1, 157.1, 113.7))), 
                hash(dot(i + vec3(1, 0, 0), vec3(7.1, 157.1, 113.hash(dot(i + vec3(1, 0, 0), vec3(7.1, 157.1, 113.7))), f.x),
            mix(hash(dot(i + vec3(0, 1, 0), vec3(7.1, 157.1, 113.7))), 
                hash(dot(i + vec3(1, 1, 0), vec3(7.1, 157.1, 113.7))), f.x),
            f.y),
          mix(
            mix(hash(dot(i + vec3(0, 0, 1), vec3(7.1, 157.1, 113.7))), 
                hash(dot(i + vec3(1, 0, 1), vec3(7.1, 157.1, 113.7))), f.x),
            mix(hash(dot(i + vec3(0, 1, 1), vec3(7.1, 157.1, 113.7))), 
                hash(dot(i + vec3(1, 1, 1), vec3(7.1, 157.1, 113.7))), f.x),
            f.y),
          f.z);
      }
      `
    );
    
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      `
      void main() {
        // Cloud pattern based on position and time
        vec3 p = vPos * 3.0;
        p.x += time * 0.01; // Slow movement
        float cloudPattern = noise(p);
        cloudPattern += noise(p * 2.0) * 0.5;
        
        // Create gaps in clouds
        float cloudDensity = smoothstep(0.4, 0.6, cloudPattern);
      `
    );
    
    shader.fragmentShader = shader.fragmentShader.replace(
      'vec4 diffuseColor = vec4( diffuse, opacity );',
      'vec4 diffuseColor = vec4( diffuse, opacity * cloudDensity );'
    );
    
    // Update time value from animation loop
    cloudMaterial.userData.shader = shader;
  };
  
  const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
  clouds.rotation.y = Math.random() * Math.PI;
  planet.add(clouds);
  
  // Store for animation
  planet.userData = planet.userData || {};
  planet.userData.clouds = clouds;
  planet.userData.cloudRotationSpeed = 0.0005 + Math.random() * 0.0005; // Slow cloud movement
}

// Add lava detail to lava planets
function addLavaDetail(planet, radius) {
  // Add lava flow details
  const lavaGeometry = new THREE.SphereGeometry(radius * 1.01, 32, 32);
  const lavaMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      varying vec3 vPos;
      
      void main() {
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vPos;
      uniform float time;
      
      // Noise functions
      float hash(float n) { return fract(sin(n) * 43758.5453); }
      
      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        return mix(
          mix(
            mix(hash(dot(i, vec3(7.1, 157.1, 113.7))), 
                hash(dot(i + vec3(1, 0, 0), vec3(7.1, 157.1, 113.7))), f.x),
            mix(hash(dot(i + vec3(0, 1, 0), vec3(7.1, 157.1, 113.7))), 
                hash(dot(i + vec3(1, 1, 0), vec3(7.1, 157.1, 113.7))), f.x),
            f.y),
          mix(
            mix(hash(dot(i + vec3(0, 0, 1), vec3(7.1, 157.1, 113.7))), 
                hash(dot(i + vec3(1, 0, 1), vec3(7.1, 157.1, 113.7))), f.x),
            mix(hash(dot(i + vec3(0, 1, 1), vec3(7.1, 157.1, 113.7))), 
                hash(dot(i + vec3(1, 1, 1), vec3(7.1, 157.1, 113.7))), f.x),
            f.y),
          f.z);
      }
      
      void main() {
        // Create flowing lava pattern
        vec3 p = vPos * 5.0;
        float slowTime = time * 0.05;
        
        // Moving noise for lava flow
        float lavaFlow = noise(vec3(p.x + slowTime, p.y - slowTime, p.z));
        lavaFlow += noise(vec3(p.x * 2.0 - slowTime, p.y * 2.0, p.z * 2.0)) * 0.5;
        
        // Hot spots pulsing
        float hotSpots = noise(vec3(p.x * 3.0, p.y * 3.0, p.z * 3.0 + slowTime)) * 
                          noise(vec3(p.x * 2.0, p.y * 2.0, p.z * 2.0 - slowTime));
        hotSpots = pow(hotSpots, 3.0) * 3.0;
        
        // Combine patterns
        float pattern = lavaFlow + hotSpots;
        
        // Create cracks and flows
        float cracks = smoothstep(0.3, 0.7, pattern);
        
        // Lava color gradient based on heat
        vec3 darkLava = vec3(0.4, 0.0, 0.0);  // Dark red
        vec3 hotLava = vec3(1.0, 0.6, 0.0);   // Orange-yellow
        vec3 color = mix(darkLava, hotLava, cracks);
        
        // Add glow to hottest parts
        color += vec3(1.0, 0.8, 0.0) * hotSpots;
        
        // Calculate opacity for lava cracks
        float alpha = smoothstep(0.4, 0.5, pattern) * 0.6;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.FrontSide
  });
  
  const lavaMesh = new THREE.Mesh(lavaGeometry, lavaMaterial);
  planet.add(lavaMesh);
  
  // Store for animation
  planet.userData = planet.userData || {};
  planet.userData.lava = lavaMesh;
}

// Create rings for a planet
function createPlanetRings(innerRadius, outerRadius, baseColor, secondaryColor) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);
  
  // Custom UV mapping for ring texture
  const pos = geometry.attributes.position;
  const v3 = new THREE.Vector3();
  const ringUvs = [];
  
  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    const distToCenter = v3.length();
    const normDist = (distToCenter - innerRadius) / (outerRadius - innerRadius);
    ringUvs.push(normDist, 0);
  }
  
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(ringUvs, 2));
  
  // Convert colors to strings for shader
  const baseColorHex = new THREE.Color(baseColor).getHexString();
  const secondaryColorHex = new THREE.Color(secondaryColor).getHexString();
  
  const material = new THREE.ShaderMaterial({
    uniforms: {
      ringAlpha: { value: 0.7 },
      time: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPos;
      
      void main() {
        vUv = uv;
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPos;
      uniform float ringAlpha;
      uniform float time;
      
      // Noise function for more detail
      float hash(float n) {
        return fract(sin(n) * 43758.5453);
      }
      
      float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u * u * (3.0 - 2.0 * u);
        
        float res = mix(
          mix(hash(dot(ip, vec2(7.1, 157.1))), hash(dot(ip + vec2(1.0, 0.0), vec2(7.1, 157.1))), u.x),
          mix(hash(dot(ip + vec2(0.0, 1.0), vec2(7.1, 157.1))), hash(dot(ip + vec2(1.0, 1.0), vec2(7.1, 157.1))), u.x),
          u.y
        );
        return res * res;
      }
      
      void main() {
        float dist = vUv.x; // Distance from inner to outer edge
        
        // Create more detailed ring bands with noise
        float angle = atan(vPos.y, vPos.x);
        float bandDetail = 120.0; // More bands for detail
        float basePattern = 0.5 + 0.5 * sin(dist * bandDetail + angle * 5.0);
        
        // Add noise for texture details
        float noisePattern = noise(vec2(dist * 50.0, angle * 30.0)) * 0.2;
        
        // Combine patterns
        float pattern = basePattern + noisePattern;
        
        // Create gaps in the rings
        float gapWidth = 0.05;
        float gapCount = 5.0;
        float gapPattern = 1.0;
        
        for (float i = 0.1; i < 0.9; i += 1.0/gapCount) {
          float gapEdge = smoothstep(i - gapWidth, i, dist) * (1.0 - smoothstep(i, i + gapWidth, dist));
          gapPattern *= (1.0 - gapEdge * 0.8);
        }
        
        // Slowly rotate the texture
        float rotSpeed = 0.0001; // Very slow rotation
        float rotationOffset = time * rotSpeed;
        float rotatedPattern = 0.5 + 0.5 * sin((dist * bandDetail + angle * 5.0) + rotationOffset);
        
        // Fade out at edges
        float alpha = ringAlpha * smoothstep(0.0, 0.1, dist) * smoothstep(1.0, 0.8, dist) * gapPattern;
        
        // Combine with colors
        vec3 color1 = vec3(0x${baseColorHex}/255.0);
        vec3 color2 = vec3(0x${secondaryColorHex}/255.0);
        vec3 finalColor = mix(color1, color2, pattern);
        
        // Add shimmer effect for ice rings if blue
        if (color1.b > color1.r) {
            float shimmer = 0.5 + 0.5 * sin(angle * 50.0 + time * 0.5) * sin(dist * 30.0);
            finalColor += vec3(shimmer * 0.1);
        }
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  return new THREE.Mesh(geometry, material);
}
// Create distant spiral galaxies in the background
function createDistantGalaxies() {
  const galaxyPositions = [
    { x: -1500, y: 800, z: -1500, scale: 1.2, rotation: Math.PI / 6, type: 'spiral' },
    { x: 1800, y: -500, z: -2000, scale: 0.9, rotation: Math.PI / 3, type: 'spiral' },
    { x: 1200, y: 900, z: -1800, scale: 1.0, rotation: Math.PI / 4, type: 'elliptical' },
    { x: -1600, y: -700, z: -1700, scale: 1.1, rotation: Math.PI / 5, type: 'barred' },
    { x: 1500, y: 600, z: -2200, scale: 1.3, rotation: Math.PI / 3, type: 'spiral' },
    { x: -1300, y: 1000, z: -1900, scale: 0.8, rotation: Math.PI / 4, type: 'elliptical' }
  ];
  
  galaxyPositions.forEach(galaxyData => {
    let galaxy;
    
    switch(galaxyData.type) {
      case 'spiral':
        galaxy = createSpiralGalaxy();
        break;
      case 'elliptical': 
        galaxy = createEllipticalGalaxy();
        break;
      case 'barred':
        galaxy = createBarredSpiralGalaxy();
        break;
      default:
        galaxy = createSpiralGalaxy();
    }
    
    galaxy.position.set(galaxyData.x, galaxyData.y, galaxyData.z);
    galaxy.scale.set(galaxyData.scale, galaxyData.scale, galaxyData.scale);
    galaxy.rotation.x = galaxyData.rotation;
    
    galaxies.push({
      mesh: galaxy,
      rotationSpeed: 0.00005 + Math.random() * 0.00005, // Much slower rotation
      type: galaxyData.type
    });
    
    scene.add(galaxy);
  });
}

// Create a spiral galaxy
function createSpiralGalaxy() {
  const particleCount = 10000;
  const geometry = new THREE.BufferGeometry();
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);
  
  // Galaxy parameters
  const params = {
    radius: 250,
    branches: 4,
    spin: 1.5,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: spaceColors.brightBlue,
    outsideColor: spaceColors.pink
  };
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Position in a spiral pattern
    const radius = Math.random() * params.radius;
    const branchAngle = (i % params.branches) / params.branches * Math.PI * 2;
    const spinAngle = radius * params.spin;
    
    const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
    const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius * 0.2;
    const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
    
    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
    
    // Color
    const colorInside = params.insideColor.clone();
    const colorOutside = params.outsideColor.clone();
    
    const mixedColor = colorInside.clone().lerp(colorOutside, radius / params.radius);
    
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
    
    // Size
    scales[i] = Math.random() * 2 + 0.5;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
  
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      attribute vec3 color;
      attribute float scale;
      varying vec3 vColor;
      
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = scale * (200.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  return new THREE.Points(geometry, material);
}

// Create a barred spiral galaxy
function createBarredSpiralGalaxy() {
  const particleCount = 15000;
  const geometry = new THREE.BufferGeometry();
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);
  
  // Galaxy parameters
  const params = {
    radius: 300,
    branches: 2,
    spin: 1.2,
    randomness: 0.1,
    randomnessPower: 3,
    barLength: 100,
    barWidth: 30,
    insideColor: spaceColors.brightBlue,
    outsideColor: spaceColors.pink
  };
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Decide if particle is in the central bar or spiral arms
    const isInBar = i < particleCount * 0.3; // 30% particles in bar
    
    let x, y, z;
    
    if (isInBar) {
      // Position in a bar pattern
      const angle = Math.random() * Math.PI * 2;
      const barAngle = Math.random() < 0.5 ? 0 : Math.PI/2; // Align with bar axis
      const distance = Math.random() * params.barLength;
      
      // Add randomness to bar
      const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * distance;
      const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * distance * 0.3;
      const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * distance;
      
      x = Math.cos(barAngle) * distance + randomX;
      y = randomY;
      z = Math.sin(barAngle) * distance + randomZ;
    } else {
      // Position in a spiral pattern with bar connection
      const radius = params.barLength + Math.random() * (params.radius - params.barLength);
      const branchAngle = (i % params.branches) / params.branches * Math.PI * 2;
      const spinAngle = (radius - params.barLength) * params.spin;
      
      const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
      const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius * 0.2;
      const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
      
      x = Math.cos(branchAngle + spinAngle) * radius + randomX;
      y = randomY;
      z = Math.sin(branchAngle + spinAngle) * radius + randomZ;
    }
    
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
    
    // Color
    const colorInside = params.insideColor.clone();
    const colorOutside = params.outsideColor.clone();
    
    let mixedColor;
    if (isInBar) {
      // Bar is yellower
      mixedColor = new THREE.Color(0xffcc66);
    } else {
      // Arms follow color gradient
      const radius = Math.sqrt(x*x + z*z);
      const normalizedRadius = Math.min(1, (radius - params.barLength) / (params.radius - params.barLength));
      mixedColor = colorInside.clone().lerp(colorOutside, normalizedRadius);
    }
    
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
    
    // Size
    if (isInBar) {
      scales[i] = Math.random() * 2.5 + 1.0; // Bigger particles in bar
    } else {
      scales[i] = Math.random() * 2 + 0.5;
    }
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
  
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      attribute vec3 color;
      attribute float scale;
      varying vec3 vColor;
      
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = scale * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  return new THREE.Points(geometry, material);
}

// Create an elliptical galaxy
function createEllipticalGalaxy() {
  const particleCount = 20000;
  const geometry = new THREE.BufferGeometry();
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);
  
  // Galaxy parameters
  const params = {
    radius: 250,
    ellipticalFactor: 0.7, // Ratio of minor to major axis
    coreSize: 50,
    insideColor: new THREE.Color(0xffffcc), // Yellow-white core
    outsideColor: new THREE.Color(0xddddff)  // Blue-white edges
  };
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Use 3D spherical distribution with elliptical deformation
    // Inverse CDF for radial concentration toward center
    const u = Math.random();
    const v = Math.random();
    const theta = Math.acos(2 * v - 1); // Polar angle
    const phi = 2 * Math.PI * u;       // Azimuthal angle
    
    // Radial distribution concentrated toward center
    const r = Math.pow(Math.random(), 2) * params.radius;
    
    // Calculate position with elliptical deformation
    positions[i3] = r * Math.sin(theta) * Math.cos(phi);
    positions[i3 + 1] = r * Math.sin(theta) * Math.sin(phi) * params.ellipticalFactor;
    positions[i3 + 2] = r * Math.cos(theta) * params.ellipticalFactor;
    
    // Color depends on distance from center
    const distanceRatio = r / params.radius;
    
    // Create core-to-edge gradient
    let mixRatio;
    if (r < params.coreSize) {
      // Bright core
      mixRatio = 0;
    } else {
      // Gradual fade to edges
      mixRatio = (r - params.coreSize) / (params.radius - params.coreSize);
    }
    
    const mixedColor = params.insideColor.clone().lerp(params.outsideColor, mixRatio);
    
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
    
    // Size decreases with distance from center
    scales[i] = Math.max(0.5, 2.5 * (1 - distanceRatio)) + Math.random() * 0.5;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
  
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      attribute vec3 color;
      attribute float scale;
      varying vec3 vColor;
      
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = scale * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  return new THREE.Points(geometry, material);
}
// Mouse wheel handler for zoom
function onMouseWheel(event) {
  // Prevent default scrolling
  event.preventDefault();
  
  // Determine direction and amount
  const delta = -Math.sign(event.deltaY) * 0.1;
  
  // Update zoom level (with limits)
  zoomLevel = Math.max(0.5, Math.min(2.5, zoomLevel + delta));
}

// Mouse move handler
function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

// Touch move handler
function onDocumentTouchMove(event) {
  if (event.touches.length === 1) {
    mouseX = event.touches[0].clientX - windowHalfX;
    mouseY = event.touches[0].clientY - windowHalfY;
  }
}

// Keyboard controls for movement and camera
function onKeyDown(event) {
  const key = event.key.toLowerCase();
  const speed = 50; // Movement speed
  
  switch(key) {
    case 'w': // Move forward
      camera.position.z -= speed;
      break;
    case 's': // Move backward
      camera.position.z += speed;
      break;
    case 'a': // Move left
      camera.position.x -= speed;
      break;
    case 'd': // Move right
      camera.position.x += speed;
      break;
    case 'q': // Move up
      camera.position.y += speed;
      break;
    case 'e': // Move down
      camera.position.y -= speed;
      break;
    case 'r': // Reset view
      camera.position.set(0, cameraHeight, cameraDistance);
      targetRotationX = 0;
      targetRotationY = 0;
      zoomLevel = 1;
      break;
  }
  
  // Always look at center
  camera.lookAt(0, 0, 0);
}

// Window resize handler
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  
  if (camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  
  if (renderer) {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  if (composer) {
    composer.setSize(window.innerWidth, window.innerHeight);
  }
}

// Animation loop
// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  const elapsedTime = clock.getElapsedTime();
  
  // Update camera position based on mouse (much slower)
  targetRotationY += (mouseX * 0.00002 - targetRotationY) * 0.01;
  targetRotationX += (mouseY * 0.00002 - targetRotationX) * 0.01;
  
  // Apply zoom level to camera position
  const actualDistance = cameraDistance / zoomLevel;
  
  camera.position.x = actualDistance * Math.sin(targetRotationY);
  camera.position.z = actualDistance * Math.cos(targetRotationY);
  camera.position.y = cameraHeight + actualDistance * 0.25 * targetRotationX;
  
  camera.lookAt(0, 0, 0);
  
  // Animate sun rotation and flares
  if (sunMesh) {
    sunMesh.rotation.y += 0.001;
    
    // Update sun corona and flares
    sunMesh.children.forEach(child => {
      if (child.material && child.material.uniforms && child.material.uniforms.time) {
        child.material.uniforms.time.value = elapsedTime;
      }
    });
  }
  
  // Animate stars
  if (starField && starField.material.uniforms) {
    starField.material.uniforms.time.value = elapsedTime;
  }
  
  // Animate flares
  scene.children.forEach(child => {
    if (child.material && child.material.uniforms && child.material.uniforms.time !== undefined) {
      child.material.uniforms.time.value = elapsedTime;
      
      // Make flares face the camera
      if (child.userData && child.userData.originalPosition) {
        child.lookAt(camera.position);
      }
    }
  });
  
  // Animate planets
  planets.forEach(planet => {
    // Self rotation
    planet.mesh.rotation.y += planet.rotationSpeed;
    
    // Orbit motion
    if (planet.orbitData) {
      const orbitData = planet.orbitData;
      orbitData.angle += orbitData.speed;
      
      // Calculate new position on elliptical orbit
      const x = Math.cos(orbitData.angle) * orbitData.radius;
      const z = Math.sin(orbitData.angle) * orbitData.radius * orbitData.eccentricity;
      
      // Apply inclination
      const y = Math.sin(orbitData.angle) * orbitData.radius * orbitData.inclination;
      
      planet.mesh.position.set(x, y, z);
    }
    
    // Update shader uniforms
    updatePlanetShaders(planet.mesh, elapsedTime);
  });
  
  // Animate galaxies (much slower rotation)
  galaxies.forEach(galaxy => {
    // Each galaxy type rotates differently
    if (galaxy.type === 'barred') {
      galaxy.mesh.rotation.y += galaxy.rotationSpeed * 0.6;
    } else if (galaxy.type === 'elliptical') {
      galaxy.mesh.rotation.y += galaxy.rotationSpeed * 0.3;
      galaxy.mesh.rotation.z += galaxy.rotationSpeed * 0.2;
    } else {
      galaxy.mesh.rotation.y += galaxy.rotationSpeed;
      
      // Add subtle wobble to spiral galaxies
      const wobbleAmount = 0.005;
      galaxy.mesh.rotation.x = Math.sin(elapsedTime * 0.02) * wobbleAmount;
    }
    
    // Update shader uniforms
    if (galaxy.mesh.material && galaxy.mesh.material.uniforms && galaxy.mesh.material.uniforms.time) {
      galaxy.mesh.material.uniforms.time.value = elapsedTime;
    }
  });
  
  // Render scene with composer for bloom effect
  if (composer) {
    composer.render();
  } else if (renderer) {
    renderer.render(scene, camera);
  }
}

// Update all shaders in a planet mesh hierarchy
function updatePlanetShaders(planetMesh, time) {
  // Update main planet shader
  if (planetMesh.material && planetMesh.material.userData && planetMesh.material.userData.shader) {
    planetMesh.material.userData.shader.uniforms.time.value = time;
  }
  
  // Update atmosphere shader
  if (planetMesh.userData.atmosphere && 
      planetMesh.userData.atmosphere.material && 
      planetMesh.userData.atmosphere.material.uniforms) {
    planetMesh.userData.atmosphere.material.uniforms.viewVector.value = camera.position.clone().sub(planetMesh.position);
  }
  
  // Update cloud shader
  if (planetMesh.userData.clouds && 
      planetMesh.userData.clouds.material && 
      planetMesh.userData.clouds.material.userData && 
      planetMesh.userData.clouds.material.userData.shader) {
    planetMesh.userData.clouds.material.userData.shader.uniforms.time.value = time;
    planetMesh.userData.clouds.rotation.y += planetMesh.userData.cloudRotationSpeed || 0.001;
  }
  
  // Update lava shader
  if (planetMesh.userData.lava && 
      planetMesh.userData.lava.material && 
      planetMesh.userData.lava.material.uniforms) {
    planetMesh.userData.lava.material.uniforms.time.value = time;
  }
  
  // Update any rings
  planetMesh.children.forEach(child => {
    if (child.geometry instanceof THREE.RingGeometry && 
        child.material && 
        child.material.uniforms && 
        child.material.uniforms.time) {
      child.material.uniforms.time.value = time;
    }
  });
}

// Export functions
export { init, animate };

// Initialize when page loads
window.addEventListener('load', init);
