// Service Card Neural Network Background
class ServiceCardBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.particles = [];
    this.isPaused = false;
    this.init();
  }

  init() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    // Setup Three.js scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.width / this.canvas.height,
      0.1,
      1000
    );
    this.camera.position.z = 300;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.renderer.setClearColor(0x000000, 0);

    // Create particles
    this.createParticles();

    // Start animation
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => this.handleResize());
  }

  createParticles() {
    // Reduce particle count on mobile
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 25 : 40;

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 400;
      const y = (Math.random() - 0.5) * 300;
      const z = (Math.random() - 0.5) * 200;

      positions.push(x, y, z);

      // Gradient color (purple to blue)
      const t = Math.random();
      const r = 139/255 + (59/255 - 139/255) * t;
      const g = 92/255 + (130/255 - 92/255) * t;
      const b = 246/255 + (246/255 - 246/255) * t;
      colors.push(r, g, b);

      this.particles.push({
        velocity: {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5,
          z: (Math.random() - 0.5) * 0.2
        },
        originalPosition: { x, y, z }
      });
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });

    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);

    // Create connections (lines)
    this.connections = new THREE.Group();
    this.scene.add(this.connections);
  }

  updateConnections() {
    // Remove old connections
    while (this.connections.children.length > 0) {
      const line = this.connections.children[0];
      line.geometry.dispose();
      line.material.dispose();
      this.connections.remove(line);
    }

    const positions = this.points.geometry.attributes.position.array;
    const connectionDistance = 120;
    let connectionCount = 0;
    const maxConnections = 50; // Performance limit

    // Create new connections
    for (let i = 0; i < positions.length && connectionCount < maxConnections; i += 3) {
      for (let j = i + 3; j < positions.length && connectionCount < maxConnections; j += 3) {
        const dx = positions[i] - positions[j];
        const dy = positions[i + 1] - positions[j + 1];
        const dz = positions[i + 2] - positions[j + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < connectionDistance) {
          const geometry = new THREE.BufferGeometry();
          const linePositions = new Float32Array([
            positions[i], positions[i + 1], positions[i + 2],
            positions[j], positions[j + 1], positions[j + 2]
          ]);
          geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

          const material = new THREE.LineBasicMaterial({
            color: 0x3B82F6,
            transparent: true,
            opacity: 0.15 * (1 - distance / connectionDistance)
          });

          const line = new THREE.Line(geometry, material);
          this.connections.add(line);
          connectionCount++;
        }
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.isPaused) return; // Skip animation if paused

    const positions = this.points.geometry.attributes.position.array;
    const time = Date.now() * 0.001;

    // Update particle positions
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      const index = i * 3;

      // Floating motion
      positions[index] += particle.velocity.x;
      positions[index + 1] += particle.velocity.y;
      positions[index + 2] += particle.velocity.z;

      // Boundary check
      if (Math.abs(positions[index]) > 200) particle.velocity.x *= -1;
      if (Math.abs(positions[index + 1]) > 150) particle.velocity.y *= -1;
      if (Math.abs(positions[index + 2]) > 100) particle.velocity.z *= -1;
    }

    this.points.geometry.attributes.position.needsUpdate = true;
    this.updateConnections();

    // Slow rotation
    this.points.rotation.y = time * 0.05;

    this.renderer.render(this.scene, this.camera);
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  handleResize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.camera.aspect = this.canvas.width / this.canvas.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.width, this.canvas.height);
  }

  dispose() {
    // Clean up resources
    if (this.points) {
      this.points.geometry.dispose();
      this.points.material.dispose();
    }
    while (this.connections.children.length > 0) {
      const line = this.connections.children[0];
      line.geometry.dispose();
      line.material.dispose();
      this.connections.remove(line);
    }
    this.renderer.dispose();
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  const canvases = document.querySelectorAll('.service-card-canvas');
  const backgrounds = [];

  canvases.forEach(canvas => {
    const background = new ServiceCardBackground(canvas);
    backgrounds.push(background);
    // Store reference on canvas for later access
    canvas.background = background;
  });

  // Performance optimization: pause animations when cards not in viewport
  const serviceCardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const canvas = entry.target.querySelector('.service-card-canvas');
      if (canvas && canvas.background) {
        if (entry.isIntersecting) {
          canvas.background.resume();
        } else {
          canvas.background.pause();
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  document.querySelectorAll('.service-card-wrapper').forEach(wrapper => {
    serviceCardObserver.observe(wrapper);
  });
});
