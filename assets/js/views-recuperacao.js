(function () {
  const { $, $$, money, num, compact, chart, palette, gridScales, gradient, statusBadge, channelIcon, modal, drawer, closeBtn, toast } = UI;
  const { pageHead, kpi, userCell } = H;

  /* ============================ NEGOCIAÇÕES ============================ */
  function acordoDrawer(a) {
    const parc = a.negociado / a.parcelas;
    drawer(`
      <div class="drawer-head"><div><span class="badge badge-blue no-dot">${a.id}</span><h3 class="mt-1" style="font-size:17px">${a.cliente}</h3><p class="small muted">${a.doc} · ${a.dist}</p></div>${closeBtn}</div>
      <div class="drawer-body">
        <div class="card card-pad" style="background:linear-gradient(135deg,var(--blue),var(--blue-700));color:#dbe7ff;border:0">
          <div class="row-between"><span class="small">Valor negociado</span>${statusBadge(a.status)}</div>
          <div style="font-size:30px;font-weight:800;color:#fff;letter-spacing:-.03em">${money(a.negociado)}</div>
          <div class="small">Original ${money(a.original)} · <b style="color:var(--green)">${Math.round(a.desconto * 100)}% de desconto</b></div>
        </div>
        <div class="dl mt-3">
          <div><span>Formalizado em</span><strong>${a.data}</strong></div>
          <div><span>Canal</span><strong>${a.canal}</strong></div>
          <div><span>Meio de pagamento</span><strong>${a.meio}</strong></div>
          <div><span>Parcelamento</span><strong>${a.parcelas === 1 ? 'À vista' : a.parcelas + 'x de ' + money(parc)}</strong></div>
          <div><span>Campanha</span><strong>${a.campanha}</strong></div>
          <div><span>Idade da fatura</span><strong>${a.faixa}</strong></div>
        </div>
        <h4 class="mt-4" style="font-size:14px">Parcelas</h4>
        <div class="table-wrap mt-1"><table class="table" style="min-width:0">
          <thead><tr><th>#</th><th>Vencimento</th><th class="num">Valor</th><th>Status</th></tr></thead>
          <tbody>${Array.from({ length: Math.min(a.parcelas, 6) }, (_, i) => `<tr><td>${i + 1}</td><td>${String(10 + i).padStart(2, '0')}/${i ? String(10 + i).padStart(2, '0') : '10'}/2026</td><td class="num">${money(parc)}</td><td>${statusBadge(i === 0 && a.status !== 'Aguardando pagamento' ? 'Pago' : a.status === 'Quebrado' && i === 1 ? 'Quebrado' : 'Pendente')}</td></tr>`).join('')}</tbody>
        </table></div>
        <h4 class="mt-4" style="font-size:14px">Registro da formalização</h4>
        <div class="timeline mt-2">
          <div class="tl-item ok"><span class="tl-dot"><i data-lucide="check"></i></span><strong>Aceite eletrônico</strong><span class="sub">${a.data} 14:22 · IP 189.***.***.12 · hash do termo registrado</span></div>
          <div class="tl-item ok"><span class="tl-dot"><i data-lucide="check"></i></span><strong>${a.meio} gerado</strong><span class="sub">Integração bancária · identificação automática</span></div>
          <div class="tl-item ${a.status === 'Pago' ? 'ok' : 'pending'}"><span class="tl-dot"><i data-lucide="${a.status === 'Pago' ? 'check' : 'clock'}"></i></span><strong>Conciliação e baixa no SAP CCS</strong><span class="sub">${a.status === 'Pago' ? 'Concluída · exclusão enviada ao bureau' : 'Aguardando pagamento'}</span></div>
        </div>
      </div>
      <div class="drawer-foot">
        <button class="btn btn-outline" data-toast="Segunda via enviada por WhatsApp" data-icon="send"><i data-lucide="send"></i>Reenviar boleto/Pix</button>
        <button class="btn btn-primary" data-toast="Termo de acordo baixado" data-icon="file-down"><i data-lucide="file-text"></i>Termo</button>
      </div>`);
  }

  VIEWS.negociacoes = {
    title: 'Negociações e acordos',
    render: () => `
      ${pageHead('Recuperação', 'Negociações e acordos', 'Ambiente digital de negociação PF/PJ com as ofertas e condições autorizadas pela CPFL',
        `<a class="btn btn-outline" href="negociar" target="_blank"><i data-lucide="external-link"></i>Ver portal do consumidor</a><button class="btn btn-primary" id="btn-politica"><i data-lucide="sliders-horizontal"></i>Política de ofertas</button>`)}
      <div class="grid g-4">
        ${kpi({ hero: true, icon: 'landmark', label: 'Carteira disponível para negociação', value: 'R$ 300 mi', foot: '<span style="color:#c5d8ff">~1.000.000 de clientes · referência mensal</span>' })}
        ${kpi({ icon: 'handshake', color: 'green', label: 'Acordos no mês', value: '38.410', trend: '+12,4%', foot: '71% à vista · 29% parcelados' })}
        ${kpi({ icon: 'badge-dollar-sign', label: 'Valor recuperado', value: 'R$ 24,6 mi', trend: '+18,2%', foot: 'Pago e conciliado' })}
        ${kpi({ icon: 'percent', color: 'violet', label: 'Conversão (acesso → acordo)', value: '23,8%', trend: '+1,9pp', foot: 'Quebra de acordos: 4,1%' })}
      </div>

      <div class="grid g-main mt-3">
        <div class="card">
          <div class="card-head"><div><h3>Funil de negociação digital</h3><p>Consumidores impactados até o pagamento confirmado · 30 dias</p></div></div>
          <div class="card-body"><div class="chart-box"><canvas id="ch-funil"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-head"><div><h3>Meios de pagamento</h3><p>Participação nos acordos</p></div></div>
          <div class="card-body">
            <div class="chart-box sm"><canvas id="ch-meios"></canvas></div>
            <div class="legend mt-2" style="justify-content:center"><span><i style="background:${palette.green}"></i>Pix 58%</span><span><i style="background:${palette.blue}"></i>Boleto 31%</span><span><i style="background:${palette.violet}"></i>Cartão 11%</span></div>
          </div>
        </div>
      </div>

      <div class="card mt-3">
        <div class="card-head"><div><h3>Acordos formalizados</h3><p>Registro da operação, aceite eletrônico e conciliação</p></div>
          <button class="btn btn-sm btn-outline" data-toast="Relatório de acordos exportado (.xlsx)" data-icon="file-down"><i data-lucide="download"></i>Exportar</button></div>
        <div class="toolbar">
          <div class="input-icon"><i data-lucide="search"></i><input class="input" placeholder="Buscar acordo, consumidor ou documento" data-filter="#tb-ac"></div>
          <select class="select"><option>Todos os status</option><option>Pago</option><option>Em dia</option><option>Aguardando pagamento</option><option>Quebrado</option></select>
          <select class="select"><option>Todos os canais</option><option>Portal web</option><option>WhatsApp</option><option>App CPFL</option></select>
        </div>
        <div class="table-wrap"><table class="table" id="tb-ac">
          <thead><tr><th>Acordo</th><th>Consumidor</th><th class="num">Original</th><th class="num">Negociado</th><th>Condição</th><th>Pagamento</th><th>Status</th><th></th></tr></thead>
          <tbody>${DB.acordos.map(a => `
            <tr class="clickable" data-ac="${a.id}">
              <td><strong class="strong mono">${a.id}</strong><div class="small muted">${a.data} · ${a.canal}</div></td>
              <td>${userCell(a.cliente, a.dist, a.pj)}</td>
              <td class="num muted" style="text-decoration:line-through">${money(a.original)}</td>
              <td class="num strong">${money(a.negociado)}</td>
              <td><span class="badge badge-green no-dot">-${Math.round(a.desconto * 100)}%</span> <span class="small">${a.parcelas === 1 ? 'À vista' : a.parcelas + 'x'}</span></td>
              <td><div class="row" style="gap:6px"><i data-lucide="${a.meio === 'Pix' ? 'qr-code' : a.meio === 'Boleto' ? 'barcode' : 'credit-card'}" style="width:16px;height:16px;color:var(--muted)"></i>${a.meio}</div></td>
              <td>${statusBadge(a.status)}</td>
              <td><button class="btn btn-ghost btn-icon btn-sm"><i data-lucide="chevron-right"></i></button></td>
            </tr>`).join('')}</tbody>
        </table></div>
      </div>`,
    mount(el) {
      bindFilters(el);
      el.addEventListener('click', e => { const r = e.target.closest('tr[data-ac]'); if (r) acordoDrawer(DB.acordos.find(a => a.id === r.dataset.ac)); });
      chart($('#ch-funil'), {
        type: 'bar',
        data: { labels: ['Impactados', 'Acessos ao portal', 'Simulações', 'Acordos formalizados', 'Pagos'], datasets: [{ data: [1_284_000, 161_400, 98_200, 38_410, 34_890], backgroundColor: [palette.navy, '#13306e', palette.blue, '#2fd8a0', palette.green], borderRadius: 8, barThickness: 34 }] },
        options: { indexAxis: 'y', scales: { x: { grid: { color: '#eef1f6' }, border: { display: false }, ticks: { callback: v => compact(v) } }, y: { grid: { display: false }, border: { display: false } } }, plugins: { tooltip: { callbacks: { label: c => ' ' + num(c.raw) } } } },
      });
      chart($('#ch-meios'), { type: 'doughnut', data: { labels: ['Pix', 'Boleto', 'Cartão'], datasets: [{ data: [58, 31, 11], backgroundColor: [palette.green, palette.blue, palette.violet], borderWidth: 0, spacing: 3, borderRadius: 6 }] }, options: { cutout: '70%' } });
      $('#btn-politica').addEventListener('click', () => modal(`
        <div class="modal-head"><div><h3>Política de ofertas</h3><p>Condições autorizadas pela CPFL por idade da fatura</p></div>${closeBtn}</div>
        <div class="modal-body">
          <div class="table-wrap"><table class="table" style="min-width:560px">
            <thead><tr><th>Idade da fatura</th><th>Desc. juros/multa</th><th>Entrada mínima</th><th>Parcelas máx.</th><th>Ativa</th></tr></thead>
            <tbody>${[['31–90 dias', 50, 20, 3], ['91–180 dias', 70, 15, 6], ['181–360 dias', 85, 10, 10], ['1–2 anos', 90, 10, 12], ['> 2 anos', 95, 5, 12]].map(([f, d, e, p]) => `
              <tr><td class="strong">${f}</td><td><input class="input" style="height:34px;width:90px" value="${d}%"></td><td><input class="input" style="height:34px;width:90px" value="${e}%"></td><td><input class="input" style="height:34px;width:80px" value="${p}x"></td><td><label class="switch"><input type="checkbox" checked><span></span></label></td></tr>`).join('')}</tbody>
          </table></div>
          <p class="small muted mt-2">Alterações exigem aprovação do gestor CPFL e passam a valer em todos os canais digitais em até 15 minutos.</p>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" data-close>Cancelar</button><button class="btn btn-primary" data-toast="Política enviada para aprovação" data-close-after>Salvar e enviar para aprovação</button></div>`, 'lg'));
    },
  };

  /* ============================ CAMPANHAS ============================ */
  const campCard = c => `
    <div class="card" style="display:flex;flex-direction:column">
      <div class="card-body" style="flex:1">
        <div class="row-between"><span class="badge ${c.tipo === 'Feirão de quitação' ? 'badge-dark no-dot' : 'badge-blue no-dot'}">${c.tipo}</span>${statusBadge(c.status)}</div>
        <h3 class="mt-2" style="font-size:16px">${c.nome}</h3>
        <p class="small muted mt-1">${c.inicio} → ${c.fim} · ${c.dist}</p>
        <div class="row mt-2" style="gap:6px">${c.canais.map(ch => `<span class="badge no-dot" title="${ch}"><i data-lucide="${channelIcon(ch)}" style="width:13px;height:13px"></i>${ch}</span>`).join('')}</div>
        <div class="grid g-3 mt-3" style="gap:10px">
          <div><span class="small muted">Público</span><div class="strong">${compact(c.publico)}</div></div>
          <div><span class="small muted">Acordos</span><div class="strong">${c.acordos ? num(c.acordos) : '—'}</div></div>
          <div><span class="small muted">Recuperado</span><div class="strong">${c.recuperado ? 'R$ ' + compact(c.recuperado) : '—'}</div></div>
        </div>
        ${c.conversao ? `<div class="row mt-2"><div class="progress green thin" style="flex:1"><span style="width:${Math.min(c.conversao * 3, 100)}%"></span></div><span class="small strong">${c.conversao.toLocaleString('pt-BR')}% conv.</span></div>` : ''}
      </div>
      <div class="card-foot">
        <span class="small">${c.desconto}</span>
        <div class="row" style="gap:6px">
          ${c.status === 'Ativa' ? `<button class="btn btn-ghost btn-icon btn-sm" title="Pausar" data-toast="Campanha ${c.id} pausada" data-icon="pause"><i data-lucide="pause"></i></button>` : ''}
          <button class="btn btn-ghost btn-icon btn-sm" title="Duplicar" data-toast="Campanha duplicada como rascunho" data-icon="copy"><i data-lucide="copy"></i></button>
          <button class="btn btn-outline btn-sm" data-camp="${c.id}">Detalhes</button>
        </div>
      </div>
    </div>`;

  function campDrawer(c) {
    drawer(`
      <div class="drawer-head"><div><span class="badge badge-blue no-dot">${c.id}</span><h3 class="mt-1" style="font-size:17px">${c.nome}</h3><p class="small muted">${c.inicio} → ${c.fim}</p></div>${closeBtn}</div>
      <div class="drawer-body">
        <div class="grid g-2" style="gap:10px">
          <div class="card card-pad" style="padding:14px"><span class="small muted">Impactados</span><div class="strong" style="font-size:20px">${num(c.publico)}</div></div>
          <div class="card card-pad" style="padding:14px"><span class="small muted">Recuperado</span><div class="strong text-green" style="font-size:20px">${money(c.recuperado, 0)}</div></div>
        </div>
        <h4 class="mt-3" style="font-size:14px">Desempenho por canal</h4>
        <div class="chart-box sm mt-1"><canvas id="ch-camp"></canvas></div>
        <h4 class="mt-3" style="font-size:14px">Indicadores</h4>
        <div class="list">
          ${[['Entregabilidade média', '93,1%'], ['Acessos gerados', num(Math.round(c.publico * .18))], ['Negociações iniciadas', num(Math.round(c.publico * .11))], ['Acordos formalizados', num(c.acordos)], ['Taxa de conversão', c.conversao.toLocaleString('pt-BR') + '%']].map(([k, v]) => `<div class="list-item" style="padding:10px 0"><div class="grow">${k}</div><span class="strong">${v}</span></div>`).join('')}
        </div>
      </div>
      <div class="drawer-foot"><button class="btn btn-outline" data-toast="Relatório da campanha exportado" data-icon="file-down"><i data-lucide="download"></i>Relatório</button><a class="btn btn-primary" href="#/campanha-nova" data-close><i data-lucide="pencil"></i>Editar</a></div>`);
    chart($('#ch-camp'), { type: 'bar', data: { labels: c.canais, datasets: [{ label: 'Acordos', data: c.canais.map((_, i) => Math.round((c.acordos || 1000) * [0.52, 0.22, 0.16, 0.06, 0.04][i])), backgroundColor: [palette.blue, palette.green, palette.violet, palette.warn, palette.navy], borderRadius: 8, barThickness: 28 }] }, options: { scales: gridScales() } });
  }

  VIEWS.campanhas = {
    title: 'Campanhas e feirões',
    render: () => `
      ${pageHead('Recuperação', 'Campanhas e feirões de quitação', 'Ações preventivas, promocionais e de estímulo à negociação, com mensuração por canal',
        `<button class="btn btn-outline" data-toast="Calendário de campanhas aberto" data-icon="calendar"><i data-lucide="calendar-days"></i>Calendário</button><a class="btn btn-primary" href="#/campanha-nova"><i data-lucide="plus"></i>Nova campanha</a>`)}

      <div class="banner" style="padding:26px 28px">
        <div style="flex:1;min-width:260px">
          <span class="badge no-dot" style="background:rgba(0,229,160,.15);color:var(--green)"><span class="pulse" style="width:6px;height:6px"></span>&nbsp;Ao vivo</span>
          <h3 class="mt-2" style="font-size:22px">Feirão Limpa Nome CPFL · Outubro</h3>
          <p class="mt-1">Até 90% de desconto em juros e multa · 248 mil consumidores impactados · WhatsApp, SMS, e-mail e push</p>
          <div class="row mt-3 wrap" style="gap:28px">
            <div><div class="small">Recuperado</div><div style="font-size:24px;font-weight:800;color:#fff">R$ 7,84 mi</div></div>
            <div><div class="small">Acordos</div><div style="font-size:24px;font-weight:800;color:#fff">18.942</div></div>
            <div><div class="small">Conversão</div><div style="font-size:24px;font-weight:800;color:var(--green)">7,6%</div></div>
          </div>
        </div>
        <div style="text-align:center">
          <div class="small">Encerra em</div>
          <div class="row mt-1" style="gap:8px" id="countdown">
            ${['23', '14', '32', '10'].map((v, i) => `<div style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:10px 12px;min-width:58px"><div style="font-size:22px;font-weight:800;color:#fff" data-cd="${i}">${v}</div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em">${['dias', 'horas', 'min', 'seg'][i]}</div></div>`).join('')}
          </div>
          <button class="btn btn-accent mt-2" data-camp="CMP-0142">Ver desempenho</button>
        </div>
      </div>

      <div class="grid g-4 mt-3">
        ${kpi({ icon: 'megaphone', label: 'Campanhas ativas', value: '3', foot: '1 agendada · 2 encerradas no trimestre' })}
        ${kpi({ icon: 'users', color: 'violet', label: 'Consumidores impactados', value: '722 mil', trend: '+21%' })}
        ${kpi({ icon: 'mouse-pointer-click', label: 'Acessos gerados', value: '131 mil', trend: '+9,8%' })}
        ${kpi({ icon: 'badge-dollar-sign', color: 'green', label: 'Recuperado via campanhas', value: 'R$ 22,1 mi', trend: '+26%' })}
      </div>

      <div class="row-between mt-4 wrap">
        <div class="tabs" data-tabs id="camp-tabs"><button class="tab active" data-s="">Todas</button><button class="tab" data-s="Ativa">Ativas</button><button class="tab" data-s="Agendada">Agendadas</button><button class="tab" data-s="Encerrada">Encerradas</button></div>
        <div class="input-icon" style="width:280px;max-width:100%"><i data-lucide="search"></i><input class="input" placeholder="Buscar campanha" id="camp-search"></div>
      </div>
      <div class="grid g-3 mt-2" id="camp-grid">${DB.campanhas.map(c => `<div data-st="${c.status}">${campCard(c)}</div>`).join('')}</div>`,
    mount(el) {
      el.addEventListener('click', e => {
        const b = e.target.closest('[data-camp]');
        if (b) campDrawer(DB.campanhas.find(c => c.id === b.dataset.camp));
        const t = e.target.closest('#camp-tabs .tab');
        if (t) $$('#camp-grid > div').forEach(d => d.classList.toggle('hide', t.dataset.s && d.dataset.st !== t.dataset.s));
      });
      $('#camp-search').addEventListener('input', e => $$('#camp-grid > div').forEach(d => d.classList.toggle('hide', !d.textContent.toLowerCase().includes(e.target.value.toLowerCase()))));
      let secs = 23 * 86400 + 14 * 3600 + 32 * 60 + 10;
      const tick = setInterval(() => {
        if (!document.getElementById('countdown')) return clearInterval(tick);
        secs--;
        const v = [Math.floor(secs / 86400), Math.floor(secs % 86400 / 3600), Math.floor(secs % 3600 / 60), secs % 60];
        v.forEach((n, i) => { $(`[data-cd="${i}"]`).textContent = String(n).padStart(2, '0'); });
      }, 1000);
    },
  };

  /* ============================ NOVA CAMPANHA (wizard) ============================ */
  const steps = ['Tipo', 'Público', 'Oferta', 'Canais e agenda', 'Revisão'];
  let step = 0;
  const stepPanes = [
    () => `
      <h3>Qual o objetivo da campanha?</h3><p class="muted mt-1">Escolha o formato. Você pode ajustar as regras nas próximas etapas.</p>
      <div class="grid g-2 mt-3" data-options style="gap:14px">
        ${[['store', 'Feirão de quitação', 'Período promocional com descontos agressivos para quitação de débitos antigos.', true], ['shield', 'Preventiva', 'Lembretes antes do vencimento para reduzir a entrada em inadimplência.'], ['percent', 'Promocional', 'Condições especiais de parcelamento para públicos específicos.'], ['rocket', 'Estímulo à negociação', 'Reengajar consumidores que acessaram e não fecharam acordo.']].map(([i, t, d, s]) => `
          <div class="option-card ${s ? 'selected' : ''}"><span class="ico-box ${s ? 'dark' : ''}"><i data-lucide="${i}"></i></span><div><strong>${t}</strong><p>${d}</p></div></div>`).join('')}
      </div>
      <div class="form-grid mt-3">
        <div class="field span-2"><label>Nome da campanha</label><input class="input" value="Black Friday da Quitação"></div>
        <div class="field span-2"><label>Descrição interna</label><textarea class="textarea">Feirão com foco em débitos acima de 180 dias, alinhado à campanha institucional de novembro.</textarea></div>
      </div>`,
    () => `
      <h3>Defina o público-alvo</h3><p class="muted mt-1">Segmentação sobre a carteira disponibilizada pela CPFL.</p>
      <div class="form-grid mt-3">
        <div class="field span-2"><label>Distribuidoras</label><div class="chip-group" data-multi>${['CPFL Paulista', 'CPFL Piratininga', 'CPFL Santa Cruz', 'RGE', 'RGE Sul'].map(d => `<button class="chip active">${d}</button>`).join('')}</div></div>
        <div class="field span-2"><label>Idade da fatura</label><div class="chip-group" data-multi>${['31–90 dias', '91–180 dias', '181–360 dias', '1–2 anos', '> 2 anos'].map((d, i) => `<button class="chip ${i >= 2 ? 'active' : ''}">${d}</button>`).join('')}</div></div>
        <div class="field"><label>Tipo de pessoa</label><select class="select"><option>PF e PJ</option><option>Somente PF</option><option>Somente PJ</option></select></div>
        <div class="field"><label>Faixa de score</label><select class="select"><option>Todas</option><option>Acima de 300</option><option>Acima de 500</option></select></div>
        <div class="field"><label>Valor mínimo do débito</label><input class="input" value="R$ 100,00"></div>
        <div class="field"><label>Valor máximo do débito</label><input class="input" value="R$ 50.000,00"></div>
        <label class="check span-2"><input type="checkbox" checked> Excluir consumidores com acordo vigente</label>
        <label class="check span-2"><input type="checkbox" checked> Respeitar opt-out e janela de contato (08h–20h)</label>
      </div>`,
    () => `
      <h3>Configure a oferta</h3><p class="muted mt-1">Limitada à política de descontos autorizada pela CPFL.</p>
      <div class="form-grid mt-3">
        <div class="field span-2"><div class="row-between"><label>Desconto em juros e multa</label><strong class="text-blue" id="lbl-desc">90%</strong></div><input type="range" min="0" max="95" value="90" style="width:100%;accent-color:var(--blue)" oninput="document.getElementById('lbl-desc').textContent=this.value+'%'"><span class="hint">Limite da política para faixas &gt; 2 anos: 95%</span></div>
        <div class="field"><label>Desconto no principal</label><select class="select"><option>Não aplicar</option><option>Até 10%</option><option>Até 20%</option></select></div>
        <div class="field"><label>Parcelamento máximo</label><select class="select"><option>12x</option><option>10x</option><option>6x</option><option>À vista</option></select></div>
        <div class="field"><label>Entrada mínima</label><input class="input" value="10%"></div>
        <div class="field"><label>Validade da proposta</label><input class="input" value="5 dias corridos"></div>
        <div class="field span-2"><label>Meios de pagamento</label><div class="chip-group" data-multi><button class="chip active"><i data-lucide="qr-code"></i>Pix</button><button class="chip active"><i data-lucide="barcode"></i>Boleto</button><button class="chip active"><i data-lucide="credit-card"></i>Cartão de crédito</button></div></div>
      </div>`,
    () => `
      <h3>Canais e agenda</h3><p class="muted mt-1">Disparos com controle e mensuração por canal.</p>
      <div class="field mt-3"><label>Canais</label><div class="chip-group" data-multi>${['WhatsApp', 'SMS', 'E-mail', 'Push', 'Portal'].map((c, i) => `<button class="chip ${i < 4 ? 'active' : ''}"><i data-lucide="${channelIcon(c)}"></i>${c}</button>`).join('')}</div></div>
      <div class="form-grid mt-3">
        <div class="field"><label>Início</label><input class="input" type="date" value="2026-11-20"></div>
        <div class="field"><label>Término</label><input class="input" type="date" value="2026-11-30"></div>
        <div class="field"><label>Frequência de contato</label><select class="select"><option>Até 3 contatos por consumidor</option><option>1 contato</option><option>Até 5 contatos</option></select></div>
        <div class="field"><label>Teste A/B</label><select class="select"><option>2 variações de mensagem</option><option>Desativado</option></select></div>
      </div>
      <div class="grid g-2 mt-3" style="gap:16px">
        <div class="field"><label>Mensagem WhatsApp</label><textarea class="textarea" style="min-height:150px">Olá, {primeiro_nome}! 🖤 Black Friday da Quitação CPFL: seu débito de {valor_original} sai por {valor_oferta} à vista ou em até 12x. Oferta válida até 30/11.</textarea></div>
        <div><label class="label">Pré-visualização</label><div class="wa-phone mt-1" style="min-height:180px"><div class="wa-bubble"><b>CPFL Energia ✔</b><br><br>Olá, Ana! 🖤 <b>Black Friday da Quitação CPFL</b>: seu débito de <s>R$ 1.240,00</s> sai por <b>R$ 412,90</b> à vista ou em até 12x. Oferta válida até 30/11.<div class="time">10:00 <i data-lucide="check-check"></i></div><a class="btn-wa">Quero negociar</a></div></div></div>
      </div>`,
    () => `
      <h3>Revise e publique</h3><p class="muted mt-1">A campanha será enviada para aprovação do gestor CPFL.</p>
      <div class="grid g-2 mt-3" style="gap:14px">
        ${[['store', 'Tipo', 'Feirão de quitação'], ['users', 'Público estimado', '520.000 consumidores'], ['percent', 'Oferta', 'Até 90% em juros e multa · 12x'], ['send', 'Canais', 'WhatsApp, SMS, e-mail, push'], ['calendar', 'Período', '20/11/2026 → 30/11/2026'], ['badge-dollar-sign', 'Potencial de recuperação', 'R$ 18 a 26 mi (estimativa)']].map(([i, k, v]) => `
          <div class="option-card" style="cursor:default"><span class="ico-box"><i data-lucide="${i}"></i></span><div><p style="margin:0">${k}</p><strong>${v}</strong></div></div>`).join('')}
      </div>
      <div class="row mt-3" style="padding:14px 16px;border-radius:12px;background:var(--green-50);color:var(--green-700)"><i data-lucide="shield-check"></i><span class="small" style="font-weight:600">Conformidade verificada: CDC, LGPD (base legal: exercício regular de direito) e política de contato CPFL.</span></div>`,
  ];

  VIEWS['campanha-nova'] = {
    title: 'Nova campanha',
    render: () => { step = 0; return `
      ${pageHead('Recuperação <i data-lucide="chevron-right"></i> Campanhas', 'Nova campanha', 'Crie feirões, réguas preventivas e ações promocionais em poucos passos',
        `<a class="btn btn-ghost" href="#/campanhas">Cancelar</a><button class="btn btn-outline" data-toast="Rascunho salvo" data-icon="save"><i data-lucide="save"></i>Salvar rascunho</button>`)}
      <div class="steps" id="wz-steps"></div>
      <div class="grid g-main mt-3">
        <div class="card"><div class="card-body" id="wz-pane"></div>
          <div class="card-foot"><button class="btn btn-outline" id="wz-prev"><i data-lucide="arrow-left"></i>Voltar</button><button class="btn btn-primary" id="wz-next">Continuar<i data-lucide="arrow-right"></i></button></div>
        </div>
        <div class="stack">
          <div class="card kpi hero"><div class="kpi-top"><div class="kpi-icon"><i data-lucide="users"></i></div></div><div class="kpi-label">Público estimado</div><div class="kpi-value">520.000</div><div class="kpi-foot" style="color:#c5d8ff">R$ 186 mi em débitos elegíveis</div></div>
          <div class="card card-pad">
            <strong class="strong">Projeção de resultado</strong>
            <div class="chart-box xs mt-2"><canvas id="ch-proj"></canvas></div>
            <div class="list mt-1">
              <div class="list-item" style="padding:8px 0"><div class="grow small">Conversão esperada</div><span class="strong">6,5% – 8,0%</span></div>
              <div class="list-item" style="padding:8px 0"><div class="grow small">Acordos estimados</div><span class="strong">33,8 – 41,6 mil</span></div>
              <div class="list-item" style="padding:8px 0"><div class="grow small">Custo estimado de disparos</div><span class="strong">R$ 61,4 mil</span></div>
            </div>
          </div>
        </div>
      </div>`; },
    mount() {
      const draw = () => {
        $('#wz-steps').innerHTML = steps.map((s, i) => `<div class="step ${i === step ? 'active' : i < step ? 'done' : ''}"><span class="n">${i < step ? '✓' : i + 1}</span><div><strong>${s}</strong><span>Etapa ${i + 1} de ${steps.length}</span></div></div>`).join('');
        $('#wz-pane').innerHTML = stepPanes[step]();
        $('#wz-prev').style.visibility = step ? 'visible' : 'hidden';
        $('#wz-next').innerHTML = step === steps.length - 1 ? '<i data-lucide="rocket"></i>Publicar campanha' : 'Continuar<i data-lucide="arrow-right"></i>';
        UI.icons();
      };
      draw();
      $('#wz-next').addEventListener('click', () => {
        if (step < steps.length - 1) { step++; draw(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        else { toast('Campanha enviada para aprovação do gestor CPFL', 'rocket'); location.hash = '#/campanhas'; }
      });
      $('#wz-prev').addEventListener('click', () => { if (step) { step--; draw(); } });
      const c = $('#ch-proj');
      chart(c, { type: 'line', data: { labels: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11'], datasets: [{ data: [1.2, 3.1, 5.4, 7.2, 9.1, 11, 12.6, 14.4, 16.8, 19.7, 22.4], borderColor: palette.blue, backgroundColor: gradient(c, 'rgba(5,99,255,1)'), fill: true, tension: .4, pointRadius: 0, borderWidth: 2.5 }] }, options: { scales: { x: { display: false }, y: { display: false } }, plugins: { tooltip: { callbacks: { label: x => ` R$ ${x.raw} mi acumulado` } } } } });
    },
  };

  /* ============================ ATUALIZAÇÃO CADASTRAL ============================ */
  function enrModal(e) {
    const rows = DB.clientes.slice(0, 6);
    modal(`
      <div class="modal-head"><div><h3>${e.id} · Resultado do enriquecimento</h3><p>${num(e.registros)} registros · ${e.dist} · solicitado por ${e.usuario}</p></div>${closeBtn}</div>
      <div class="modal-body">
        <div class="grid g-4" style="gap:10px">
          ${[['Telefone', 81], ['E-mail', 64], ['Endereço', 77], ['CPF/CNPJ', 99]].map(([k, v]) => `<div class="card card-pad" style="padding:14px"><span class="small muted">${k}</span><div class="strong" style="font-size:20px">${v}%</div><div class="progress green thin mt-1"><span style="width:${v}%"></span></div></div>`).join('')}
        </div>
        <div class="table-wrap mt-3"><table class="table">
          <thead><tr><th>Consumidor</th><th>Telefone</th><th>E-mail</th><th>Endereço</th></tr></thead>
          <tbody>${rows.map((c, i) => `<tr><td>${userCell(c.nome, c.doc, c.pj)}</td>
            <td><span class="small muted" style="text-decoration:line-through">(19) 9****-0000</span><br><b class="text-green">(19) 9${i}8**-**${i}2</b></td>
            <td>${i % 3 ? `<b class="text-green">${c.nome.split(' ')[0].toLowerCase()}***@gmail.com</b>` : '<span class="muted">sem retorno</span>'}</td>
            <td><b class="text-green">CEP 13***-${100 + i * 7}</b><br><span class="small muted">${c.cidade}</span></td></tr>`).join('')}</tbody>
        </table></div>
        <p class="small muted mt-2">Dados mascarados em tela. Uso exclusivo para aprimoramento cadastral da contratante (LGPD).</p>
      </div>
      <div class="modal-foot"><button class="btn btn-outline" data-toast="Arquivo de retorno enviado ao SFTP CPFL" data-icon="server">Enviar ao SAP CCS</button><button class="btn btn-primary" data-toast="Arquivo baixado (.csv criptografado)" data-icon="file-down"><i data-lucide="download"></i>Baixar resultado</button></div>`, 'lg');
  }

  VIEWS.cadastral = {
    title: 'Atualização cadastral',
    render: () => `
      ${pageHead('Informação', 'Atualização cadastral', 'Enriquecimento de telefone, e-mail, endereço e CPF/CNPJ sob demanda da CPFL',
        `<button class="btn btn-primary" id="btn-enr"><i data-lucide="sparkles"></i>Nova solicitação</button>`)}
      <div class="grid g-4">
        ${kpi({ icon: 'database', label: 'Registros enriquecidos (mês)', value: '49.560', trend: '+14%' })}
        ${kpi({ icon: 'phone', color: 'green', label: 'Telefones atualizados', value: '81%', foot: 'Taxa de localização' })}
        ${kpi({ icon: 'mail', color: 'violet', label: 'E-mails encontrados', value: '64%', foot: 'Validados por sintaxe e MX' })}
        ${kpi({ icon: 'map-pin', color: 'warn', label: 'Endereços completos', value: '77%', foot: 'Base para 2º comunicado' })}
      </div>
      <div class="grid g-main mt-3">
        <div class="card">
          <div class="card-head"><div><h3>Solicitações</h3><p>Executadas em datas e volumes previamente acordados</p></div></div>
          <div class="table-wrap"><table class="table">
            <thead><tr><th>Solicitação</th><th>Distribuidora</th><th class="num">Registros</th><th>Campos</th><th>Localização</th><th>Status</th><th></th></tr></thead>
            <tbody>${DB.enriquecimentos.map(e => `
              <tr class="clickable" data-enr="${e.id}">
                <td><strong class="strong mono">${e.id}</strong><div class="small muted">${e.solicitado} · ${e.usuario}</div></td>
                <td>${e.dist}</td><td class="num strong">${num(e.registros)}</td>
                <td><div class="row" style="gap:4px;flex-wrap:wrap">${e.campos.map(c => `<span class="badge no-dot">${c}</span>`).join('')}</div></td>
                <td style="min-width:130px"><div class="row"><div class="progress green thin" style="flex:1"><span style="width:${e.taxa}%"></span></div><span class="small strong">${e.taxa.toLocaleString('pt-BR')}%</span></div></td>
                <td>${statusBadge(e.status)}</td>
                <td><button class="btn btn-ghost btn-icon btn-sm"><i data-lucide="chevron-right"></i></button></td>
              </tr>`).join('')}</tbody>
          </table></div>
        </div>
        <div class="card">
          <div class="card-head"><div><h3>Campos enriquecidos</h3><p>Últimos 30 dias</p></div></div>
          <div class="card-body"><div class="chart-box sm"><canvas id="ch-enr"></canvas></div>
            <div class="row mt-3" style="padding:14px;border-radius:12px;background:var(--blue-50)"><i data-lucide="lock" style="color:var(--blue)"></i><span class="small">Informações destinadas exclusivamente ao aprimoramento dos dados da contratante.</span></div>
          </div>
        </div>
      </div>`,
    mount(el) {
      el.addEventListener('click', e => { const r = e.target.closest('tr[data-enr]'); if (r) enrModal(DB.enriquecimentos.find(x => x.id === r.dataset.enr)); });
      chart($('#ch-enr'), { type: 'bar', data: { labels: ['Telefone', 'E-mail', 'Endereço', 'CPF/CNPJ'], datasets: [{ label: 'Solicitados', data: [49, 41, 38, 26], backgroundColor: palette.gray, borderRadius: 6 }, { label: 'Enriquecidos', data: [40, 26, 29, 25.7], backgroundColor: palette.blue, borderRadius: 6 }] }, options: { scales: gridScales({ yTicks: { callback: v => v + ' mil' } }) } });
      $('#btn-enr').addEventListener('click', () => modal(`
        <div class="modal-head"><div><h3>Nova solicitação de enriquecimento</h3><p>Defina a base e os campos a atualizar</p></div>${closeBtn}</div>
        <div class="modal-body stack" style="gap:16px">
          <div class="grid g-2" data-options style="gap:12px">
            <div class="option-card selected"><span class="ico-box"><i data-lucide="filter"></i></span><div><strong>Selecionar da carteira</strong><p>Filtrar clientes já na plataforma</p></div></div>
            <div class="option-card"><span class="ico-box green"><i data-lucide="upload"></i></span><div><strong>Enviar arquivo</strong><p>Lista CSV/TXT de CPFs/CNPJs</p></div></div>
          </div>
          <div class="field"><label>Campos para atualizar</label><div class="chip-group" data-multi><button class="chip active"><i data-lucide="phone"></i>Telefone</button><button class="chip active"><i data-lucide="mail"></i>E-mail</button><button class="chip active"><i data-lucide="map-pin"></i>Endereço completo</button><button class="chip"><i data-lucide="id-card"></i>CPF/CNPJ</button></div></div>
          <div class="form-grid">
            <div class="field"><label>Distribuidora</label><select class="select"><option>Todas</option>${DB.distribuidoras.map(d => `<option>${d.nome}</option>`).join('')}</select></div>
            <div class="field"><label>Critério</label><select class="select"><option>Comunicação não entregue (bounce)</option><option>Sem telefone válido</option><option>Endereço incompleto</option></select></div>
            <div class="field"><label>Data de execução</label><input class="input" type="date" value="2026-10-09"></div>
            <div class="field"><label>Volume estimado</label><input class="input" value="6.214 registros" disabled></div>
          </div>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" data-close>Cancelar</button><button class="btn btn-primary" data-toast="Solicitação ENR-3023 criada" data-close-after>Solicitar</button></div>`));
    },
  };

  /* ============================ CONSULTAS E SCORE ============================ */
  VIEWS.consultas = {
    title: 'Consultas e score',
    render: () => `
      ${pageHead('Informação', 'Consultas, scoragem e análise de carteira', 'Informações PF/PJ para apoio à decisão e priorização da cobrança',
        `<button class="btn btn-outline" id="btn-carteira"><i data-lucide="pie-chart"></i>Análise de carteira</button>`)}
      <div class="card">
        <div class="card-body">
          <div class="row wrap" style="gap:12px">
            <div class="tabs" data-tabs><button class="tab active">Pessoa física</button><button class="tab">Pessoa jurídica</button></div>
            <div class="input-icon" style="flex:1;min-width:240px"><i data-lucide="search"></i><input class="input" style="height:46px" value="***.482.719-**" id="q-doc"></div>
            <button class="btn btn-primary btn-lg" id="btn-consultar" style="height:46px"><i data-lucide="search"></i>Consultar</button>
          </div>
          <div class="chip-group mt-2" data-multi>
            ${['Score', 'Pendências financeiras', 'Protestos', 'Cheques sem fundos', 'Falências e concordatas', 'Recuperação judicial', 'Participação em empresas falidas', 'Óbito'].map((p, i) => `<button class="chip ${i < 5 ? 'active' : ''}">${p}</button>`).join('')}
          </div>
        </div>
      </div>

      <div class="grid mt-3" style="grid-template-columns:minmax(0,1fr) minmax(0,2fr)" id="cs-grid">
        <div class="card card-pad" style="text-align:center">
          <span class="small muted" style="font-weight:600;text-transform:uppercase;letter-spacing:.08em">Score Previnity</span>
          <div class="chart-box xs mt-2" style="height:170px"><canvas id="ch-score"></canvas>
            <div style="position:absolute;inset:auto 0 8px 0"><div style="font-size:42px;font-weight:800;color:var(--ink);letter-spacing:-.04em;line-height:1">612</div><div class="small muted">de 1000</div></div>
          </div>
          <span class="badge badge-blue mt-2">Risco moderado</span>
          <p class="small muted mt-2">Probabilidade de pagamento em 90 dias: <b class="strong">68%</b></p>
          <div class="list mt-2" style="text-align:left">
            <div class="list-item" style="padding:10px 0"><div class="grow small">Recomendação de cobrança</div><span class="badge badge-green no-dot">Oferta à vista</span></div>
            <div class="list-item" style="padding:10px 0"><div class="grow small">Melhor canal</div><span class="strong small">WhatsApp</span></div>
            <div class="list-item" style="padding:10px 0"><div class="grow small">Melhor horário</div><span class="strong small">18h – 20h</span></div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><div><h3>Ana Paula Ribeiro</h3><p>***.482.719-** · 38 anos · Campinas/SP · Consulta em 08/10/2026 08:44</p></div><button class="btn btn-sm btn-outline" data-toast="Relatório de consulta baixado (PDF)" data-icon="file-down"><i data-lucide="download"></i>PDF</button></div>
          <div class="card-body">
            <div class="grid g-3" style="gap:12px">
              ${[['Pendências financeiras', '2', 'R$ 1.884,30', 'warn', 'wallet'], ['Protestos', '0', 'Nada consta', 'green', 'stamp'], ['Cheques sem fundos', '0', 'Nada consta', 'green', 'receipt'], ['Falências / RJ', '—', 'Não se aplica (PF)', '', 'scale'], ['Participação societária', '1', 'Empresa ativa', '', 'building-2'], ['Óbito', 'Não', 'Nada consta', 'green', 'heart-pulse']].map(([k, v, s, c, i]) => `
                <div class="card card-pad" style="padding:16px"><div class="row-between"><span class="ico-box ${c}" style="width:34px;height:34px"><i data-lucide="${i}"></i></span><span class="strong" style="font-size:20px">${v}</span></div><div class="small strong mt-2">${k}</div><div class="small muted">${s}</div></div>`).join('')}
            </div>
            <h4 class="mt-3" style="font-size:14px">Pendências financeiras</h4>
            <div class="table-wrap mt-1"><table class="table" style="min-width:520px">
              <thead><tr><th>Credor</th><th>Natureza</th><th>Data</th><th class="num">Valor</th></tr></thead>
              <tbody><tr><td class="strong">CPFL Paulista</td><td>Energia elétrica</td><td>15/07/2026</td><td class="num">R$ 486,20</td></tr><tr><td class="strong">Instituição financeira</td><td>Cartão de crédito</td><td>02/03/2026</td><td class="num">R$ 1.398,10</td></tr></tbody>
            </table></div>
          </div>
        </div>
      </div>

      <div class="card mt-3">
        <div class="card-head"><div><h3>Distribuição de score da carteira inadimplente</h3><p>Priorização de estratégias por faixa de risco · base CPFL consolidada</p></div><div class="legend"><span><i style="background:${palette.blue}"></i>Clientes</span><span><i style="background:${palette.green}"></i>Taxa de recuperação</span></div></div>
        <div class="card-body"><div class="chart-box"><canvas id="ch-dist"></canvas></div></div>
      </div>`,
    mount() {
      const mq = matchMedia('(max-width: 1080px)');
      const setCols = () => { $('#cs-grid').style.gridTemplateColumns = mq.matches ? 'minmax(0,1fr)' : 'minmax(0,1fr) minmax(0,2fr)'; };
      setCols(); mq.addEventListener('change', setCols);
      chart($('#ch-score'), { type: 'doughnut', data: { datasets: [{ data: [612, 388], backgroundColor: [palette.blue, '#eef1f6'], borderWidth: 0, borderRadius: 10 }] }, options: { rotation: -90, circumference: 180, cutout: '78%', plugins: { tooltip: { enabled: false } } } });
      chart($('#ch-dist'), {
        data: { labels: ['0–100', '101–200', '201–300', '301–400', '401–500', '501–600', '601–700', '701–800', '801–900', '901–1000'], datasets: [
          { type: 'bar', label: 'Clientes', data: [42, 88, 131, 172, 198, 176, 128, 79, 41, 18].map(v => v * 1000), backgroundColor: palette.blue, borderRadius: 6, yAxisID: 'y' },
          { type: 'line', label: 'Recuperação %', data: [3, 5, 8, 12, 17, 23, 31, 42, 55, 68], borderColor: palette.green, backgroundColor: palette.green, tension: .4, borderWidth: 3, pointRadius: 3, yAxisID: 'y1' },
        ] },
        options: { scales: { ...gridScales({ yTicks: { callback: v => compact(v) } }), y1: { position: 'right', grid: { display: false }, border: { display: false }, ticks: { callback: v => v + '%' } } } },
      });
      $('#btn-consultar').addEventListener('click', () => toast('Consulta realizada · 1 crédito utilizado', 'search'));
      $('#btn-carteira').addEventListener('click', () => modal(`
        <div class="modal-head"><div><h3>Análise de carteira</h3><p>Score e segmentação em lote, sob demanda</p></div>${closeBtn}</div>
        <div class="modal-body stack" style="gap:16px">
          <div class="dropzone"><div class="ico-box"><i data-lucide="upload-cloud"></i></div><strong class="strong">Envie a base ou selecione uma carteira da plataforma</strong><p class="small muted mt-1">CSV/TXT com CPF/CNPJ · até 2 milhões de linhas</p></div>
          <div class="field"><label>Entregáveis</label><div class="chip-group" data-multi><button class="chip active">Score individual</button><button class="chip active">Faixas de risco</button><button class="chip active">Propensão a acordo</button><button class="chip">Melhor canal</button></div></div>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" data-close>Cancelar</button><button class="btn btn-primary" data-toast="Análise agendada · resultado em até 24h" data-close-after>Solicitar análise</button></div>`));
    },
  };
})();
