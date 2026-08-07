/* TriboTax — camada de tracking nativa (sem GTM).
 *
 * Meta Pixel client-side + CAPI server-side pelo workflow n8n que já recebe os
 * leads do site. A dedup depende de o mesmo event_id aparecer nos dois lados.
 *
 * Config: <ClientFolder>/.tracking.json
 *
 * ATENÇÃO: o nginx serve este arquivo com cache de 1 ano. Ao alterá-lo,
 * incremente o ?v= da tag <script> em TODAS as páginas.
 */
(function () {
  'use strict';

  var PIXEL_ID = '2282684689195982';

  /* ── Meta Pixel base code ──────────────────────────────────────────── */
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  /* ── Cookies ───────────────────────────────────────────────────────── */
  function getCookie(name) {
    var m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? decodeURIComponent(m[2]) : '';
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = name + '=' + encodeURIComponent(value) +
      ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  /* _fbc só existe quando a visita veio de um clique em anúncio (?fbclid=).
     Nunca sintetizar do nada: isso quebra a atribuição. */
  (function captureFbc() {
    try {
      var fbclid = new URLSearchParams(location.search).get('fbclid');
      if (fbclid && !getCookie('_fbc')) {
        setCookie('_fbc', 'fb.1.' + Date.now() + '.' + fbclid, 90);
      }
    } catch (_) {}
  })();

  function uuid() {
    try {
      if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    } catch (_) {}
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16);
    });
  }

  /* ── API pública ───────────────────────────────────────────────────── */

  /* Gera um event_id novo. Chame UMA vez por conversão e reaproveite o mesmo
     valor no Pixel e no payload que vai para o n8n. */
  window.ttNewEventId = uuid;

  /* Sinais de match para o CAPI. Vão crus para o n8n, que hasheia o que for
     PII antes de mandar para a Meta. fbp/fbc nunca são hasheados. */
  window.ttSignals = function () {
    return {
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc'),
      event_source_url: location.href,
      client_user_agent: navigator.userAgent
    };
  };

  /* Dispara um evento padrão no Pixel. Devolve o event_id usado. */
  window.ttTrack = function (name, params, eventId) {
    var id = eventId || uuid();
    try {
      fbq('track', name, params || {}, { eventID: id });
    } catch (_) {}
    return id;
  };

  /* ── ViewContent nas LPs ───────────────────────────────────────────── */
  /* <body data-tt-viewcontent="Nome do conteúdo"> */
  function fireViewContent() {
    var el = document.querySelector('[data-tt-viewcontent]');
    if (!el) return;
    window.ttTrack('ViewContent', {
      content_name: el.getAttribute('data-tt-viewcontent'),
      content_category: 'landing_page'
    });
  }

  /* ── Lead na página de obrigado ────────────────────────────────────── */
  /* As LPs redirecionam para /obrigado carregando o event_id em ?eid=.
     Reusar esse id é o que impede o Lead de ser contado duas vezes. */
  function fireLeadOnThankYou() {
    if (!/\/obrigado/.test(location.pathname)) return;
    var p = new URLSearchParams(location.search);
    window.ttTrack('Lead', {
      content_name: p.get('servico') || 'Diagnóstico',
      content_category: 'lead_site'
    }, p.get('eid') || undefined);
  }

  /* ── Contact em cliques de WhatsApp, e-mail e telefone ─────────────── */
  function bindContactClicks() {
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      var isContact =
        href.indexOf('mailto:') === 0 ||
        href.indexOf('tel:') === 0 ||
        /(^|\/\/)(www\.)?(wa\.me|api\.whatsapp\.com)/i.test(href);
      if (!isContact) return;
      var canal = href.indexOf('mailto:') === 0 ? 'email'
                : href.indexOf('tel:') === 0 ? 'telefone'
                : 'whatsapp';
      window.ttTrack('Contact', {
        content_name: canal,
        content_category: location.pathname
      });
    }, true);
  }

  function boot() {
    fireViewContent();
    fireLeadOnThankYou();
    bindContactClicks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
