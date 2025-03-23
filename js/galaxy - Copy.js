// Realistic Space Scene with Planets, Stars and Galaxies
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/postprocessing/UnrealBloomPass.js';

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

// Space colors
const spaceColors = {
  deepBlue: new THREE.Color(0x0a0a30),
  brightBlue: new THREE.Color(0x1a3b8c),
  purple: new THREE.Color(0x4b0082),
  pink: new THREE.Color(0xff1493),
  orange: new THREE.Color(0xff4500),
  white: new THREE.Color(0xffffff)
};

// Initialize the scene
function init() {
  console.log("Space scene initialization starting...");
  
  // Add info text for camera controls
  addInfoText();
  
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
  scene.fog = new THREE.FogExp2(0x080830, 0.00008);
  
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
  
  // Create space elements
  createStarField();
  createNebula();
  createPlanets();
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
    1.0,  // strength
    0.5,  // radius
    0.2   // threshold
  );
  composer.addPass(bloomPass);
}

// Create star field
function createStarField() {
  // Background stars
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 10000;
  
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
  
  // Add a few very bright stars
  createBrightStars();
}

// Create bright foreground stars with rays
function createBrightStars() {
  for (let i = 0; i < 30; i++) {
    // Position bright stars more towards the visible area
    const x = (Math.random() - 0.5) * 3000;
    const y = (Math.random() - 0.5) * 3000;
    const z = (Math.random() - 0.5) * 3000;
    
    // Create a bright point
    const starGeometry = new THREE.SphereGeometry(2 + Math.random() * 6, 8, 8);
    const starMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    });
    
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.set(x, y, z);
    scene.add(star);
    
    // Add lens flare effect
    const flareSize = 15 + Math.random() * 25;
    const flareGeometry = new THREE.PlaneGeometry(flareSize, flareSize);
    const flareMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        
        void main() {
          float dist = length(vUv - vec2(0.5));
          float pulse = 0.5 + 0.5 * sin(time * 0.5);
          
          // Create rays
          float rays = 0.0;
          float angleStep = 3.14159 / 4.0;
          for (int i = 0; i < 8; i++) {
            float angle = float(i) * angleStep;
            vec2 dir = vec2(cos(angle), sin(angle));
            float alignment = abs(dot(normalize(vUv - vec2(0.5)), dir));
            alignment = pow(alignment, 8.0);
            rays += alignment * (0.3 + 0.1 * pulse);
          }
          
          // Core glow
          float intensity = smoothstep(0.5, 0.0, dist);
          
          // Combine
          float alpha = intensity + rays * (1.0 - intensity) * smoothstep(0.8, 0.0, dist);
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 0.7);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    
    const flare = new THREE.Mesh(flareGeometry, flareMaterial);
    flare.position.copy(star.position);
    flare.userData = { originalPosition: star.position.clone(), time: 0 };
    scene.add(flare);
  }
}

