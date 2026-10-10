(function () {
  'use strict';

  var PROTO = 'https://gtm-framework.vercel.app';

  // Camadas da arquitetura (Figura 3) com a ponte até a instanciação (Quadro 20) e o protótipo (Quadro 21).
  var LAYERS = [
    {
      n: '1', name: 'Coleção de Dados e Governança',
      sub: 'Base de dados internos e externos sob glossário comum',
      cap: 'sensing',
      desc: 'Reúne dados de CRM, ERP, data lakes e bases estruturadas das áreas de Marketing, Vendas, Pós-Vendas e Produto, além de sinais externos de mercado. Glossário comum, qualidade e rastreabilidade tornam esses dados comparáveis entre as funções.',
      inst: '1. Coleta de dados',
      module: 'Coleção de Dados',
      screens: ['Informações da empresa', 'Catálogo de GTM', 'Data Lake'],
      route: '/poc/dados'
    },
    {
      n: '2', name: 'Inteligência Competitiva baseada em Dados',
      sub: 'Leitura sistemática de mercado e concorrência',
      cap: 'sensing',
      desc: 'Converte os dados da Camada 1 em análise de mercado e monitoramento da concorrência. Os sinais são normalizados, contextualizados e classificados por confiança e impacto antes de seguir para a análise.',
      inst: '2. Inteligência Competitiva',
      module: 'Inteligência · Sensing',
      screens: ['Mercado', 'Concorrência'],
      route: '/poc/sinais'
    },
    {
      n: '3', name: 'Capacidades Analíticas e IA',
      sub: 'Modelos preditivos e prescritivos que geram recomendações',
      cap: 'seizing',
      desc: 'Aplica modelos preditivos, prescritivos e de linguagem natural para detectar padrões e sinais fracos. Cada recomendação traz score, nível de confiança e a justificativa dos sinais que a sustentam.',
      inst: '3. IA/Analítica',
      module: 'Inteligência · Seizing',
      screens: ['Sugestões da IA', 'GTM Agent'],
      route: '/poc/sinais?sub=decisoes'
    },
    {
      n: '4', name: 'Decisão Estratégica de GTM',
      sub: 'Segmentação, posicionamento, precificação e canais',
      cap: 'seizing',
      desc: 'Transforma recomendações em decisões de GTM, ancoradas em metas, hipóteses e riscos registrados. O painel de KPIs transversais mostra a mesma situação para todas as funções no momento da decisão.',
      inst: '4. Decisão',
      module: 'Overview e Catálogo de GTM',
      screens: ['Metas & KPIs', 'Objetivos & Metas', 'Hipóteses, Riscos & Contexto'],
      route: '/poc'
    },
    {
      n: '5', name: 'Execução Interfuncional',
      sub: 'Ação coordenada entre Marketing, Vendas, Pós-Vendas e Produto',
      cap: 'reconf',
      desc: 'Desdobra a decisão em ações com responsável, prazo e tarefas, distribuídas entre as funções. Na instanciação, esta camada é operada junto com a Decisão, por meio do mesmo painel e dos mesmos indicadores.',
      inst: '4. Decisão (consolidada)',
      module: 'Execuções de GTM · Execução',
      screens: ['Ações Coordenadas'],
      route: '/poc/recomendacoes'
    },
    {
      n: '6', name: 'Feedback, Aprendizado e Recalibração',
      sub: 'KPIs, revisão de hipóteses e retorno à Camada 1',
      cap: 'reconf',
      desc: 'Compara resultados com as metas, revisa as hipóteses que orientaram a decisão e registra o que foi aprendido. Os ajustes redefinem o que a Camada 1 deve coletar no ciclo seguinte.',
      inst: '5. Aprendizado',
      module: 'Execuções de GTM · Integração e Recalibração',
      screens: ['Metas e KPIs', 'Aprendizados', 'Feedbacks'],
      route: '/poc/feedback'
    }
  ];

  var CAP = {
    sensing: { cls: 'cap-sensing', label: 'Sensing' },
    seizing: { cls: 'cap-seizing', label: 'Seizing' },
    reconf: { cls: 'cap-reconf', label: 'Reconfiguring' }
  };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // ---------- arquitetura interativa ----------
  var stack = document.getElementById('layer-stack');
  var detail = document.getElementById('layer-detail');
  if (stack && detail) {
    var buttons = [];
    LAYERS.forEach(function (L, i) {
      var b = el('button', 'layer');
      b.type = 'button';
      b.id = 'layer-btn-' + L.n;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', 'layer-detail');
      var num = el('span', 'num', L.n);
      var txt = el('span');
      txt.appendChild(el('span', 'name', L.name));
      txt.appendChild(el('span', 'sub', L.sub));
      txt.querySelector('.name').style.display = 'block';
      txt.querySelector('.sub').style.display = 'block';
      var c = el('span', 'cap ' + CAP[L.cap].cls, CAP[L.cap].label);
      b.appendChild(num); b.appendChild(txt); b.appendChild(c);
      b.addEventListener('click', function () { select(i); });
      b.addEventListener('keydown', function (ev) {
        if (ev.key === 'ArrowDown' || ev.key === 'ArrowRight') { ev.preventDefault(); select((i + 1) % LAYERS.length, true); }
        if (ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') { ev.preventDefault(); select((i - 1 + LAYERS.length) % LAYERS.length, true); }
      });
      stack.insertBefore(b, stack.querySelector('.loop'));
      buttons.push(b);
    });

    function select(i, focus) {
      var L = LAYERS[i];
      buttons.forEach(function (b, j) {
        b.setAttribute('aria-selected', j === i ? 'true' : 'false');
        b.tabIndex = j === i ? 0 : -1;
      });
      if (focus) buttons[i].focus();
      detail.querySelector('[data-f="label"]').textContent = 'Camada ' + L.n + ' de 6';
      var cap = detail.querySelector('[data-f="cap"]');
      cap.className = 'cap ' + CAP[L.cap].cls; cap.textContent = CAP[L.cap].label;
      detail.querySelector('[data-f="name"]').textContent = L.name;
      detail.querySelector('[data-f="desc"]').textContent = L.desc;
      detail.querySelector('[data-f="inst"]').textContent = L.inst;
      detail.querySelector('[data-f="module"]').textContent = L.module;
      var sc = detail.querySelector('[data-f="screens"]');
      sc.innerHTML = '';
      L.screens.forEach(function (s) { sc.appendChild(el('span', 'screen', s)); });
      var a = detail.querySelector('[data-f="route"]');
      a.href = PROTO + L.route;
      a.textContent = 'gtm-framework.vercel.app' + L.route;
    }
    select(0);
  }

  // ---------- copiar ----------
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.getElementById(btn.getAttribute('data-copy'));
      if (!target) return;
      var text = target.textContent.trim();
      var done = function () {
        var old = btn.textContent;
        btn.textContent = 'Copiado'; btn.classList.add('done');
        setTimeout(function () { btn.textContent = old; btn.classList.remove('done'); }, 1600);
      };
      var fallback = function () {
        var r = document.createRange(); r.selectNodeContents(target);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      };
      try {
        navigator.clipboard.writeText(text).then(done, fallback);
      } catch (e) { fallback(); }
    });
  });

  // ---------- sumário da especificação ----------
  var toc = document.querySelectorAll('.sidebar nav a[href^="#"]');
  if (toc.length && 'IntersectionObserver' in window) {
    var map = {};
    toc.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          toc.forEach(function (a) { a.classList.remove('active'); });
          var a = map[en.target.id]; if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) obs.observe(s); });
  }
  var tg = document.querySelector('.toc-toggle');
  if (tg) {
    tg.addEventListener('click', function () {
      var sb = document.querySelector('.sidebar');
      var open = sb.classList.toggle('open');
      tg.setAttribute('aria-expanded', open ? 'true' : 'false');
      tg.textContent = open ? 'Fechar sumário' : 'Sumário';
    });
    document.querySelectorAll('.sidebar nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        var sb = document.querySelector('.sidebar');
        if (sb.classList.contains('open')) { sb.classList.remove('open'); tg.setAttribute('aria-expanded', 'false'); tg.textContent = 'Sumário'; }
      });
    });
  }
})();

