// TriboTax — partials compartilhados + interações
// Convenção: todas as páginas incluem <header id="tt-nav"></header> e <footer id="tt-footer"></footer>

const NAV_LINKS = [
  { href: 'index.html', label: 'Início' },
  { href: 'manifesto.html', label: 'Manifesto' },
  { href: 'metodo.html', label: 'Método' },
  { href: 'sobre-alex.html', label: 'Alex Amadeu' },
  { href: 'contato.html', label: 'Contato' },
];

function renderNav(activePage) {
  const nav = document.getElementById('tt-nav');
  if (!nav) return;
  nav.innerHTML = `
    <nav class="nav" aria-label="Navegação principal">
      <div class="container nav-inner">
        <div class="nav-left">
          <a href="index.html" class="brand" aria-label="TriboTax — início">
            <span>Tribo<span style="font-style:italic">Tax</span></span>
            <span class="dot" aria-hidden="true"></span>
          </a>
          <div class="nav-links">
            ${NAV_LINKS.map(l => `<a href="${l.href}" class="${l.href===activePage?'active':''}">${l.label}</a>`).join('')}
          </div>
        </div>
        <div class="nav-right">
          <a class="btn btn-ghost" href="contato.html#diagnostico">
            Diagnóstico
            <svg class="arrow" viewBox="0 0 16 10"><path d="M1 5 H14 M10 1 L14 5 L10 9"/></svg>
          </a>
        </div>
      </div>
    </nav>
  `;
}

function renderFooter() {
  const f = document.getElementById('tt-footer');
  if (!f) return;
  f.innerHTML = `
    <footer class="footer on-deep">
      <div class="container">
        <div class="grid grid-4" style="align-items:start">
          <div style="grid-column: span 2">
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
              ${NAV_LINKS.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
            </div>
          </div>
          <div>
            <div class="kicker" style="color:#A7AE9E">Contato</div>
            <div style="margin-top:16px; display:flex; flex-direction:column; gap:10px; font-size:14px">
              <a href="contato.html">contato@tribotax.com.br</a>
              <a href="contato.html">WhatsApp institucional</a>
              <a href="#">LinkedIn</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>
        <div class="rule" style="margin-top: 72px; padding-top: 24px; display:flex; justify-content:space-between; gap:24px; flex-wrap:wrap">
          <span class="small mono">© 2026 TRIBOTAX · ADVOCACIA TRIBUTÁRIA</span>
          <span class="small mono">ALEX AMADEU · OAB/SP 000.000 · CONTEÚDO INFORMATIVO, NÃO CONSTITUI PROMESSA DE RESULTADO</span>
        </div>
      </div>
    </footer>
  `;
}

// Reveal-on-scroll
function setupReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  const active = (location.pathname.split('/').pop() || 'index.html');
  renderNav(active);
  renderFooter();
  setupReveal();
});
