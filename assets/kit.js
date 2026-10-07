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
