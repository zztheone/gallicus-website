// Dotted Surface Animation using Three.js
// Adapted from React component to Vanilla JS

(function() {
  'use strict';

  // Configuration
  const SEPARATION = 150;
  const AMOUNTX = 40;
  const AMOUNTY = 60;
  const PARTICLE_SIZE = 8;
  const PARTICLE_OPACITY = 0.8;
  const WAVE_AMPLITUDE = 50;
  const ANIMATION_SPEED = 0.1;

  // Mobile detection and adjustment
  const isMobile = window.innerWidth < 768;
  const particleAmountX = isMobile ? 20 : AMOUNTX;
  const particleAmountY = isMobile ? 30 : AMOUNTY;

  // Get container
  const container = document.getElementById('dotted-surface-container');
  if (!container) {
    console.warn('DottedSurface: Container element not found');
    return;
  }

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 2000, 10000);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, 355, 1220);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(scene.fog.color, 0);

  // Append renderer to container
  container.appendChild(renderer.domElement);

  // Create particles
  const positions = [];
  const colors = [];

  // Create geometry for all particles
  const geometry = new THREE.BufferGeometry();

  for (let ix = 0; ix < particleAmountX; ix++) {
    for (let iy = 0; iy < particleAmountY; iy++) {
      const x = ix * SEPARATION - (particleAmountX * SEPARATION) / 2;
      const y = 0; // Will be animated
      const z = iy * SEPARATION - (particleAmountY * SEPARATION) / 2;

      positions.push(x, y, z);

      // White color for dark background
      colors.push(255, 255, 255);
    }
  }

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(colors, 3)
  );

  // Create material
  const material = new THREE.PointsMaterial({
    size: PARTICLE_SIZE,
    vertexColors: true,
    transparent: true,
    opacity: PARTICLE_OPACITY,
    sizeAttenuation: true,
  });

  // Create points object
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Animation variables
  let count = 0;
  let animationId;

  // Animation function
  function animate() {
    animationId = requestAnimationFrame(animate);

    const positionAttribute = geometry.attributes.position;
    const positions = positionAttribute.array;

    let i = 0;
    for (let ix = 0; ix < particleAmountX; ix++) {
      for (let iy = 0; iy < particleAmountY; iy++) {
        const index = i * 3;

        // Animate Y position with sine waves
        positions[index + 1] =
          Math.sin((ix + count) * 0.3) * WAVE_AMPLITUDE +
          Math.sin((iy + count) * 0.5) * WAVE_AMPLITUDE;

        i++;
      }
    }

    positionAttribute.needsUpdate = true;

    renderer.render(scene, camera);
    count += ANIMATION_SPEED;
  }

  // Handle window resize
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', handleResize);

  // Start animation
  animate();

  // Cleanup function (called on page unload)
  window.addEventListener('beforeunload', function() {
    cancelAnimationFrame(animationId);

    scene.traverse((object) => {
      if (object instanceof THREE.Points) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    renderer.dispose();

    if (container && renderer.domElement) {
      container.removeChild(renderer.domElement);
    }
  });
})();
