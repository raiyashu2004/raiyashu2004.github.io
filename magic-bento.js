/**
 * MagicBento - Vanilla JS Port
 * Handles global spotlight, tilt, magnetism, and particle effects for Bento boxes.
 */
document.addEventListener("DOMContentLoaded", () => {
  const isMobile = window.innerWidth <= 768;
  if (isMobile) return; // Disable complex animations on mobile for performance

  const glowColor = '132, 0, 255'; // Purple
  const spotlightRadius = 300;
  const particleCount = 12;

  // 1. Global Spotlight
  const bentoSection = document.querySelector('.bento-section');
  if (bentoSection) {
    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);

    const cards = bentoSection.querySelectorAll('.magic-bento-card');

    const calculateSpotlightValues = (radius) => ({
      proximity: radius * 0.5,
      fadeDistance: radius * 0.75
    });

    const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
      const rect = card.getBoundingClientRect();
      const relativeX = ((mouseX - rect.left) / rect.width) * 100;
      const relativeY = ((mouseY - rect.top) / rect.height) * 100;

      card.style.setProperty('--glow-x', `${relativeX}%`);
      card.style.setProperty('--glow-y', `${relativeY}%`);
      card.style.setProperty('--glow-intensity', glow.toString());
      card.style.setProperty('--glow-radius', `${radius}px`);
    };

    bentoSection.addEventListener('mousemove', (e) => {
      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(card, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlight, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      const targetOpacity = minDistance <= proximity ? 0.8 : minDistance <= fadeDistance ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8 : 0;

      gsap.to(spotlight, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out'
      });
    });

    bentoSection.addEventListener('mouseleave', () => {
      cards.forEach(card => card.style.setProperty('--glow-intensity', '0'));
      gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: 'power2.out' });
    });
  }

  // 2. Individual Card Logic (Tilt, Magnetism, Particles, Click)
  const createParticleElement = (x, y) => {
    const el = document.createElement('div');
    el.className = 'particle';
    el.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: rgba(${glowColor}, 1);
      box-shadow: 0 0 6px rgba(${glowColor}, 0.6);
      pointer-events: none;
      z-index: 100;
      left: ${x}px;
      top: ${y}px;
      opacity: 0;
      transform: scale(0);
    `;
    return el;
  };

  document.querySelectorAll('.magic-bento-card').forEach(card => {
    let particles = [];
    let timeouts = [];
    let isHovered = false;

    // Tilt & Magnetism
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      const magnetX = (x - centerX) * 0.03;
      const magnetY = (y - centerY) * 0.03;

      gsap.to(card, {
        rotateX, rotateY, x: magnetX, y: magnetY,
        duration: 0.1, ease: 'power2.out', transformPerspective: 1000
      });
    });

    // Particles start
    card.addEventListener('mouseenter', () => {
      isHovered = true;
      const rect = card.getBoundingClientRect();

      for (let i = 0; i < particleCount; i++) {
        const timeoutId = setTimeout(() => {
          if (!isHovered) return;
          const particle = createParticleElement(Math.random() * rect.width, Math.random() * rect.height);
          card.appendChild(particle);
          particles.push(particle);

          gsap.to(particle, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
          gsap.to(particle, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            rotation: Math.random() * 360,
            duration: 2 + Math.random() * 2,
            ease: 'none',
            repeat: -1,
            yoyo: true
          });
          gsap.to(particle, { opacity: 0.3, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true });
        }, i * 100);
        timeouts.push(timeoutId);
      }
    });

    // Reset tilt and particles
    card.addEventListener('mouseleave', () => {
      isHovered = false;
      gsap.to(card, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.3, ease: 'power2.out' });

      timeouts.forEach(clearTimeout);
      timeouts = [];

      particles.forEach(p => {
        gsap.to(p, {
          scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(1.7)',
          onComplete: () => p.remove()
        });
      });
      particles = [];
    });

    // Click Ripple
    card.addEventListener('click', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = Math.max(
        Math.hypot(x, y), Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;
      card.appendChild(ripple);

      gsap.fromTo(ripple, 
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() }
      );
    });
  });
});
