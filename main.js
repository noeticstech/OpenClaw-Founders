// ============================================
// OpenClaw — Main JavaScript
// ============================================

'use strict';

// ── Progress Bar ──────────────────────────────
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / scrollable) * 100;
  progressBar.style.width = scrolled + '%';
}, { passive: true });

// ── Sticky Nav ────────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Hamburger Menu ───────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ── Scroll Reveal ─────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

function initReveal() {
  // Add reveal to key sections
  const selectors = [
    '.value-card', '.skill-card', '.arch-step',
    '.pitfall-card', '.compat-item', '.usecase-full-card',
    '.qstep', '.faq-item', '.uc-feature-card', '.step-card'
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (i % 3 === 1) el.classList.add('reveal-delay-1');
      if (i % 3 === 2) el.classList.add('reveal-delay-2');
      revealObserver.observe(el);
    });
  });
}

// ── Use Case Tabs ─────────────────────────────
function initTabs() {
  const tabContainer = document.getElementById('usecase-tabs');
  if (!tabContainer) return;
  const buttons = tabContainer.querySelectorAll('.tab-btn');
  const panels = tabContainer.querySelectorAll('.tab-panel');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      buttons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPanel = document.getElementById('panel-' + target);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

// ── FAQ Accordion ─────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      // Open clicked (unless it was already open)
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ── OS Tabs (Setup page) ──────────────────────
function initOSTabs() {
  document.querySelectorAll('.os-tabs').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll('.os-tab');
    const parent = tabGroup.closest('.os-switcher');
    if (!parent) return;
    const contents = parent.querySelectorAll('.os-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        if (tab.classList.contains('active')) return;
        const target = tab.dataset.os;
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const content = parent.querySelector(`.os-content[data-os="${target}"]`);
        if (content) content.classList.add('active');
      });
    });
  });
}

// ── Sidebar Active Link (Setup/Docs pages) ────
function initSidebarNav() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link[href^="#"]');
  if (!sidebarLinks.length) return;

  const sections = [];
  sidebarLinks.forEach(link => {
    const id = link.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) sections.push({ link, el });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sections.forEach(s => s.link.classList.remove('active'));
        const active = sections.find(s => s.el === entry.target);
        if (active) active.link.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s.el));
}

// ── Terminal Typing Effect ─────────────────────
function initTypingEffect() {
  const el = document.getElementById('typed-cmd');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  let i = 0;
  const cursor = document.querySelector('.term-cursor');

  const type = () => {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, 45 + Math.random() * 30);
    } else {
      // Show output after typing
      const output = document.querySelector('.terminal-output');
      if (output) {
        output.style.opacity = '0';
        output.style.display = 'flex';
        setTimeout(() => {
          output.style.transition = 'opacity 0.4s ease';
          output.style.opacity = '1';
        }, 200);
        const lines = output.querySelectorAll('.term-out');
        lines.forEach((line, idx) => {
          line.style.opacity = '0';
          setTimeout(() => {
            line.style.transition = 'opacity 0.3s ease';
            line.style.opacity = '1';
          }, 400 + idx * 200);
        });
      }
    }
  };

  // Start typing after animation delay
  setTimeout(type, 1200);
}

// ── Smooth Anchor Scrolling ───────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── Copy Code Blocks ──────────────────────────
function initCodeCopy() {
  document.querySelectorAll('.code-block, .terminal-window').forEach(block => {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);

    const btn = document.createElement('button');
    btn.textContent = 'Copy';
    btn.style.cssText = `
      position: absolute; top: 10px; right: 10px;
      font-size: 11px; font-weight: 600; padding: 3px 8px;
      background: rgba(99,102,241,0.15); color: #818cf8;
      border: 1px solid rgba(99,102,241,0.25); border-radius: 4px;
      cursor: pointer; font-family: inherit; transition: all 0.15s;
    `;
    btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(99,102,241,0.25)');
    btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(99,102,241,0.15)');
    btn.addEventListener('click', () => {
      const text = block.textContent.replace(/Copy/g, '').trim();
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✓ Copied';
        setTimeout(() => btn.textContent = 'Copy', 2000);
      });
    });
    wrapper.appendChild(btn);
  });
}

// ── Init All ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initTabs();
  initFAQ();
  initOSTabs();
  initSidebarNav();
  initTypingEffect();
  initSmoothScroll();
  setTimeout(initCodeCopy, 100);
});