// Create nebula cloud effect
function createNebula() {
  // Create multiple nebula clouds
  createNebulaCloud(-400, 0, -200, 1000, spaceColors.brightBlue, spaceColors.purple, 0.2);
  createNebulaCloud(600, -200, -500, 1200, spaceColors.purple, spaceColors.pink, 0.15);
  createNebulaCloud(-800, 200, -800, 900, spaceColors.pink, spaceColors.orange, 0.1);
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
  // Planet textures would be better, but for simplicity we'll use basic materials
  const planetPositions = [
    // Inner planets
    { x: -150, y: 0, z: -50, radius: 30, type: 'rocky', orbitRadius: 150 }, // Mercury-like
    { x: -220, y: 10, z: -80, radius: 45, type: 'lava', orbitRadius: 220 },  // Venus-like
    { x: -300, y: 0, z: -100, radius: 50, type: 'earth', orbitRadius: 300 }, // Earth
    { x: -380, y: -5, z: -150, radius: 40, type: 'rocky', orbitRadius: 380 }, // Mars-like
    
    // Gas giants
    { x: -550, y: 20, z: -300, radius: 120, type: 'gas', orbitRadius: 550 }, // Jupiter-like
    { x: -750, y: 15, z: -400, radius: 100, type: 'ringed', orbitRadius: 750 }, // Saturn-like
    { x: -900, y: -10, z: -500, radius: 80, type: 'ice', orbitRadius: 900 }, // Uranus-like
    { x: -1050, y: 5, z: -600, radius: 75, type: 'ice', orbitRadius: 1050 }, // Neptune-like
    
    // Add extra planets like in your reference images
    { x: 350, y: 40, z: 200, radius: 90, type: 'desert', orbitRadius: 350 },
    { x: 600, y: -30, z: 400, radius: 110, type: 'gas', orbitRadius: 600 },
    { x: 800, y: 25, z: -350, radius: 85, type: 'ringed', orbitRadius: 800 },
    { x: 950, y: -35, z: 200, radius: 65, type: 'rocky', orbitRadius: 950 }
  ];
  
  // Set all planets to orbit in the same plane (more like solar system)
  const sharedOrbitAxis = new THREE.Vector3(0, 1, 0).normalize();
  
  planetPositions.forEach(planetData => {
    const planet = createPlanet(planetData.radius, 32, new THREE.MeshStandardMaterial());
    planet.position.set(planetData.x, planetData.y, planetData.z);
    
    let material;
    
    switch(planetData.type) {
      case 'earth':
        // Blue-green planet like Earth
        material = new THREE.MeshStandardMaterial({
          color: 0x1a66cc,
          emissive: 0x112244,
          roughness: 0.7,
          metalness: 0.1
        });
        planet.material = material;
        // Add atmospheric glow
        addAtmosphereGlow(planet, 1.1, 0x4060ff, 0.3);
        break;
      case 'gas':
        // Gas giant like Jupiter
        material = new THREE.MeshStandardMaterial({
          color: 0xd2b48c,
          emissive: 0x221100,
          roughness: 0.5,
          metalness: 0.2
        });
        planet.material = material;
        // Add stripes to gas giant
        material.onBeforeCompile = shader => {
          shader.fragmentShader = shader.fragmentShader.replace(
            'void main() {',
            `
            varying vec3 vPos;
            void main() {
              // Add stripes
              float stripe = sin(vPos.y * 20.0) * 0.1;
              `
          );
          shader.fragmentShader = shader.fragmentShader.replace(
            'vec4 diffuseColor = vec4( diffuse, opacity );',
            'vec4 diffuseColor = vec4( diffuse * (1.0 + stripe), opacity );'
          );
        };
        break;
      case 'rocky':
        // Rocky planet like Mars
        material = new THREE.MeshStandardMaterial({
          color: 0xaa5533,
          emissive: 0x331100,
          roughness: 0.9,
          metalness: 0.1
        });
        planet.material = material;
        break;
      case 'moon':
        // Grey moon
        material = new THREE.MeshStandardMaterial({
          color: 0x999999,
          emissive: 0x111111,
          roughness: 0.8,
          metalness: 0.2
        });
        planet.material = material;
        break;
      case 'ice':
        // Ice planet
        material = new THREE.MeshStandardMaterial({
          color: 0xaaddff,
          emissive: 0x113355,
          roughness: 0.3,
          metalness: 0.5
        });
        planet.material = material;
        // Add a soft glow
        addAtmosphereGlow(planet, 1.08, 0x88ccff, 0.2);
        break;
      case 'lava':
        // Lava planet
        material = new THREE.MeshStandardMaterial({
          color: 0xff3300,
          emissive: 0x992200,
          roughness: 0.7,
          metalness: 0.3
        });
        planet.material = material;
        // Add lava glow
        addAtmosphereGlow(planet, 1.1, 0xff5500, 0.4);
        break;
      case 'ringed':
        // Another ringed planet
        material = new THREE.MeshStandardMaterial({
          color: 0x7788aa,
          emissive: 0x223344,
          roughness: 0.6,
          metalness: 0.3
        });
        planet.material = material;
        break;
      case 'desert':
        // Desert planet
        material = new THREE.MeshStandardMaterial({
          color: 0xddbb88,
          emissive: 0x332211,
          roughness: 0.9,
          metalness: 0.1
        });
        planet.material = material;
        break;
    }
    
    // Add rings to appropriate planets
    if (planetData.type === 'gas') {
      const rings = createPlanetRings(planetData.radius * 1.5, planetData.radius * 2.2, 0xd2b48c, 0xaa8866);
      rings.rotation.x = Math.PI / 3;
      planet.add(rings);
    }
    
    if (planetData.type === 'ringed') {
      const rings = createPlanetRings(planetData.radius * 1.3, planetData.radius * 2.5, 0x88aadd, 0x4477aa);
      rings.rotation.x = Math.PI / 4;
      rings.rotation.z = Math.PI / 6;
      planet.add(rings);
    }
    
    // Add detail meshes to appropriate planets
    if (planetData.type === 'rocky' || planetData.type === 'desert') {
      addCraters(planet, planetData.radius);
    }
    
    if (planetData.type === 'earth') {
      addClouds(planet, planetData.radius * 1.02);
    }
    
    if (planetData.type === 'lava') {
      addLavaDetail(planet, planetData.radius);
    }
    
    // Add to planets array for animation
    planets.push({
      mesh: planet,
      rotationSpeed: 0.001 + Math.random() * 0.002, // Slower rotation
      orbitAxis: new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize(),
      orbitSpeed: 0.00002 + Math.random() * 0.00003, // Slower orbit
      hoverOffset: Math.random() * Math.PI * 2 // For vertical hovering effect
    });
    
    scene.add(planet);
  });
  
  // Add a light source (sun out of view)
  const sunLight = new THREE.PointLight(0xffffcc, 1, 3000);
  sunLight.position.set(1500, 500, -1000);
  scene.add(sunLight);
  
  // Add ambient light so planets aren't too dark on the shadow side
  const ambientLight = new THREE.AmbientLight(0x333355, 0.5);
  scene.add(ambientLight);
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
}

