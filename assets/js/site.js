// TriboTax — partials compartilhados + interações
// Convenção: todas as páginas incluem <header id="tt-nav"></header> e <footer id="tt-footer"></footer>
// ⚠ Altere TRIBOTAX_WHATSAPP para o número real (código país + DDD + número, ex: 5511999999999)
const TRIBOTAX_WHATSAPP = window.TRIBOTAX_WHATSAPP || '554799975701';

const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/manifesto', label: 'Manifesto' },
  { href: '/metodo', label: 'Método' },
  { label: 'Serviços', children: [
    { href: '/simples-nacional', label: 'Simples Nacional' },
    { href: '/passivo-tributario', label: 'Passivo Tributário' },
    { href: '/reforma-tributaria', label: 'Reforma Tributária' },
    { href: '/monitor-tributario/', label: 'Monitor Tributário' },
    { href: '/reclassificador-fiscal/', label: 'Reclassificador Fiscal' },
  ]},
  { href: '/diagnostico/', label: 'Diagnóstico' },
  { href: '/sobre-alex', label: 'Alex Amadeu' },
  { href: '/contato', label: 'Contato' },
];

function renderNavItem(l, activePage) {
  if (l.children) {
    const isActiveParent = l.children.some(c => c.href === activePage);
    const items = l.children.map(c =>
      `<a href="${c.href}" class="${c.href===activePage?'active':''}">${c.label}</a>`
    ).join('');
    return `
      <div class="nav-dropdown">
        <button type="button" class="nav-dropdown-toggle ${isActiveParent?'active':''}" aria-haspopup="true" aria-expanded="false">
          ${l.label}
          <svg class="nav-chevron" width="10" height="7" viewBox="0 0 12 8"><path d="M1 1.5L6 6L11 1.5" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>
        </button>
        <div class="nav-dropdown-menu" role="menu">${items}</div>
      </div>
    `;
  }
  return `<a href="${l.href}" class="${l.href===activePage?'active':''}">${l.label}</a>`;
}

function renderDrawerItem(l, activePage) {
  if (l.children) {
    const items = l.children.map(c =>
      `<a href="${c.href}" class="drawer-sub ${c.href===activePage?'active':''}">${c.label}</a>`
    ).join('');
    return `<span class="drawer-group-label">${l.label}</span>${items}`;
  }
  return `<a href="${l.href}" class="${l.href===activePage?'active':''}">${l.label}</a>`;
}

function renderNav(activePage) {
  const nav = document.getElementById('tt-nav');
  if (!nav) return;
  const navLinks = NAV_LINKS.map(l => renderNavItem(l, activePage)).join('');
  const drawerLinks = NAV_LINKS.map(l => renderDrawerItem(l, activePage)).join('');
  nav.innerHTML = `
    <nav class="nav" aria-label="Navegação principal">
      <div class="container nav-inner">
        <div class="nav-left">
          <a href="/" class="brand" aria-label="TriboTax — início">
            <span>Tribo<span style="font-style:italic">Tax</span></span>
            <span class="dot" aria-hidden="true"></span>
          </a>
          <div class="nav-links">${navLinks}</div>
        </div>
        <div class="nav-right">
          <a class="btn btn-ghost" href="/contato#diagnostico">
            Diagnóstico
            <svg class="arrow" viewBox="0 0 16 10"><path d="M1 5 H14 M10 1 L14 5 L10 9"/></svg>
          </a>
        </div>
        <button class="nav-hamburger" aria-label="Abrir menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="nav-drawer" aria-hidden="true">
        ${drawerLinks}
        <a class="btn btn-primary nav-drawer-cta" href="/contato#diagnostico">Diagnóstico →</a>
      </div>
    </nav>
  `;
  const navEl = nav.querySelector('.nav');
  const hamburger = nav.querySelector('.nav-hamburger');
  const drawer = nav.querySelector('.nav-drawer');
  hamburger.addEventListener('click', () => {
    const isOpen = navEl.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    drawer.setAttribute('aria-hidden', String(!isOpen));
  });
}

