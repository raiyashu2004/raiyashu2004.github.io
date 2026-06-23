document.addEventListener('DOMContentLoaded', () => {
  const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

  class LogoLoop {
    constructor(element) {
      this.container = element;
      this.track = element.querySelector('.logoloop__track');
      this.originalList = this.track.querySelector('.logoloop__list');
      
      this.speed = parseFloat(this.container.dataset.speed) || 120;
      this.direction = this.container.dataset.direction || 'left';
      this.hoverSpeed = this.container.dataset.hoverSpeed !== undefined ? parseFloat(this.container.dataset.hoverSpeed) : undefined;
      
      this.isVertical = this.direction === 'up' || this.direction === 'down';
      this.isHovered = false;
      this.seqWidth = 0;
      this.seqHeight = 0;
      this.copyCount = ANIMATION_CONFIG.MIN_COPIES;
      
      this.offset = 0;
      this.velocity = 0;
      this.lastTimestamp = null;
      this.rafId = null;

      this.init();
    }

    init() {
      // Hover events
      this.track.addEventListener('mouseenter', () => {
        if (this.hoverSpeed !== undefined) this.isHovered = true;
      });
      this.track.addEventListener('mouseleave', () => {
        if (this.hoverSpeed !== undefined) this.isHovered = false;
      });

      // Resize observer
      if (window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver(() => this.updateDimensions());
        this.resizeObserver.observe(this.container);
        this.resizeObserver.observe(this.originalList);
      } else {
        window.addEventListener('resize', () => this.updateDimensions());
      }

      // Initial layout & start
      setTimeout(() => {
        this.updateDimensions();
        this.startAnimation();
      }, 100);
    }

    updateDimensions() {
      if (!this.container || !this.originalList) return;

      const containerWidth = this.container.clientWidth || 0;
      const sequenceRect = this.originalList.getBoundingClientRect();
      const sequenceWidth = sequenceRect.width || 0;
      const sequenceHeight = sequenceRect.height || 0;

      if (this.isVertical) {
        // Vertical logic not strictly used here, but supported
        if (sequenceHeight > 0) {
          this.seqHeight = Math.ceil(sequenceHeight);
          const parentHeight = this.container.parentElement?.clientHeight || sequenceHeight;
          const viewport = this.container.clientHeight || parentHeight;
          const copiesNeeded = Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
          this.setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
        }
      } else {
        if (sequenceWidth > 0) {
          this.seqWidth = Math.ceil(sequenceWidth);
          const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
          this.setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
        }
      }
    }

    setCopyCount(count) {
      if (this.copyCount === count) return;
      this.copyCount = count;
      
      // Remove all children except original
      while (this.track.children.length > 1) {
        this.track.removeChild(this.track.lastChild);
      }

      // Clone original list
      for (let i = 1; i < count; i++) {
        const clone = this.originalList.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        this.track.appendChild(clone);
      }
    }

    getTargetVelocity() {
      const magnitude = Math.abs(this.speed);
      let directionMultiplier = (this.direction === 'left' || this.direction === 'up') ? 1 : -1;
      const speedMultiplier = this.speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }

    startAnimation() {
      const animate = (timestamp) => {
        if (this.lastTimestamp === null) {
          this.lastTimestamp = timestamp;
        }

        const deltaTime = Math.max(0, timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;

        const targetVel = this.getTargetVelocity();
        const currentTarget = (this.isHovered && this.hoverSpeed !== undefined) ? this.hoverSpeed : targetVel;

        const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
        this.velocity += (currentTarget - this.velocity) * easingFactor;

        const seqSize = this.isVertical ? this.seqHeight : this.seqWidth;

        if (seqSize > 0) {
          let nextOffset = this.offset + this.velocity * deltaTime;
          nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
          this.offset = nextOffset;

          const transformValue = this.isVertical
            ? `translate3d(0, ${-this.offset}px, 0)`
            : `translate3d(${-this.offset}px, 0, 0)`;
          this.track.style.transform = transformValue;
        }

        this.rafId = requestAnimationFrame(animate);
      };

      this.rafId = requestAnimationFrame(animate);
    }
  }

  // Initialize all logoloops
  document.querySelectorAll('.logoloop').forEach(el => new LogoLoop(el));
});