// Create a planet mesh
function createPlanet(radius, segments, material) {
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  return new THREE.Mesh(geometry, material);
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

// Create distant spiral galaxies in the background
function createDistantGalaxies() {
  const galaxyPositions = [
    { x: -1500, y: 800, z: -1500, scale: 1.2, rotation: Math.PI / 6, type: 'spiral' },
    { x: 1800, y: -500, z: -2000, scale: 0.9, rotation: Math.PI / 3, type: 'spiral' },
    { x: 1200, y: 900, z: -1800, scale: 1.0, rotation: Math.PI / 4, type: 'elliptical' },
    { x: -1600, y: -700, z: -1700, scale: 1.1, rotation: Math.PI / 5, type: 'barred' }
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
      rotationSpeed: 0.0001 + Math.random() * 0.0001, // Much slower rotation
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
function animate() {
  requestAnimationFrame(animate);
  
  const elapsedTime = clock.getElapsedTime();
  
  // Update camera position based on mouse (much slower)
  targetRotationY += (mouseX * 0.00005 - targetRotationY) * 0.01;
  targetRotationX += (mouseY * 0.00005 - targetRotationX) * 0.01;
  
  // Apply zoom level to camera position
  const actualDistance = cameraDistance / zoomLevel;
  
  camera.position.x = actualDistance * Math.sin(targetRotationY);
  camera.position.z = actualDistance * Math.cos(targetRotationY);
  camera.position.y = cameraHeight + actualDistance * 0.25 * targetRotationX;
  
  camera.lookAt(0, 0, 0);
  
  // Animate stars
  if (starField && starField.material.uniforms) {
    starField.material.uniforms.time.value = elapsedTime;
  }
  
  // Animate flares
  scene.children.forEach(child => {
    if (child.material && child.material.uniforms && child.material.uniforms.time !== undefined) {
      child.material.uniforms.time.value = elapsedTime;
      
      // Make flares face the camera
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
    
    // Add vertical hover motion
    const hoverAmount = Math.sin(elapsedTime * 0.1 + planet.hoverOffset) * 5;
    
    // Orbit motion (slower)
    const orbitRadius = planet.mesh.position.length();
    const orbitProgress = elapsedTime * planet.orbitSpeed;
    
    // Create rotation matrix for orbit
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationAxis(planet.orbitAxis, orbitProgress);
    
    // Apply orbit rotation
    const originalPosition = new THREE.Vector3(
      planet.mesh.position.x,
      planet.mesh.position.y,
      planet.mesh.position.z
    ).normalize().multiplyScalar(orbitRadius);
    
    // Apply hover effect to Y position
    originalPosition.y += hoverAmount;
    
    originalPosition.applyMatrix4(rotationMatrix);
    planet.mesh.position.copy(originalPosition);
    
    // Animate additional elements
    if (planet.mesh.userData.clouds) {
      planet.mesh.userData.clouds.rotation.y += planet.mesh.userData.cloudRotationSpeed;
    }
    
    // Update shader uniforms for special effects
    planet.mesh.traverse(child => {
      if (child.material && child.material.userData && child.material.userData.shader) {
        child.material.userData.shader.uniforms.time.value = elapsedTime;
      }
      
      if (child.material && child.material.uniforms && child.material.uniforms.time !== undefined) {
        child.material.uniforms.time.value = elapsedTime;
      }
    });
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
      galaxy.mesh.rotation.x = Math.sin(elapsedTime * 0.05) * wobbleAmount;
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

// Export functions
export { init, animate };

// Initialize when page loads
window.addEventListener('load', init);