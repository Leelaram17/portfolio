/* ===================================================
   NAVBAR — scroll effect + hamburger
=================================================== */
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  highlightActiveSection();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function highlightActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  allNavLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
  });
}

/* ===================================================
   HERO CANVAS — particle network
=================================================== */
(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles, mouse = { x: null, y: null };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticles() {
    const count = Math.floor((W * H) / 12000);
    particles = Array.from({ length: count }, () => ({
      x:  rand(0, W), y: rand(0, H),
      vx: rand(-0.3, 0.3), vy: rand(-0.3, 0.3),
      r:  rand(1, 2.5),
      alpha: rand(0.3, 0.8),
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${0.18 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      // connection to mouse
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(6,182,212,${0.25 * (1 - dist / 160)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // draw dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,139,250,${p.alpha})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  window.addEventListener('resize', () => { resize(); createParticles(); });
  resize();
  createParticles();
  draw();
})();

/* ===================================================
   TYPING ANIMATION
=================================================== */
(function () {
  const el    = document.getElementById('typed');
  const words = [
    'Java Applications',
    'Microservices',
    'Cloud-Native Solutions',
    'RESTful APIs',
    'Scalable Systems',
    'Event-Driven Apps',
  ];
  let wordIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const word    = words[wordIdx];
    const current = deleting ? word.substring(0, charIdx - 1) : word.substring(0, charIdx + 1);
    el.textContent = current;
    deleting ? charIdx-- : charIdx++;

    let delay = deleting ? 60 : 100;

    if (!deleting && charIdx === word.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      wordIdx  = (wordIdx + 1) % words.length;
      delay    = 300;
    }
    setTimeout(type, delay);
  }
  setTimeout(type, 800);
})();

/* ===================================================
   SCROLL REVEAL
=================================================== */
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===================================================
   COUNTER ANIMATION
=================================================== */
const counterObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    counterObserver.unobserve(e.target);
    const target = parseInt(e.target.dataset.count, 10);
    const duration = 1600;
    const step     = Math.max(1, Math.floor(duration / target));
    let current = 0;
    const timer = setInterval(() => {
      current += Math.ceil(target / (duration / 16));
      if (current >= target) { current = target; clearInterval(timer); }
      e.target.textContent = current;
    }, 16);
  }),
  { threshold: 0.5 }
);
document.querySelectorAll('.stat-number[data-count]').forEach(el => counterObserver.observe(el));

/* ===================================================
   CONTACT FORM — simulated success
   (Replace Formspree action URL with your real one,
    or hook up EmailJS / Netlify Forms)
=================================================== */
const form    = document.getElementById('contact-form');
const success = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async e => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         style="animation:spin .8s linear infinite">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg> Sending…`;

  // If you add a real Formspree/Netlify endpoint, replace this timeout with a real fetch:
  await new Promise(r => setTimeout(r, 1400));

  submitBtn.style.display = 'none';
  success.style.display   = 'block';
  form.reset();
});
