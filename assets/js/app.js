(function () {
  const { $, $$, icons, destroyCharts, modal, closeBtn, closeAll, statusBadge, money } = UI;
  const view = $('#view');
  const app = $('#app');

  function render() {
    const route = (location.hash.replace('#/', '') || 'dashboard').split('?')[0];
    const v = VIEWS[route] || VIEWS.dashboard;
    destroyCharts();
    view.innerHTML = v.render();
    document.title = `${v.title} · Previnity CPFL`;
    $$('#nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#/' + route));
    app.classList.remove('nav-open');
    icons();
    v.mount && v.mount(view);
    window.scrollTo({ top: 0 });
  }
  window.addEventListener('hashchange', render);
  render();

  $('#menu-toggle').addEventListener('click', () => app.classList.toggle('nav-open'));
  $('#nav-overlay').addEventListener('click', () => app.classList.remove('nav-open'));

  const dropdowns = [['#notif-btn', '#notif-dd'], ['#user-btn', '#user-dd']];
  dropdowns.forEach(([btn, dd]) => $(btn).addEventListener('click', e => {
    e.stopPropagation();
    dropdowns.forEach(([, other]) => other !== dd && $(other).classList.remove('open'));
    $(dd).classList.toggle('open');
  }));
  document.addEventListener('click', e => { if (!e.target.closest('.dropdown')) $$('.dropdown').forEach(d => d.classList.remove('open')); });

  $('#dist-filter').addEventListener('change', e => UI.toast(`Visão filtrada: ${e.target.value}`, 'filter'));

  function openSearch(q = '') {
    const results = DB.clientes.slice(0, 5);
    const el = modal(`
      <div class="modal-body" style="padding-bottom:8px">
        <div class="input-icon"><i data-lucide="search"></i><input class="input" id="gs-input" style="height:50px;font-size:15px" placeholder="Buscar CPF/CNPJ, UC, lote, acordo..." value="${q}"></div>
        <div class="small muted mt-2" style="font-weight:600;text-transform:uppercase;letter-spacing:.06em">Resultados</div>
        <div class="list" id="gs-results">
          ${results.map(c => `
            <a class="list-item" href="#/negativacoes" data-close style="color:inherit">
              <span class="avatar ${c.pj ? 'violet' : ''}">${UI.initials(c.nome)}</span>
              <div class="grow"><strong>${c.nome}</strong><span class="sub">${c.doc} · UC ${c.uc} · ${c.dist}</span></div>
              ${statusBadge(c.status)}<span class="strong">${money(c.valor)}</span>
            </a>`).join('')}
        </div>
      </div>
      <div class="modal-foot" style="justify-content:space-between"><span class="small muted">Busca em negativações, acordos, lotes e comunicações</span>${closeBtn}</div>`);
    const input = $('#gs-input', el);
    input.focus();
    input.addEventListener('input', () => {
      const t = input.value.toLowerCase();
      $$('#gs-results .list-item', el).forEach(i => i.classList.toggle('hide', t && !i.textContent.toLowerCase().includes(t)));
    });
  }
  $('#global-search').addEventListener('focus', e => { e.target.blur(); openSearch(); });
  document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); } });
  window.openSearch = openSearch;
  window.closeAll = closeAll;
})();