function renderFooter() {
  const f = document.getElementById('tt-footer');
  if (!f) return;
  const topLevel = NAV_LINKS.filter(l => l.href);
  const services = (NAV_LINKS.find(l => l.children) || {}).children || [];
  f.innerHTML = `
    <footer class="footer on-deep">
      <div class="container">
        <div class="grid grid-5" style="align-items:start">
          <div class="footer-brand">
            <div class="brand" style="color:#E7DEC9; font-size:28px">
              <span>Tribo<span style="font-style:italic">Tax</span></span>
              <span class="dot" aria-hidden="true"></span>
            </div>
            <p class="lede" style="margin-top: 20px; max-width: 42ch">
              Consultoria tributária para líderes que não navegam sozinhos. Inteligência coletiva, resiliência fiscal, proteção de legado.
            </p>
          </div>
          <div>
            <div class="kicker" style="color:#A7AE9E">Navegação</div>
            <div style="margin-top:16px; display:flex; flex-direction:column; gap:10px; font-size:14px">
              ${topLevel.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
            </div>
          </div>
          <div>
            <div class="kicker" style="color:#A7AE9E">Serviços</div>
            <div style="margin-top:16px; display:flex; flex-direction:column; gap:10px; font-size:14px">
              ${services.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
            </div>
          </div>
          <div>
            <div class="kicker" style="color:#A7AE9E">Contato</div>
            <div style="margin-top:16px; display:flex; flex-direction:column; gap:10px; font-size:14px">
              <a href="mailto:contato@tribotax.com.br">contato@tribotax.com.br</a>
              <a href="https://wa.me/${TRIBOTAX_WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a>
              <a href="#">LinkedIn</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>
        <div class="rule footer-legal" style="margin-top: 72px; padding-top: 24px">
          <div class="footer-legal-id">
            <span class="small mono">TRIBOTAX INTELIGÊNCIA TRIBUTÁRIA E TECNOLOGIA LTDA</span>
            <span class="small mono">CNPJ 68.391.925/0001-44</span>
            <span class="small mono">Rua Paraíba, 550 · 8º andar, sala 800 · Savassi · <span style="white-space:nowrap">Belo Horizonte/MG</span> · <span style="white-space:nowrap">CEP 30.130-141</span></span>
            <span class="small mono"><a href="/politica-de-privacidade">Política de Privacidade</a> · <a href="/exclusao-de-dados">Exclusão de dados</a></span>
          </div>
          <span class="small mono">© 2026 TRIBOTAX · ADVOCACIA TRIBUTÁRIA</span>
        </div>
      </div>
    </footer>
  `;
}

// Reveal-on-scroll with optional stagger delay via data-delay attr
function setupReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.delay || 0;
        if (delay) e.target.style.transitionDelay = delay + 'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// Nav scroll state: transparent at top → clay when scrolled
function setupNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// Stat counter: animates .count-up[data-count] when entering viewport
function setupCountUp() {
  const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const isFloat = String(target).includes('.');
      const duration = 900;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const val = target * ease(p);
        el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.count-up[data-count]').forEach(el => io.observe(el));
}

// Parallax on hero background symbols (passive scroll, transform only)
function setupParallax() {
  const els = document.querySelectorAll('.hero-bg-symbol, .hero-bg-year');
  if (!els.length) return;
  const update = () => {
    const y = window.scrollY;
    els.forEach(el => { el.style.transform = `translateY(${y * 0.28}px)`; });
  };
  window.addEventListener('scroll', update, { passive: true });
}

// Hero logo morph: fades out as user scrolls through home hero
function setupLogoMorph() {
  const logo = document.getElementById('hero-logo-morph');
  if (!logo) return;
  const hero = document.querySelector('.hero');
  const update = () => {
    const heroH = hero ? hero.offsetHeight : 600;
    const p = Math.min(1, window.scrollY / (heroH * 0.5));
    logo.style.opacity = Math.max(0, 1 - p * 1.6);
    logo.style.transform = `translateY(${-p * 28}px) scale(${1 - p * 0.06})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  const active = location.pathname.replace(/\/$/, '') || '/';
  renderNav(active);
  renderFooter();
  setupReveal();
  setupNavScroll();
  setupCountUp();
  setupParallax();
  setupLogoMorph();
});
