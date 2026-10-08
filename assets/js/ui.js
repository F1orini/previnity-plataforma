(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const money = (n, dec = 2) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: dec, maximumFractionDigits: dec });
  const num = n => n.toLocaleString('pt-BR');
  const compact = n => {
    if (n >= 1e9) return (n / 1e9).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' bi';
    if (n >= 1e6) return (n / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mi';
    if (n >= 1e3) return (n / 1e3).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mil';
    return String(n);
  };
  const initials = name => name.replace(/(ME|Ltda)$/, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

  const icons = () => window.lucide && lucide.createIcons();

  function toast(msg, icon = 'check') {
    let box = $('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; document.body.appendChild(box); }
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span class="ico-box"><i data-lucide="${icon}"></i></span><span>${msg}</span>`;
    box.appendChild(t);
    icons();
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 3200);
  }

  let overlay;
  function ensureOverlay() {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.addEventListener('click', closeAll);
      document.body.appendChild(overlay);
    }
    return overlay;
  }
  function closeAll() {
    $$('.modal.open, .drawer.open').forEach(el => { el.classList.remove('open'); setTimeout(() => el.remove(), 300); });
    overlay && overlay.classList.remove('open');
  }
  function openLayer(cls, html) {
    closeAll();
    ensureOverlay();
    const el = document.createElement('div');
    el.className = cls;
    el.innerHTML = html;
    document.body.appendChild(el);
    icons();
    requestAnimationFrame(() => { el.classList.add('open'); overlay.classList.add('open'); });
    el.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeAll(); });
    return el;
  }
  const modal = (html, size = '') => openLayer('modal ' + size, html);
  const drawer = html => openLayer('drawer', html);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  const closeBtn = `<button class="btn btn-ghost btn-icon btn-sm" data-close aria-label="Fechar"><i data-lucide="x"></i></button>`;

  // Ações declarativas reutilizáveis em qualquer tela.
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-toast]');
    if (t) { e.preventDefault(); toast(t.dataset.toast, t.dataset.icon || 'check'); if (t.hasAttribute('data-close-after')) closeAll(); }
    const chip = e.target.closest('.chip-group[data-single] .chip');
    if (chip) { $$('.chip', chip.parentElement).forEach(c => c.classList.toggle('active', c === chip)); }
    const chipMulti = e.target.closest('.chip-group[data-multi] .chip');
    if (chipMulti) chipMulti.classList.toggle('active');
    const tab = e.target.closest('[data-tabs] .tab');
    if (tab) {
      const group = tab.closest('[data-tabs]');
      $$('.tab', group).forEach(x => x.classList.toggle('active', x === tab));
      const target = group.dataset.tabs;
      if (target) $$(`[data-pane="${target}"]`).forEach(p => p.classList.toggle('hide', p.dataset.name !== tab.dataset.name));
    }
    const opt = e.target.closest('[data-options] .option-card');
    if (opt) $$('.option-card', opt.closest('[data-options]')).forEach(o => o.classList.toggle('selected', o === opt));
  });

  // Gráficos com a paleta da marca.
  const charts = [];
  const palette = { blue: '#0563ff', green: '#00e5a0', navy: '#07122b', violet: '#7c5cff', warn: '#f59e0b', danger: '#ef4444', gray: '#d4dae5', blueSoft: 'rgba(5,99,255,.12)', greenSoft: 'rgba(0,229,160,.18)' };
  function chart(canvas, config) {
    if (!window.Chart || !canvas) return;
    Chart.defaults.font.family = 'Jakarta, system-ui, sans-serif';
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#687285';
    Chart.defaults.plugins.legend.display = false;
    Chart.defaults.plugins.tooltip.backgroundColor = '#07122b';
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 10;
    Chart.defaults.plugins.tooltip.titleFont = { weight: 700 };
    Chart.defaults.maintainAspectRatio = false;
    const c = new Chart(canvas, config);
    charts.push(c);
    return c;
  }
  const destroyCharts = () => { while (charts.length) charts.pop().destroy(); };
  const gridScales = (opts = {}) => ({
    x: { grid: { display: false }, border: { display: false }, ...opts.x },
    y: { grid: { color: '#eef1f6' }, border: { display: false }, ticks: { padding: 8, ...(opts.yTicks || {}) }, ...opts.y },
  });
  const gradient = (canvas, color) => {
    const ctx = canvas.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, canvas.parentElement.clientHeight || 280);
    g.addColorStop(0, color.replace('1)', '.28)'));
    g.addColorStop(1, color.replace('1)', '0)'));
    return g;
  };

  const statusBadge = s => {
    const map = {
      'Incluído': 'blue', 'Concluído': 'green', 'Pago': 'green', 'Ativa': 'green', 'Ativo': 'green', 'Lido': 'green', 'Entregue': 'green', 'Aberto': 'green', 'Postada': 'blue', 'Em dia': 'blue',
      'Excluído': '', 'Encerrada': '', 'Inativo': '',
      'Pendente': 'warn', 'Validando': 'warn', 'Aguardando pagamento': 'warn', 'Agendada': 'violet', 'Processando': 'violet', 'Em processamento': 'violet',
      'Rejeitado': 'danger', 'Quebrado': 'danger', 'Não entregue': 'danger', 'Bounce': 'danger',
    };
    const c = map[s] ?? '';
    return `<span class="badge ${c ? 'badge-' + c : ''}">${s}</span>`;
  };

  const channelIcon = c => ({ WhatsApp: 'message-circle', 'E-mail': 'mail', Carta: 'mail-open', SMS: 'smartphone', Push: 'bell-ring', Portal: 'globe', 'Portal web': 'globe', 'App CPFL': 'smartphone' }[c] || 'send');

  window.UI = { $, $$, money, num, compact, initials, icons, toast, modal, drawer, closeAll, closeBtn, chart, destroyCharts, palette, gridScales, gradient, statusBadge, channelIcon };
})();
