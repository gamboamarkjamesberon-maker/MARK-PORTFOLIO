document.addEventListener('DOMContentLoaded', () => {
  // 1. Dark Mode / Light Mode Toggle with LocalStorage Persistence
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = document.getElementById('themeLabel');

  const savedTheme = localStorage.getItem('mj-portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (themeLabel) {
      themeLabel.textContent = theme === 'dark' ? 'DARK' : 'LIGHT';
    }
    localStorage.setItem('mj-portfolio-theme', theme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // 2. Scroll Progress Bar
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) {
      scrollProgress.style.width = `${pct}%`;
    }
  });

  // 3. Interactive Moving Neon Particle Network Canvas
  const canvas = document.getElementById('cyberCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: null, y: null, radius: 140 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particleCount = Math.min(55, Math.floor((width * height) / 22000));
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.75,
      vy: (Math.random() - 0.5) * 0.75,
      size: Math.random() * 2.2 + 1.2,
      isGreen: i % 2 === 0
    }));

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      const isDark = htmlEl.getAttribute('data-theme') !== 'light';
      const blueColor = isDark ? '0, 212, 255' : '0, 136, 204';
      const greenColor = isDark ? '0, 255, 157' : '0, 168, 107';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Subtle mouse repulsion
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius && dist > 0) {
            p.x += (dx / dist) * 1.4;
            p.y += (dy / dist) * 1.4;
          }
        }

        const rgb = p.isGreen ? greenColor : blueColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${isDark ? 0.75 : 0.55})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * (isDark ? 0.25 : 0.18);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // 4. Typing Effect in Hero
  const typingEl = document.getElementById('typingText');
  const phrases = [
    '1st Year IT Student @ Mindoro State University',
    'Aspiring Future Engineer · Calapan City',
    'C# & C Programming Certified (99%+ Score)',
    'Always Learning · Spreading Positive Energy'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeLoop() {
    if (!typingEl) return;
    const currentPhrase = phrases[phraseIdx];
    typingEl.textContent = currentPhrase.substring(0, charIdx);

    if (!isDeleting && charIdx < currentPhrase.length) {
      charIdx++;
      setTimeout(typeLoop, 55);
    } else if (!isDeleting && charIdx === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1800);
    } else if (isDeleting && charIdx > 0) {
      charIdx--;
      setTimeout(typeLoop, 30);
    } else {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeLoop, 350);
    }
  }
  typeLoop();

  // 5. Interactive 3D Hover Tilt on Cards
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 6. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 7. Scroll Reveal Observer
  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((el) => observer.observe(el));

  // 8. Certificate Modal Data
  const certificates = {
    csharp: {
      badge: 'CODECHUM C# · VERIFIED',
      score: '99.8% · 1312/1315',
      subtitle: 'C# Programming 1 (1F3-ITC112-CSharp)',
      description:
        'has successfully completed C# Programming 1 in 1F3-ITC112-CSharp with a total score of 1312/1315 at Mindoro State University.',
      date: 'Nov. 8, 2026',
      id: '32405',
      rawScore: '1312 / 1315',
      url: 'https://minsu.codechum.com/certificates/32405'
    },
    clang: {
      badge: 'CODECHUM C · VERIFIED',
      score: '99.0% · 1352/1365',
      subtitle: 'C Programming 1 (1F3-ITC112)',
      description:
        'has successfully completed C Programming 1 in 1F3-ITC112 with a total score of 1352/1365 at Mindoro State University.',
      date: 'Nov. 8, 2026',
      id: '32362',
      rawScore: '1352 / 1365',
      url: 'https://minsu.codechum.com/certificates/32362'
    }
  };

  const modal = document.getElementById('certModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');

  function openCertModal(key) {
    const data = certificates[key];
    if (!data || !modal) return;

    document.getElementById('modalBadge').textContent = data.badge;
    document.getElementById('modalScore').textContent = data.score;
    document.getElementById('modalSubtitle').textContent = data.subtitle;
    document.getElementById('modalDescription').textContent = data.description;
    document.getElementById('modalDate').textContent = data.date;
    document.getElementById('modalCertId').textContent = data.id;
    document.getElementById('modalRawScore').textContent = data.rawScore;
    document.getElementById('modalVerifyLink').href = data.url;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeCertModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.cert-card').forEach((card) => {
    card.addEventListener('click', () => {
      openCertModal(card.dataset.cert);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCertModal(card.dataset.cert);
      }
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeCertModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeCertModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeCertModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCertModal();
  });

  // 9. Copy Email Button
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        const original = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyEmailBtn.textContent = original;
        }, 2000);
      } catch {
        copyEmailBtn.textContent = email;
      }
    });
  }

  // 10. Quick Message Form -> Opens Mail Client Pre-filled
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value.trim();
      const message = document.getElementById('senderMessage').value.trim();
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Mark James (MJ),\n\n${message}\n\nFrom,\n${name}`);
      window.location.href = `mailto:gamboamarkjamesberon@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