/* ---------- v2: fluxo em 3 etapas ---------- */
(function () {
  'use strict';
  var flow = document.getElementById('flow');
  if (!flow) return;

  // Questionário. Para registrar o consentimento, preencha PREFILL com os campos
  // do link pré-preenchido do Google Forms, por exemplo:
  // { 'entry.111111': 'Concordo em participar', 'entry.222222': 'Concordo em avaliar o Framework' }
  var FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSe-l0vCF2HoHj6uJk7mGG0qdoyNAl2FYrG4ups2S_jRmHgbUw/viewform';
  var PREFILL = {};

  var KEY = 'kitgtm.v2';
  var s = { step: '1', p1: null, spec: false, proto: false, decl: false, p2: null };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved) for (var k in s) if (k in saved) s[k] = saved[k]; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  function $(id) { return document.getElementById(id); }
  var steps = flow.querySelectorAll('.flow-step');
  var marks = document.querySelectorAll('.stepper .st');

  function formUrl(embedded) {
    var q = [];
    if (embedded) q.push('embedded=true');
    q.push('usp=pp_url');
    Object.keys(PREFILL).forEach(function (k) { q.push(encodeURIComponent(k) + '=' + encodeURIComponent(PREFILL[k])); });
    return FORM + '?' + q.join('&');
  }

  function go(step, focus) {
    s.step = String(step); save();
    steps.forEach(function (sec) { sec.hidden = sec.getAttribute('data-step') !== s.step; });
    var n = parseInt(s.step, 10);
    marks.forEach(function (m) {
      var i = parseInt(m.getAttribute('data-st'), 10);
      m.classList.toggle('current', i === n);
      m.classList.toggle('done', !isNaN(n) && i < n);
      if (i === n) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current');
    });
    if (s.step === '3') {
      var f = $('form-iframe');
      if (!f.getAttribute('src')) f.setAttribute('src', formUrl(true));
      $('form-newtab').href = formUrl(false);
    }
    if (focus) {
      window.scrollTo(0, 0);
      var h = flow.querySelector('.flow-step[data-step="' + s.step + '"] [tabindex="-1"]');
      if (h) h.focus({ preventScroll: true });
    }
  }

  // Etapa 1
  var p1yes = $('p1-yes'), p1no = $('p1-no'), p1next = $('p1-next');
  function syncP1() { p1next.disabled = !(p1yes.checked || p1no.checked); }
  [p1yes, p1no].forEach(function (r) { r.addEventListener('change', function () { s.p1 = r.value; save(); syncP1(); }); });
  p1next.addEventListener('click', function () { go(s.p1 === 'yes' ? '2' : 'end', true); });

  // Etapa 2: Especificação na própria página, protótipo em nova aba
  var p2group = $('p2-group'), p2yes = $('p2-yes'), p2no = $('p2-no'), goEval = $('go-eval'), decl = $('decl');
  function syncP2() {
    var stSpec = $('st-spec'), stProto = $('st-proto');
    stSpec.textContent = s.spec ? 'Lida até o fim' : 'Leitura em andamento'; stSpec.classList.toggle('ok', s.spec);
    stProto.textContent = s.proto ? 'Aberto' : 'Não aberto'; stProto.classList.toggle('ok', s.proto);
    var unlocked = s.spec && s.proto;
    decl.disabled = !unlocked;
    if (!unlocked) decl.checked = false;
    s.decl = decl.checked;
    $('decl-label').classList.toggle('locked', !unlocked);
    p2group.disabled = !s.decl;
    if (!s.decl) { p2yes.checked = false; p2no.checked = false; s.p2 = null; }
    $('lock-spec').classList.toggle('done', s.spec);
    $('lock-proto').classList.toggle('done', s.proto);
    $('lock-decl').classList.toggle('done', !!s.decl);
    $('locks').hidden = !!(s.spec && s.proto && s.decl);
    goEval.disabled = !(s.decl && (p2yes.checked || p2no.checked));
    goEval.textContent = p2no.checked ? 'Encerrar participação' : 'Avaliação do Framework GTM Adaptativo';
    save();
  }
  $('open-proto').addEventListener('click', function () { s.proto = true; syncP2(); });
  decl.addEventListener('change', syncP2);
  [p2yes, p2no].forEach(function (r) { r.addEventListener('change', function () { s.p2 = r.value; syncP2(); }); });
  goEval.addEventListener('click', function () { go(s.p2 === 'yes' ? '3' : 'end', true); });

  if ('IntersectionObserver' in window) {
    var end = $('spec-end');
    new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting && !s.spec && s.step === '2') { s.spec = true; syncP2(); } });
    }, { threshold: 0 }).observe(end);
    var tocLinks = document.querySelectorAll('.spec-toc a');
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var secObs = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) { tocLinks.forEach(function (a) { a.classList.remove('active'); }); if (byId[e.target.id]) byId[e.target.id].classList.add('active'); }
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    Object.keys(byId).forEach(function (id) { var el = $(id); if (el) secObs.observe(el); });
  } else { s.spec = true; }

  document.querySelectorAll('[data-goto]').forEach(function (b) {
    b.addEventListener('click', function () { go(b.getAttribute('data-goto'), true); });
  });
  $('restart').addEventListener('click', function () {
    s = { step: '1', p1: null, spec: false, proto: false, decl: false, p2: null }; save();
    [p1yes, p1no, p2yes, p2no, decl].forEach(function (r) { r.checked = false; });
    $('form-iframe').removeAttribute('src');
    syncP1(); syncP2(); go('1', true);
  });

  // restaura o estado salvo
  if (s.p1 === 'yes') p1yes.checked = true; else if (s.p1 === 'no') p1no.checked = true;
  if (s.decl) decl.checked = true;
  if (s.p2 === 'yes') p2yes.checked = true; else if (s.p2 === 'no') p2no.checked = true;
  if (s.step === '3' && s.p2 !== 'yes') s.step = '2';
  if (s.step === '2' && s.p1 !== 'yes') s.step = '1';
  syncP1(); syncP2(); go(s.step, false);
})();
