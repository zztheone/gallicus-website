/**
 * Orbital Timeline Component
 * Displays benefits in an orbital animation around a central node
 */

class OrbitalTimeline {
  constructor(containerId, benefits) {
    this.container = document.getElementById(containerId);
    this.benefits = benefits;
    this.rotationAngle = 0;
    this.autoRotate = true;
    this.activeNodeId = null;
    this.animationFrame = null;

    this.init();
  }

  init() {
    this.render();
    
    // First immediate call after render
    this.updateRotation();
    this.attachEventListeners();
    
    // Second call with delay to ensure DOM is fully ready
    setTimeout(() => {
      this.updateRotation();
      this.startAutoRotation();
    }, 100);
  }

  render() {
    const orbitalHTML = `
      <div class="orbital-container" id="orbital-container">
        <div class="orbital-viewport">
          <!-- Center node -->
          <div class="center-node">
            <div class="center-pulse pulse-1"></div>
            <div class="center-pulse pulse-2"></div>
            <div class="center-core"></div>
          </div>

          <!-- Orbit ring -->
          <div class="orbit-ring"></div>

          <!-- Benefit nodes -->
          ${this.benefits.map((benefit, index) => this.renderNode(benefit, index)).join('')}
        </div>
        <!-- Mobile card overlay (outside transform context) -->
        <div class="orbital-card-overlay"></div>
      </div>
    `;

    this.container.innerHTML = orbitalHTML;
  }

  renderNode(benefit, index) {
    const total = this.benefits.length;
    const angle = (index / total) * 360;

    return `
      <div class="orbital-node" data-id="${benefit.id}" data-index="${index}" data-base-angle="${angle}">
        <div class="node-glow"></div>
        <div class="node-circle">
          ${benefit.icon}
        </div>
        <div class="node-label">${benefit.title}</div>

        <!-- Info card -->
        <div class="node-card">
          <div class="card-connector"></div>
          <div class="card-content">
            <div class="card-header">
              <span class="card-category">Bénéfice</span>
            </div>
            <h3 class="card-title">${benefit.title}</h3>
            <p class="card-description">${benefit.description}</p>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const nodes = this.container.querySelectorAll('.orbital-node');
    const container = this.container.querySelector('#orbital-container');

    nodes.forEach(node => {
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        const nodeId = parseInt(node.dataset.id);
        this.toggleNode(nodeId, node);
      });
    });

    // Click outside to close
    container.addEventListener('click', (e) => {
      if (e.target === container || e.target.classList.contains('orbital-viewport')) {
        this.closeAllNodes();
      }
    });
  }

  toggleNode(nodeId, nodeElement) {
    const allNodes = this.container.querySelectorAll('.orbital-node');

    // Close all other nodes
    allNodes.forEach(n => {
      if (parseInt(n.dataset.id) !== nodeId) {
        n.classList.remove('active');
      }
    });

    // Toggle current node
    const isActive = nodeElement.classList.contains('active');

    if (!isActive) {
      nodeElement.classList.add('active');
      this.activeNodeId = nodeId;
      this.autoRotate = false;
      this.stopAutoRotation();

      // Center the node
      const nodeIndex = parseInt(nodeElement.dataset.index);
      const targetAngle = (nodeIndex / this.benefits.length) * 360;
      this.rotationAngle = 270 - targetAngle;
      this.updateRotation();

      // On mobile, show card in overlay (outside transform context)
      this.updateMobileOverlay(nodeElement);
    } else {
      nodeElement.classList.remove('active');
      this.activeNodeId = null;
      this.autoRotate = true;
      this.startAutoRotation();
      this.clearMobileOverlay();
    }
  }

  updateMobileOverlay(nodeElement) {
    if (window.innerWidth > 480) return;
    const overlay = this.container.querySelector('.orbital-card-overlay');
    if (!overlay) return;
    const card = nodeElement.querySelector('.node-card');
    if (!card) return;
    overlay.innerHTML = card.innerHTML;
    overlay.classList.add('visible');
  }

  clearMobileOverlay() {
    const overlay = this.container.querySelector('.orbital-card-overlay');
    if (!overlay) return;
    overlay.innerHTML = '';
    overlay.classList.remove('visible');
  }

  closeAllNodes() {
    const allNodes = this.container.querySelectorAll('.orbital-node');
    allNodes.forEach(n => n.classList.remove('active'));
    this.activeNodeId = null;
    this.autoRotate = true;
    this.startAutoRotation();
    this.clearMobileOverlay();
  }

  startAutoRotation() {
    if (!this.autoRotate) return;

    const rotate = () => {
      if (!this.autoRotate) return;

      this.rotationAngle = (this.rotationAngle + 0.05) % 360;
      this.updateRotation();

      this.animationFrame = requestAnimationFrame(rotate);
    };

    this.animationFrame = requestAnimationFrame(rotate);
  }

  stopAutoRotation() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  getRadius() {
    const viewport = this.container.querySelector('.orbital-viewport');
    const size = viewport ? viewport.offsetWidth : 600;
    return (size / 2) - 40;
  }

  updateRotation() {
    const nodes = this.container.querySelectorAll('.orbital-node');
    const radius = this.getRadius();

    nodes.forEach(node => {
      const baseAngle = parseFloat(node.dataset.baseAngle);
      const currentAngle = (baseAngle + this.rotationAngle) % 360;

      const radian = (currentAngle * Math.PI) / 180;
      const x = radius * Math.cos(radian);
      const y = radius * Math.sin(radian);

      // Keep all nodes on the outer circle - no 3D depth effect
      node.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      
      // Higher z-index for active node
      node.style.zIndex = node.classList.contains('active') ? 200 : 100;

      // All nodes fully visible on the outer circle
      node.style.opacity = node.classList.contains('active') ? 1 : 0.9;
    });
  }
  destroy() {
    this.stopAutoRotation();
    this.container.innerHTML = '';
  }
}

// Export for use
window.OrbitalTimeline = OrbitalTimeline;
