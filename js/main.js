/**
 * Amit Kumar Portfolio - Core Interactions, 3D Tilt, Theme Switcher & SFX Engine
 */

// Global Audio SFX Synthesizer (Zero external dependencies)
let soundEnabled = false;
let audioCtx = null;

function playFuturisticTone(freq = 600, duration = 0.08, type = 'sine') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // AudioContext blocked or not supported
  }
}

// Global Confetti Celebration Engine
window.triggerConfetti = function() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiPieces = [];
  const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#a855f7'];

  for (let i = 0; i < 70; i++) {
    confettiPieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let startTime = Date.now();

  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = Date.now() - startTime;

    confettiPieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // Gravity
      p.rotation += p.rSpeed;
      p.opacity = Math.max(0, 1 - elapsed / 2500);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (elapsed < 2500) {
      requestAnimationFrame(renderConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  renderConfetti();
};

// Global Toast System
window.showToast = function(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ';
  toast.innerHTML = `<span style="font-weight:700; font-size:1.1rem;">${icon}</span> <span>${message}</span>`;
  
  container.appendChild(toast);
  playFuturisticTone(type === 'success' ? 880 : 440, 0.1);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 2. Theme Accent Color Switcher
  const themeDots = document.querySelectorAll('.theme-dot');
  const savedTheme = localStorage.getItem('amit_portfolio_theme') || 'indigo';

  function applyTheme(theme) {
    document.body.className = theme === 'indigo' ? '' : `theme-${theme}`;
    themeDots.forEach(dot => {
      if (dot.getAttribute('data-theme') === theme) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    localStorage.setItem('amit_portfolio_theme', theme);
  }

  applyTheme(savedTheme);

  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const selected = dot.getAttribute('data-theme');
      applyTheme(selected);
      playFuturisticTone(1020, 0.06);
      window.showToast(`Accent Glow: ${selected.toUpperCase()} Mode Active`, 'info');
    });
  });

  // 3. Sound FX Toggle
  const soundBtn = document.getElementById('btn-toggle-sound');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.innerHTML = soundEnabled ? '🔊 Sound On' : '🔇 Sound Off';
      soundBtn.style.borderColor = soundEnabled ? 'var(--accent-secondary)' : 'var(--border-glass)';
      if (soundEnabled) {
        playFuturisticTone(750, 0.1);
        window.showToast('Futuristic Sound Effects Activated', 'success');
      }
    });
  }

  // 4. 3D Card Hover Tilt Effects
  const tiltElements = document.querySelectorAll('.avatar-wrapper, .project-card, .skill-card, .award-card');
  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });

    card.addEventListener('mouseenter', () => {
      playFuturisticTone(420, 0.04);
    });
  });

  // 5. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.innerHTML = navMenu.classList.contains('open') ? '✕' : '☰';
      playFuturisticTone(500, 0.05);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.innerHTML = '☰';
      });
    });
  }

  // 6. Hero Typewriter Effect
  const typewriterEl = document.getElementById('typewriter-text');
  if (typewriterEl) {
    const roles = [
      'Data Analytics Specialist',
      'Python & SQL Developer',
      'IoT & ESP8266 Engineer',
      'B.Tech CSE @ AKTU (2023–2027)'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 85;

    function type() {
      const current = roles[roleIdx];
      if (isDeleting) {
        typewriterEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        typingSpeed = 40;
      } else {
        typewriterEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIdx === current.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typingSpeed = 350;
      }

      setTimeout(type, typingSpeed);
    }
    type();
  }

  // 7. Skills Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playFuturisticTone(650, 0.05);

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 8. Contact Form Handler with Confetti
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value.trim();
      const email = document.getElementById('form-email')?.value.trim();
      const subject = document.getElementById('form-subject')?.value.trim();
      const message = document.getElementById('form-message')?.value.trim();

      if (!name || !email || !message) {
        window.showToast('Please fill out all required fields.', 'warning');
        return;
      }

      const mailtoUrl = `mailto:amitk55575@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Contact from ' + name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      window.open(mailtoUrl, '_blank');

      window.triggerConfetti();
      window.showToast(`Thank you, ${name}! Your email client has been prepared.`, 'success');
      contactForm.reset();
    });
  }

  // 9. Project Modal Details
  const projectDetails = {
    'safesphere': {
      title: 'SafeSphere — Smart Safety Monitoring Platform',
      badge: 'Web Application • Real-Time Safety & Threat Radar',
      desc: `SafeSphere is a comprehensive smart safety monitoring platform designed to detect environmental hazards, manage perimeter security, and transmit real-time telemetry alerts with zero latency. Built with responsive UI components, robust RESTful APIs for threat event logging, authenticated socket feeds, and role-based incident escalation workflows.`,
      tech: ['React.js (Basics)', 'JavaScript (ES6+)', 'REST APIs', 'Threat Logging', 'UI Testing', 'HTML5 / CSS3', 'Secure Auth']
    },
    'ai-resume': {
      title: 'AI Resume Maker — Intelligent ATS Resume Engine',
      badge: 'AI & Web Application • ATS Scoring & Export Engine',
      desc: `An intelligent resume generation platform that dynamically crafts tailored, ATS-friendly resumes based on target job descriptions and user credentials. Features real-time split-screen markdown preview, custom prompt tailoring workflows, dynamic keyword matching density (Python, SQL, React), and instant export capabilities.`,
      tech: ['JavaScript (ES6+)', 'React.js', 'Prompt Workflows', 'PDF Export Engine', 'ATS Scoring Algorithm', 'HTML5 / CSS3']
    },
    'smart-home': {
      title: 'Smart Home Automation System',
      badge: 'IoT Physical Project • District Award Winner',
      desc: `A physical and software-based IoT automation system built with ESP8266 and Arduino microcontrollers. Allows remote appliance toggling, real-time temperature and humidity telemetry via DHT11 sensors, and automated energy optimization logic. Submitted and verified at the Atal Tinkering Lab (ATL Lab). Recognized with a District-Level Certificate for technical and practical excellence.`,
      tech: ['Arduino', 'ESP8266', 'Embedded C', 'Sensors (DHT11)', 'IoT Relays', 'Web Dashboard']
    },
    'ai-interview': {
      title: 'AI Mock Interview Platform',
      badge: 'Web Application • AI Simulation',
      desc: `An interactive web application designed to simulate technical interviews for aspiring Data Analysts, Software Developers, and IoT Engineers. Features dynamic question banks, response timers, voice waveform visualization, text-to-speech voice readouts, and immediate simulated AI feedback.`,
      tech: ['JavaScript (ES6+)', 'SpeechSynthesis API', 'HTML5', 'CSS3', 'REST APIs', 'Web Audio API']
    },
    'wiper-car': {
      title: 'Drop Sensor Smart Wiper Car System',
      badge: 'Automotive Embedded IoT System',
      desc: `An automatic smart wiper system engineered to detect rain droplets through sensitive moisture drop sensors. Utilizes embedded microcontroller logic to trigger multi-speed wiper servo sweeps automatically proportional to rainfall intensity, boosting driver safety.`,
      tech: ['Embedded C', 'Moisture / Rain Drop Sensor', 'Servo Motors', 'Microcontroller', 'PWM Control']
    },
    'data-analytics': {
      title: 'Data Analytics & KPI Insights Suite',
      badge: 'Data Analytics • Reporting & Dashboards',
      desc: `End-to-end data analytics workflow combining Python (NumPy, Pandas, Matplotlib), SQL database queries, and interactive Power BI executive reporting dashboards to uncover business trends, customer churn rates, and operational KPIs.`,
      tech: ['Python', 'SQL', 'Pandas', 'NumPy', 'Power BI', 'Excel', 'Data Annotation']
    }
  };

  const modalOverlay = document.getElementById('project-modal-overlay');
  const modalTitle = document.getElementById('modal-project-title');
  const modalBadge = document.getElementById('modal-project-badge');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalTechWrap = document.getElementById('modal-project-tech');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  document.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project');
      const data = projectDetails[projId];
      if (data && modalOverlay) {
        if (modalTitle) modalTitle.innerText = data.title;
        if (modalBadge) modalBadge.innerText = data.badge;
        if (modalDesc) modalDesc.innerText = data.desc;
        if (modalTechWrap) {
          modalTechWrap.innerHTML = data.tech.map(t => `<span class="tech-chip">${t}</span>`).join('');
        }
        modalOverlay.classList.add('active');
        playFuturisticTone(520, 0.08);
      }
    });
  });

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }
});
