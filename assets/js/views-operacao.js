window.VIEWS = window.VIEWS || {};
(function () {
  const { $, $$, money, num, compact, initials, chart, palette, gridScales, gradient, statusBadge, channelIcon, modal, drawer, closeBtn, toast, icons } = UI;
  const meses = ['Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];

  const pageHead = (crumb, title, sub, actions = '') => `
    <div class="page-head">
      <div>
        <div class="breadcrumb"><i data-lucide="home"></i> Portal CPFL <i data-lucide="chevron-right"></i> ${crumb}</div>
        <h1>${title}</h1><p>${sub}</p>
      </div>
      <div class="page-actions">${actions}</div>
    </div>`;
  const kpi = ({ icon, color = '', label, value, trend, up = true, foot, hero }) => `
    <div class="card kpi ${hero ? 'hero' : ''}">
      <div class="kpi-top"><div class="kpi-icon ${color}"><i data-lucide="${icon}"></i></div>${trend ? `<span class="trend ${up ? 'up' : 'down'}"><i data-lucide="${up ? 'trending-up' : 'trending-down'}"></i>${trend}</span>` : ''}</div>
      <div class="kpi-label">${label}</div>
      <div class="kpi-value">${value}</div>
      ${foot ? `<div class="kpi-foot">${foot}</div>` : ''}
    </div>`;
  const userCell = (nome, sub, pj) => `<div class="cell-user"><span class="avatar ${pj ? 'violet' : ''}">${initials(nome)}</span><div><strong>${nome}</strong><span>${sub}</span></div></div>`;

  window.H = { pageHead, kpi, userCell };

  /* ============================ DASHBOARD ============================ */
  VIEWS.dashboard = {
    title: 'Dashboard',
    render: () => `
      ${pageHead('Dashboard', 'Bom dia, Mariana 👋', 'Quinta-feira, 08 de outubro de 2026 · Visão consolidada do Grupo CPFL',
        `<div class="tabs" data-tabs><button class="tab">Hoje</button><button class="tab">7 dias</button><button class="tab active">30 dias</button><button class="tab">12 meses</button></div>
         <button class="btn btn-outline" data-toast="Relatório executivo exportado (PDF)" data-icon="file-down"><i data-lucide="download"></i>Exportar</button>
         <a class="btn btn-primary" href="#/campanha-nova"><i data-lucide="plus"></i>Nova campanha</a>`)}

      <div class="banner">
        <div class="ico-box dark" style="width:48px;height:48px;border-radius:14px;background:rgba(0,229,160,.14)"><i data-lucide="workflow"></i></div>
        <div style="flex:1;min-width:200px">
          <h3>Processamento diário · 8 de 9 arquivos concluídos</h3>
          <p class="small" style="margin-top:2px">Recebidos via SAP CCS/SFTP entre 01:12 e 05:48 · 128.417 registros · próxima janela de envio ao bureau às 10:00</p>
          <div class="progress green thin mt-2" style="max-width:520px;background:rgba(255,255,255,.08);border-color:transparent"><span style="width:89%"></span></div>
        </div>
        <a class="btn btn-accent" href="#/lotes">Acompanhar lotes <i data-lucide="arrow-right"></i></a>
      </div>

      <div class="grid g-4 mt-3">
        ${kpi({ hero: true, icon: 'wallet', label: 'Valor recuperado (30 dias)', value: 'R$ 24,6 mi', trend: '+18,2%', foot: '<span style="color:#c5d8ff">Meta mensal: R$ 30 mi · 82% atingido</span>' })}
        ${kpi({ icon: 'file-x-2', label: 'Negativações ativas', value: '1,28 mi', trend: '+3,1%', foot: '41.208 inclusões · 9.874 exclusões hoje' })}
        ${kpi({ icon: 'handshake', color: 'green', label: 'Acordos formalizados', value: '38.410', trend: '+12,4%', foot: 'Ticket médio R$ 642,80' })}
        ${kpi({ icon: 'message-circle', color: 'violet', label: 'Entregabilidade WhatsApp', value: '92,4%', trend: '-0,6pp', up: false, foot: 'Transbordo e-mail: 6,1% · carta: 1,5%' })}
      </div>

      <div class="grid g-main mt-3">
        <div class="card">
          <div class="card-head">
            <div><h3>Recuperação de receita</h3><p>Valores recuperados x carteira exposta à negociação</p></div>
            <div class="legend"><span><i style="background:${palette.blue}"></i>Recuperado</span><span><i style="background:${palette.green}"></i>Acordos (qtd.)</span></div>
          </div>
          <div class="card-body"><div class="chart-box"><canvas id="ch-recup"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-head"><div><h3>Comunicação por canal</h3><p>Cascata de notificação · últimos 30 dias</p></div></div>
          <div class="card-body">
            <div class="chart-box sm"><canvas id="ch-canais"></canvas></div>
            <div class="list mt-2">
              ${[['WhatsApp', 'message-circle', 'wa', '1.240.920', '92,4%'], ['E-mail', 'mail', '', '443.180', '71,8%'], ['Carta', 'mail-open', 'warn', '88.650', '98,1%'], ['SMS (campanhas)', 'smartphone', 'violet', '612.400', '95,0%']].map(([n, i, c, q, p]) => `
                <div class="list-item" style="padding:10px 0"><div class="ico-box ${c}" style="width:32px;height:32px"><i data-lucide="${i}"></i></div><div class="grow"><strong>${n}</strong><span class="sub">${q} envios</span></div><span class="strong">${p}</span></div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="card mt-3">
        <div class="card-head"><div><h3>Funil operacional da negativação · hoje</h3><p>Do arquivo SAP CCS ao comunicado entregue, com rastreabilidade por registro</p></div><a href="#/negativacoes" class="btn btn-sm btn-outline">Ver registros</a></div>
        <div class="card-body">
          <div class="flow">
            <div class="flow-step done"><div class="n">1 · Recepção</div><strong>Registros recebidos</strong><div class="v">128.417</div><span class="small muted">9 arquivos · 1 por distribuidora</span></div>
            <div class="flow-step done"><div class="n">2 · Validação</div><strong>Elegíveis</strong><div class="v">127.981</div><span class="small muted">436 rejeitados (0,3%)</span></div>
            <div class="flow-step done"><div class="n">3 · Bureau</div><strong>Comandos enviados</strong><div class="v">114.226</div><span class="small muted">Inclusões e exclusões · QUOD</span></div>
            <div class="flow-step run"><div class="n">4 · Retorno</div><strong>Confirmados</strong><div class="v">111.082</div><span class="small muted">97,2% · 3.144 aguardando</span></div>
            <div class="flow-step"><div class="n">5 · Comunicação</div><strong>Comunicados entregues</strong><div class="v">96.540</div><span class="small muted">Carta de inclusão D+1 útil</span></div>
          </div>
        </div>
      </div>

      <div class="grid g-2 mt-3">
        <div class="card">
          <div class="card-head"><div><h3>Recuperação por idade da fatura</h3><p>Base para apuração da remuneração por sucesso</p></div></div>
          <div class="card-body"><div class="chart-box sm"><canvas id="ch-faixa"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-head"><div><h3>Desempenho por distribuidora</h3><p>Recuperado no mês e taxa de conversão</p></div><a href="#/relatorios" class="small" style="font-weight:600">Ver relatório</a></div>
          <div class="card-body" style="padding-top:8px">
            <div class="list">
              ${[['CPFL Paulista', 11.2, 7.9, 92], ['CPFL Piratininga', 5.1, 7.1, 74], ['RGE', 3.9, 6.8, 66], ['RGE Sul', 2.8, 6.2, 58], ['CPFL Santa Cruz (5 códigos)', 1.6, 6.5, 40]].map(([n, v, c, w]) => `
                <div class="list-item">
                  <div class="grow"><div class="row-between"><strong>${n}</strong><span class="strong">R$ ${v.toLocaleString('pt-BR')} mi</span></div>
                  <div class="row mt-1"><div class="progress thin" style="flex:1"><span style="width:${w}%"></span></div><span class="small muted" style="width:92px;text-align:right">conv. ${c.toLocaleString('pt-BR')}%</span></div></div>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="grid g-main mt-3">
        <div class="card">
          <div class="card-head"><div><h3>Campanhas ativas</h3><p>Feirões e réguas em execução</p></div><a href="#/campanhas" class="btn btn-sm btn-outline">Gerenciar</a></div>
          <div class="table-wrap"><table class="table">
            <thead><tr><th>Campanha</th><th>Canais</th><th class="num">Acordos</th><th class="num">Recuperado</th><th>Conversão</th></tr></thead>
            <tbody>${DB.campanhas.filter(c => c.status === 'Ativa').map(c => `
              <tr class="clickable" onclick="location.hash='#/campanhas'">
                <td><strong class="strong">${c.nome}</strong><div class="small muted">${c.tipo} · até ${c.fim}</div></td>
                <td><div class="row" style="gap:6px">${c.canais.map(ch => `<span class="ico-box" style="width:28px;height:28px;border-radius:8px" title="${ch}"><i data-lucide="${channelIcon(ch)}" style="width:14px;height:14px"></i></span>`).join('')}</div></td>
                <td class="num">${num(c.acordos)}</td><td class="num strong">${money(c.recuperado, 0)}</td>
                <td style="min-width:140px"><div class="row"><div class="progress green thin" style="flex:1"><span style="width:${Math.min(c.conversao * 3, 100)}%"></span></div><span class="small strong">${c.conversao.toLocaleString('pt-BR')}%</span></div></td>
              </tr>`).join('')}</tbody>
          </table></div>
        </div>
        <div class="card">
          <div class="card-head"><div><h3>Atividade recente</h3><p>Eventos do sistema</p></div></div>
          <div class="card-body">
            <div class="timeline">
              <div class="tl-item ok"><span class="tl-dot"><i data-lucide="check"></i></span><strong>LT-88410 processado</strong><span class="sub">CPFL Paulista · 41.880 registros · 08:12</span></div>
              <div class="tl-item ok"><span class="tl-dot"><i data-lucide="check"></i></span><strong>Retorno QUOD recebido</strong><span class="sub">41.208 comandos confirmados · 07:55</span></div>
              <div class="tl-item fail"><span class="tl-dot"><i data-lucide="x"></i></span><strong>23 registros rejeitados</strong><span class="sub">LT-88414 · CEP ausente · 06:02</span></div>
              <div class="tl-item"><span class="tl-dot"><i data-lucide="send"></i></span><strong>Disparo WhatsApp iniciado</strong><span class="sub">38.120 comunicados de inclusão · 07:00</span></div>
              <div class="tl-item pending"><span class="tl-dot"><i data-lucide="clock"></i></span><strong>Arquivo de retorno SAP CCS</strong><span class="sub">Agendado para 18:00</span></div>
            </div>
          </div>
        </div>
      </div>`,
    mount() {
      const c1 = $('#ch-recup');
      chart(c1, {
        type: 'line',
        data: {
          labels: meses,
          datasets: [
            { label: 'Recuperado (R$ mi)', data: [14.2, 13.1, 15.8, 16.4, 15.9, 17.8, 19.2, 18.4, 20.1, 21.3, 20.8, 24.6], borderColor: palette.blue, backgroundColor: gradient(c1, 'rgba(5,99,255,1)'), fill: true, tension: .4, borderWidth: 3, pointRadius: 0, pointHoverRadius: 6, yAxisID: 'y' },
            { label: 'Acordos (mil)', data: [22, 20, 24, 25, 24, 27, 30, 29, 32, 34, 33, 38.4], borderColor: palette.green, borderDash: [6, 6], tension: .4, borderWidth: 2.5, pointRadius: 0, yAxisID: 'y1' },
          ],
        },
        options: { interaction: { mode: 'index', intersect: false }, scales: { ...gridScales({ yTicks: { callback: v => 'R$ ' + v + ' mi' } }), y1: { position: 'right', grid: { display: false }, border: { display: false }, ticks: { callback: v => v + ' mil' } } } },
      });
      chart($('#ch-canais'), {
        type: 'doughnut',
        data: { labels: ['WhatsApp', 'E-mail', 'Carta', 'SMS'], datasets: [{ data: [1240920, 443180, 88650, 612400], backgroundColor: [palette.blue, palette.green, palette.warn, palette.violet], borderWidth: 0, spacing: 3, borderRadius: 6 }] },
        options: { cutout: '72%' },
      });
      chart($('#ch-faixa'), {
        type: 'bar',
        data: { labels: ['31–90 dias', '91–180 dias', '181–360 dias', '1–2 anos', '> 2 anos'], datasets: [{ label: 'Recuperado (R$ mi)', data: [9.8, 6.4, 4.2, 2.7, 1.5], backgroundColor: [palette.blue, '#2f7dff', '#5a98ff', palette.green, '#7af0c8'], borderRadius: 8, barThickness: 36 }] },
        options: { scales: gridScales({ yTicks: { callback: v => 'R$ ' + v + ' mi' } }) },
      });
    },
  };

  /* ============================ LOTES ============================ */
  const loteRow = l => `
    <tr class="clickable" data-lote="${l.lote}">
      <td><div class="cell-user"><span class="ico-box ${l.status === 'Concluído' ? 'green' : l.status === 'Processando' ? 'violet' : 'warn'}"><i data-lucide="file-text"></i></span><div><strong class="mono" style="font-size:13px">${l.id}</strong><span>${l.lote} · ${l.tamanho} · ${l.origem}</span></div></div></td>
      <td><span class="badge no-dot">${l.cod}</span> ${l.dist}</td>
      <td class="small">${l.recebido}</td>
      <td class="num strong">${num(l.total)}</td>
      <td class="num">${num(l.inclusoes)}</td>
      <td class="num">${num(l.exclusoes)}</td>
      <td class="num ${l.rejeitados ? 'text-danger' : ''}">${num(l.rejeitados)}</td>
      <td style="min-width:150px"><div class="row"><div class="progress thin ${l.progresso === 100 ? 'green' : ''}" style="flex:1"><span style="width:${l.progresso}%"></span></div>${statusBadge(l.status)}</div></td>
      <td><button class="btn btn-ghost btn-icon btn-sm"><i data-lucide="chevron-right"></i></button></td>
    </tr>`;

  function loteDrawer(l) {
    drawer(`
      <div class="drawer-head"><div><span class="badge badge-blue no-dot">${l.lote}</span><h3 class="mt-1" style="font-size:17px">${l.dist}</h3><p class="small muted mono">${l.id}</p></div>${closeBtn}</div>
      <div class="drawer-body">
        <div class="grid g-3" style="gap:10px">
          <div class="card card-pad" style="padding:14px"><span class="small muted">Registros</span><div class="strong" style="font-size:20px">${num(l.total)}</div></div>
          <div class="card card-pad" style="padding:14px"><span class="small muted">Aceitos</span><div class="strong text-green" style="font-size:20px">${num(l.total - l.rejeitados)}</div></div>
          <div class="card card-pad" style="padding:14px"><span class="small muted">Rejeitados</span><div class="strong text-danger" style="font-size:20px">${num(l.rejeitados)}</div></div>
        </div>
        <h4 class="mt-3" style="font-size:14px">Validações aplicadas</h4>
        <div class="list mt-1">
          ${[['Layout e cabeçalho do arquivo', true], ['CPF/CNPJ válido e dígito verificador', true], ['Endereço completo (CEP, logradouro, município)', l.rejeitados < 30], ['Débito vencido e elegível (ANEEL 1.000/2021)', true], ['Duplicidade de inclusão no bureau', true], ['Exclusão por pagamento confirmado', true]].map(([t, ok]) => `
            <div class="list-item" style="padding:10px 0"><span class="ico-box ${ok ? 'green' : 'warn'}" style="width:28px;height:28px"><i data-lucide="${ok ? 'check' : 'triangle-alert'}" style="width:14px;height:14px"></i></span><div class="grow"><strong style="font-weight:500">${t}</strong></div><span class="small ${ok ? 'text-green' : ''}" style="font-weight:600">${ok ? 'OK' : l.rejeitados + ' alertas'}</span></div>`).join('')}
        </div>
        <h4 class="mt-3" style="font-size:14px">Linha do tempo</h4>
        <div class="timeline mt-2">
          <div class="tl-item ok"><span class="tl-dot"><i data-lucide="check"></i></span><strong>Arquivo recebido · ${l.origem}</strong><span class="sub">${l.recebido} · hash SHA-256 verificado</span></div>
          <div class="tl-item ok"><span class="tl-dot"><i data-lucide="check"></i></span><strong>Validação concluída</strong><span class="sub">${num(l.total - l.rejeitados)} registros elegíveis</span></div>
          <div class="tl-item ${l.progresso === 100 ? 'ok' : ''}"><span class="tl-dot"><i data-lucide="${l.progresso === 100 ? 'check' : 'loader'}"></i></span><strong>Comandos enviados ao bureau</strong><span class="sub">${num(l.inclusoes)} inclusões · ${num(l.exclusoes)} exclusões</span></div>
          <div class="tl-item ${l.progresso === 100 ? 'ok' : 'pending'}"><span class="tl-dot"><i data-lucide="${l.progresso === 100 ? 'check' : 'clock'}"></i></span><strong>Retorno QUOD</strong><span class="sub">${l.progresso === 100 ? '99,4% confirmados' : 'Aguardando'}</span></div>
          <div class="tl-item pending"><span class="tl-dot"><i data-lucide="clock"></i></span><strong>Arquivo de retorno para SAP CCS</strong><span class="sub">Agendado 18:00 · backup do procedimento</span></div>
        </div>
      </div>
      <div class="drawer-foot">
        <button class="btn btn-outline" data-toast="Relatório de rejeitados exportado (.csv)" data-icon="file-down"><i data-lucide="file-warning"></i>Rejeitados</button>
        <button class="btn btn-outline" data-toast="Reprocessamento agendado para os registros corrigidos" data-icon="refresh-cw"><i data-lucide="refresh-cw"></i>Reprocessar</button>
        <button class="btn btn-primary" data-toast="Arquivo de retorno baixado" data-icon="download"><i data-lucide="download"></i>Retorno</button>
      </div>`);
  }

  function uploadModal() {
    const el = modal(`
      <div class="modal-head"><div><h3>Envio manual de arquivo</h3><p>Use apenas em contingência. O fluxo padrão é automático via SAP CCS/SFTP.</p></div>${closeBtn}</div>
      <div class="modal-body stack" style="gap:16px">
        <div class="form-grid">
          <div class="field"><label>Distribuidora</label><select class="select">${DB.distribuidoras.map(d => `<option>${d.cod} · ${d.nome}</option>`).join('')}</select></div>
          <div class="field"><label>Tipo de arquivo</label><select class="select"><option>Inclusão e exclusão (padrão)</option><option>Somente exclusões</option><option>2º comunicado</option></select></div>
        </div>
        <div class="dropzone" id="dz"><div class="ico-box"><i data-lucide="upload-cloud"></i></div><strong class="strong">Arraste o arquivo aqui ou clique para selecionar</strong><p class="small muted mt-1">.txt ou .csv no layout CPFL · até 500 MB · criptografia em trânsito</p></div>
        <div id="up-progress" class="hide">
          <div class="row-between small"><span class="strong mono">CPFL_NEG_01_20261008_contingencia.txt</span><span id="up-pct">0%</span></div>
          <div class="progress mt-1"><span id="up-bar" style="width:0%"></span></div>
          <p class="small muted mt-1" id="up-msg">Enviando...</p>
        </div>
      </div>
      <div class="modal-foot"><button class="btn btn-ghost" data-close>Cancelar</button><button class="btn btn-primary" id="up-go" disabled>Iniciar processamento</button></div>`);
    $('#dz', el).addEventListener('click', () => {
      $('#up-progress', el).classList.remove('hide');
      let p = 0;
      const t = setInterval(() => {
        p = Math.min(100, p + 7 + Math.random() * 10);
        $('#up-bar', el).style.width = p + '%';
        $('#up-pct', el).textContent = Math.round(p) + '%';
        if (p >= 100) { clearInterval(t); $('#up-msg', el).innerHTML = '<span class="text-green" style="font-weight:600">✓ Layout validado · 12.408 registros identificados</span>'; $('#up-go', el).disabled = false; }
      }, 180);
    });
    $('#up-go', el).addEventListener('click', () => { UI.closeAll(); toast('Lote LT-88419 criado e enviado para processamento', 'folder-check'); });
  }

  VIEWS.lotes = {
    title: 'Recepção de lotes',
    render: () => `
      ${pageHead('Negativação', 'Recepção e processamento', 'Arquivos diários enviados pelo SAP CCS · um por código de distribuidora · processamento no mesmo dia',
        `<button class="btn btn-outline" id="btn-sftp"><i data-lucide="server"></i>Configurar SFTP</button><button class="btn btn-primary" id="btn-upload"><i data-lucide="upload"></i>Envio manual</button>`)}
      <div class="grid g-4">
        ${kpi({ icon: 'files', label: 'Arquivos recebidos hoje', value: '9 <small>/ 9</small>', foot: 'Último às 05:48 · RGE Sul' })}
        ${kpi({ icon: 'list-checks', color: 'green', label: 'Registros processados', value: '128.417', trend: '+4,2%', foot: 'Média diária 30d: 123.180' })}
        ${kpi({ icon: 'triangle-alert', color: 'warn', label: 'Rejeitados na validação', value: '436', trend: '0,34%', up: false, foot: 'Principal motivo: CEP ausente' })}
        ${kpi({ icon: 'timer', color: 'violet', label: 'Tempo médio de processamento', value: '42 min', foot: 'SLA: mesmo dia do recebimento' })}
      </div>

      <div class="card mt-3">
        <div class="card-head"><div><h3>Pipeline de hoje</h3><p>Etapas automáticas, sem operação manual</p></div><span class="badge badge-green">Automação ativa</span></div>
        <div class="card-body">
          <div class="flow">
            <div class="flow-step done"><div class="n">01:12 – 05:48</div><strong>Recepção</strong><span class="small muted">9 arquivos · SFTP/API</span></div>
            <div class="flow-step done"><div class="n">até 06:10</div><strong>Validação</strong><span class="small muted">Layout, CPF/CNPJ, endereço, elegibilidade</span></div>
            <div class="flow-step run"><div class="n">em andamento</div><strong>Envio ao bureau</strong><span class="small muted">Comandos de inclusão/exclusão QUOD</span></div>
            <div class="flow-step"><div class="n">até 14:00</div><strong>Retorno bureau</strong><span class="small muted">Confirmação por registro</span></div>
            <div class="flow-step"><div class="n">18:00</div><strong>Retorno SAP CCS</strong><span class="small muted">Arquivo de atualização + backup</span></div>
          </div>
        </div>
      </div>

      <div class="card mt-3">
        <div class="card-head" style="border:0;padding-bottom:0">
          <div class="tabs" data-tabs="lotes"><button class="tab active" data-name="hoje">Hoje <span class="badge badge-blue no-dot">9</span></button><button class="tab" data-name="hist">Histórico</button></div>
          <div class="row"><button class="btn btn-sm btn-ghost" data-toast="Lista atualizada" data-icon="refresh-cw"><i data-lucide="refresh-cw"></i>Atualizar</button></div>
        </div>
        <div class="toolbar" style="border-top:0">
          <div class="input-icon"><i data-lucide="search"></i><input class="input" placeholder="Buscar arquivo ou lote" data-filter="#tb-lotes"></div>
          <select class="select"><option>Todos os status</option><option>Concluído</option><option>Processando</option><option>Validando</option></select>
          <input class="input" type="date" value="2026-10-08" style="width:auto">
        </div>
        <div data-pane="lotes" data-name="hoje" class="table-wrap"><table class="table" id="tb-lotes">
          <thead><tr><th>Arquivo</th><th>Distribuidora</th><th>Recebido</th><th class="num">Registros</th><th class="num">Inclusões</th><th class="num">Exclusões</th><th class="num">Rejeitados</th><th>Status</th><th></th></tr></thead>
          <tbody>${DB.lotes.map(loteRow).join('')}</tbody>
        </table></div>
        <div data-pane="lotes" data-name="hist" class="table-wrap hide"><table class="table">
          <thead><tr><th>Arquivo</th><th>Distribuidora</th><th>Recebido</th><th class="num">Registros</th><th class="num">Inclusões</th><th class="num">Exclusões</th><th class="num">Rejeitados</th><th>Status</th><th></th></tr></thead>
          <tbody>${DB.historicoLotes.map(loteRow).join('')}</tbody>
        </table></div>
      </div>`,
    mount(el) {
      $('#btn-upload').addEventListener('click', uploadModal);
      $('#btn-sftp').addEventListener('click', () => modal(`
        <div class="modal-head"><div><h3>Conexão SFTP · SAP CCS</h3><p>Credenciais e janelas de recepção</p></div>${closeBtn}</div>
        <div class="modal-body"><div class="form-grid">
          <div class="field span-2"><label>Host</label><input class="input mono" value="sftp.previnity.com.br/cpfl/inbound"></div>
          <div class="field"><label>Usuário</label><input class="input" value="svc-cpfl-sapccs"></div>
          <div class="field"><label>Autenticação</label><select class="select"><option>Chave SSH (RSA 4096)</option><option>Senha + IP allowlist</option></select></div>
          <div class="field"><label>Janela de recepção</label><input class="input" value="00:00 – 06:00"></div>
          <div class="field"><label>Retorno SAP CCS</label><input class="input" value="Diário às 18:00"></div>
          <label class="check span-2"><input type="checkbox" checked> Criptografia PGP dos arquivos</label>
        </div></div>
        <div class="modal-foot"><button class="btn btn-outline" data-toast="Conexão testada com sucesso · latência 38 ms" data-icon="plug-zap">Testar conexão</button><button class="btn btn-primary" data-toast="Configuração salva" data-close-after>Salvar</button></div>`));
      const all = [...DB.lotes, ...DB.historicoLotes];
      el.addEventListener('click', e => { const r = e.target.closest('[data-lote]'); if (r) loteDrawer(all.find(l => l.lote === r.dataset.lote)); });
      bindFilters(el);
    },
  };

  function bindFilters(el) {
    $$('[data-filter]', el).forEach(inp => inp.addEventListener('input', () => {
      const t = inp.value.toLowerCase();
      $$(inp.dataset.filter + ' tbody tr').forEach(r => r.classList.toggle('hide', t && !r.textContent.toLowerCase().includes(t)));
    }));
  }
  window.bindFilters = bindFilters;

  /* ============================ NEGATIVAÇÕES ============================ */
  function negDrawer(c) {
    drawer(`
      <div class="drawer-head">
        <div class="row"><span class="avatar ${c.pj ? 'violet' : ''}" style="width:44px;height:44px;font-size:14px">${initials(c.nome)}</span><div><h3 style="font-size:17px">${c.nome}</h3><p class="small muted">${c.doc} · ${c.pj ? 'Pessoa jurídica' : 'Pessoa física'}</p></div></div>${closeBtn}
      </div>
      <div class="drawer-body">
        <div class="row-between"><span>${statusBadge(c.status)}</span><span class="small muted mono">${c.id}</span></div>
        <div class="dl mt-3">
          <div><span>Unidade consumidora</span><strong>${c.uc}</strong></div>
          <div><span>Distribuidora</span><strong>${c.dist}</strong></div>
          <div><span>Valor negativado</span><strong>${money(c.valor)}</strong></div>
          <div><span>Faturas em aberto</span><strong>${c.faturas} fatura(s)</strong></div>
          <div><span>Maior atraso</span><strong>${c.atraso} dias</strong></div>
          <div><span>Município</span><strong>${c.cidade}</strong></div>
          <div><span>Protocolo bureau</span><strong class="mono">${c.protocolo}</strong></div>
          <div><span>Canal de comunicação</span><strong>${c.canal}</strong></div>
        </div>
        <h4 class="mt-4" style="font-size:14px">Histórico de comandos</h4>
        <div class="timeline mt-2">
          <div class="tl-item ok"><span class="tl-dot"><i data-lucide="check"></i></span><strong>Recebido no lote LT-88410</strong><span class="sub">${c.data} 05:12 · SAP CCS</span></div>
          <div class="tl-item ok"><span class="tl-dot"><i data-lucide="check"></i></span><strong>Comunicado de inclusão enviado</strong><span class="sub">${c.canal} · entregue e lido · prazo legal iniciado</span></div>
          <div class="tl-item ok"><span class="tl-dot"><i data-lucide="check"></i></span><strong>Comando INCLUSÃO enviado à QUOD</strong><span class="sub">Após prazo de comunicação · ${c.data} 10:00</span></div>
          <div class="tl-item ${c.status === 'Rejeitado' ? 'fail' : 'ok'}"><span class="tl-dot"><i data-lucide="${c.status === 'Rejeitado' ? 'x' : 'check'}"></i></span><strong>Retorno bureau · código ${c.status === 'Rejeitado' ? '17 (endereço inválido)' : '00 (sucesso)'}</strong><span class="sub">${c.data} 13:41</span></div>
          ${c.status === 'Excluído' ? `<div class="tl-item ok"><span class="tl-dot"><i data-lucide="check"></i></span><strong>Comando EXCLUSÃO · pagamento confirmado</strong><span class="sub">Baixa em até 1 dia útil após a quitação</span></div>` : ''}
        </div>
        <h4 class="mt-4" style="font-size:14px">Resposta do bureau</h4>
        <pre class="mono mt-1" style="background:var(--navy);color:#b9f5df;padding:14px;border-radius:12px;overflow:auto;font-size:12px;margin-bottom:0">{
  "protocolo": "${c.protocolo}",
  "comando": "INCLUSAO",
  "documento": "${c.doc}",
  "credor": "CPFL ENERGIA S.A.",
  "valor": ${c.valor.toFixed(2)},
  "codigo_retorno": "${c.status === 'Rejeitado' ? '17' : '00'}",
  "mensagem": "${c.status === 'Rejeitado' ? 'ENDERECO INVALIDO' : 'REGISTRO EFETUADO'}"
}</pre>
      </div>
      <div class="drawer-foot">
        <a class="btn btn-outline" href="#/carta-espelho" data-close><i data-lucide="file-check-2"></i>Carta espelho</a>
        <button class="btn btn-danger" id="btn-excl"><i data-lucide="file-minus-2"></i>Solicitar exclusão</button>
      </div>`);
    $('#btn-excl').addEventListener('click', () => modal(`
      <div class="modal-head"><div><h3>Solicitar exclusão</h3><p>${c.nome} · UC ${c.uc}</p></div>${closeBtn}</div>
      <div class="modal-body stack" style="gap:14px">
        <div class="field"><label>Motivo</label><select class="select"><option>Pagamento confirmado</option><option>Acordo formalizado</option><option>Contestação procedente</option><option>Determinação judicial</option><option>Erro operacional</option></select></div>
        <div class="field"><label>Observação</label><textarea class="textarea" placeholder="Descreva o motivo e anexe evidências, se houver"></textarea></div>
        <div class="banner" style="padding:14px 16px;background:var(--warn-50);color:#92400e"><i data-lucide="info"></i><span class="small">A exclusão é enviada ao bureau na próxima janela e registrada na trilha de auditoria.</span></div>
      </div>
      <div class="modal-foot"><button class="btn btn-ghost" data-close>Cancelar</button><button class="btn btn-primary" data-toast="Exclusão enviada para a fila do bureau" data-close-after>Confirmar exclusão</button></div>`));
  }

  VIEWS.negativacoes = {
    title: 'Inclusões e exclusões',
    render: () => {
      const counts = s => DB.clientes.filter(c => !s || c.status === s).length;
      return `
      ${pageHead('Negativação', 'Inclusões, exclusões e retornos', 'Pesquisa de registros, histórico de comandos e respostas do bureau',
        `<button class="btn btn-outline" data-toast="Exportação iniciada · você receberá o arquivo por e-mail" data-icon="file-down"><i data-lucide="download"></i>Exportar</button>
         <button class="btn btn-primary" id="btn-manual"><i data-lucide="plus"></i>Comando manual</button>`)}
      <div class="grid g-4">
        ${kpi({ icon: 'file-plus-2', label: 'Inclusões hoje', value: '41.208', trend: '+2,8%' })}
        ${kpi({ icon: 'file-minus-2', color: 'green', label: 'Exclusões hoje', value: '9.874', trend: '+6,1%', foot: 'Por pagamento: 8.912 · acordo: 962' })}
        ${kpi({ icon: 'circle-x', color: 'danger', label: 'Rejeitados pelo bureau', value: '312', trend: '0,7%', up: false })}
        ${kpi({ icon: 'zap', color: 'violet', label: 'Tempo médio de retorno', value: '3h 41m', foot: 'Janela: 10:00 → 13:41' })}
      </div>
      <div class="card mt-3">
        <div class="card-head" style="border:0;padding-bottom:6px">
          <div class="tabs" data-tabs id="neg-tabs">
            <button class="tab active" data-s="">Todos <span class="badge no-dot">${counts()}</span></button>
            <button class="tab" data-s="Incluído">Incluídos <span class="badge badge-blue no-dot">${counts('Incluído')}</span></button>
            <button class="tab" data-s="Excluído">Excluídos <span class="badge no-dot">${counts('Excluído')}</span></button>
            <button class="tab" data-s="Pendente">Pendentes <span class="badge badge-warn no-dot">${counts('Pendente')}</span></button>
            <button class="tab" data-s="Rejeitado">Rejeitados <span class="badge badge-danger no-dot">${counts('Rejeitado')}</span></button>
          </div>
        </div>
        <div class="toolbar">
          <div class="input-icon"><i data-lucide="search"></i><input class="input" placeholder="Nome, CPF/CNPJ, UC ou protocolo" data-filter="#tb-neg"></div>
          <select class="select"><option>Todas as distribuidoras</option>${DB.distribuidoras.map(d => `<option>${d.nome}</option>`).join('')}</select>
          <select class="select"><option>PF e PJ</option><option>Pessoa física</option><option>Pessoa jurídica</option></select>
          <select class="select"><option>Últimos 7 dias</option><option>Hoje</option><option>Últimos 30 dias</option><option>Personalizado</option></select>
        </div>
        <div class="table-wrap"><table class="table" id="tb-neg">
          <thead><tr><th>Consumidor</th><th>UC</th><th>Distribuidora</th><th class="num">Valor</th><th class="num">Atraso</th><th>Status</th><th>Data</th><th></th></tr></thead>
          <tbody>${DB.clientes.map(c => `
            <tr class="clickable" data-id="${c.id}" data-status="${c.status}">
              <td>${userCell(c.nome, c.doc, c.pj)}</td>
              <td class="mono">${c.uc}</td><td>${c.dist}</td>
              <td class="num strong">${money(c.valor)}</td><td class="num">${c.atraso} d</td>
              <td>${statusBadge(c.status)}</td><td class="small muted">${c.data}</td>
              <td><button class="btn btn-ghost btn-icon btn-sm"><i data-lucide="chevron-right"></i></button></td>
            </tr>`).join('')}</tbody>
        </table></div>
        <div class="card-foot"><span>Exibindo 1–${DB.clientes.length} de 1.284.112 registros</span><div class="pager"><button>‹</button><button class="active">1</button><button>2</button><button>3</button><button>…</button><button>›</button></div></div>
      </div>`;
    },
    mount(el) {
      bindFilters(el);
      el.addEventListener('click', e => {
        const r = e.target.closest('tr[data-id]');
        if (r) negDrawer(DB.clientes.find(c => c.id === r.dataset.id));
        const t = e.target.closest('#neg-tabs .tab');
        if (t) $$('#tb-neg tbody tr').forEach(row => row.classList.toggle('hide', t.dataset.s && row.dataset.status !== t.dataset.s));
      });
      $('#btn-manual').addEventListener('click', () => modal(`
        <div class="modal-head"><div><h3>Comando manual</h3><p>Inclusão ou exclusão pontual · requer perfil Gestor</p></div>${closeBtn}</div>
        <div class="modal-body stack" style="gap:16px">
          <div class="grid g-2" data-options style="gap:12px">
            <div class="option-card selected"><span class="ico-box"><i data-lucide="file-plus-2"></i></span><div><strong>Inclusão</strong><p>Negativar débito elegível</p></div></div>
            <div class="option-card"><span class="ico-box green"><i data-lucide="file-minus-2"></i></span><div><strong>Exclusão</strong><p>Retirar apontamento</p></div></div>
          </div>
          <div class="form-grid">
            <div class="field"><label>CPF/CNPJ</label><input class="input" placeholder="000.000.000-00"></div>
            <div class="field"><label>Unidade consumidora</label><input class="input" placeholder="Nº da UC"></div>
            <div class="field"><label>Distribuidora</label><select class="select">${DB.distribuidoras.map(d => `<option>${d.nome}</option>`).join('')}</select></div>
            <div class="field"><label>Valor (R$)</label><input class="input" placeholder="0,00"></div>
            <div class="field span-2"><label>Justificativa</label><textarea class="textarea" placeholder="Obrigatória para auditoria"></textarea></div>
          </div>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" data-close>Cancelar</button><button class="btn btn-primary" data-toast="Comando registrado e enviado para aprovação" data-close-after>Enviar para aprovação</button></div>`));
    },
  };

  /* ============================ COMUNICAÇÕES ============================ */
  const stepChip = s => {
    const bad = ['Não entregue', 'Bounce'].includes(s.status);
    return `<span class="badge ${bad ? 'badge-danger' : 'badge-green'} no-dot" title="${s.status} · ${s.hora}"><i data-lucide="${channelIcon(s.canal)}" style="width:13px;height:13px"></i>${s.canal}</span>`;
  };

  VIEWS.comunicacoes = {
    title: 'Comunicações',
    render: () => `
      ${pageHead('Negativação', 'Comunicações e transbordo', 'WhatsApp verificado como canal principal, transbordo para e-mail e carta como última tentativa',
        `<button class="btn btn-outline" id="btn-tpl"><i data-lucide="layout-template"></i>Templates</button><a class="btn btn-primary" href="#/carta-espelho"><i data-lucide="file-check-2"></i>Carta espelho</a>`)}

      <div class="card">
        <div class="card-head"><div><h3>Cascata de comunicação · hoje</h3><p>Comunicado de inclusão enviado no 1º dia útil após o recebimento dos arquivos</p></div><span class="badge badge-green">Em execução</span></div>
        <div class="card-body">
          <div class="cascade">
            <div class="cascade-item">
              <div class="row"><span class="ico-box wa"><i data-lucide="message-circle"></i></span><div><strong class="strong">1 · WhatsApp verificado</strong><div class="small muted">100% da base elegível ao canal</div></div></div>
              <div class="kpi-value">41.364</div><div class="small muted">envios · <b class="text-green">92,4% entregues</b> · 71% lidos</div>
              <div class="progress green thin mt-2"><span style="width:92%"></span></div>
              <span class="cascade-arrow"><i data-lucide="chevron-right"></i></span>
            </div>
            <div class="cascade-item">
              <div class="row"><span class="ico-box"><i data-lucide="mail"></i></span><div><strong class="strong">2 · E-mail</strong><div class="small muted">Transbordo de não entregues</div></div></div>
              <div class="kpi-value">3.144</div><div class="small muted">transbordos · <b class="text-green">81,2% entregues</b> · 38% abertos</div>
              <div class="progress thin mt-2"><span style="width:81%"></span></div>
              <span class="cascade-arrow"><i data-lucide="chevron-right"></i></span>
            </div>
            <div class="cascade-item">
              <div class="row"><span class="ico-box warn"><i data-lucide="mail-open"></i></span><div><strong class="strong">3 · Carta</strong><div class="small muted">Última tentativa · AR digital</div></div></div>
              <div class="kpi-value">591</div><div class="small muted">cartas postadas · <b>D+1 útil</b></div>
              <div class="progress warn thin mt-2"><span style="width:100%"></span></div>
            </div>
          </div>
          <div class="row mt-3 wrap" style="gap:16px;padding:14px 16px;border-radius:12px;background:var(--violet-50)">
            <span class="ico-box violet"><i data-lucide="smartphone"></i></span>
            <div style="flex:1;min-width:220px"><strong class="strong">SMS · canal complementar</strong><div class="small muted">Utilizado em campanhas e lembretes conforme estratégia aprovada pela CPFL. Não faz parte obrigatória da cascata.</div></div>
            <div class="row" style="gap:6px"><span class="strong">18.220</span><span class="small muted">envios hoje</span></div>
          </div>
        </div>
      </div>

      <div class="grid g-main mt-3">
        <div class="card">
          <div class="card-head"><div><h3>Entregabilidade por canal</h3><p>Últimos 14 dias</p></div><div class="legend"><span><i style="background:${palette.blue}"></i>WhatsApp</span><span><i style="background:${palette.green}"></i>E-mail</span><span><i style="background:${palette.warn}"></i>Carta</span></div></div>
          <div class="card-body"><div class="chart-box"><canvas id="ch-ent"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-head"><div><h3>Pré-visualização</h3><p>Template de inclusão · WhatsApp</p></div></div>
          <div class="card-body">
            <div class="wa-phone">
              <div class="wa-bubble"><b>CPFL Energia ✔</b><br><br>Olá, <b>Ana Paula</b>. Identificamos débito em aberto na UC <b>4821****</b> no valor de <b>R$ 486,20</b>.<br><br>Caso não seja regularizado em até 10 dias, seu CPF poderá ser incluído em cadastro de inadimplentes, conforme Resolução ANEEL nº 1.000/2021.
                <div class="time">07:02 <i data-lucide="check-check"></i></div>
                <a class="btn-wa" href="negociar" target="_blank">Negociar agora</a><a class="btn-wa" href="#">Ver fatura</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card mt-3">
        <div class="toolbar">
          <div class="input-icon"><i data-lucide="search"></i><input class="input" placeholder="Buscar consumidor, UC ou ID" data-filter="#tb-com"></div>
          <div class="chip-group" data-single><button class="chip active">Todos</button><button class="chip"><i data-lucide="message-circle"></i>WhatsApp</button><button class="chip"><i data-lucide="mail"></i>E-mail</button><button class="chip"><i data-lucide="mail-open"></i>Carta</button><button class="chip"><i data-lucide="smartphone"></i>SMS</button></div>
        </div>
        <div class="table-wrap"><table class="table" id="tb-com">
          <thead><tr><th>Consumidor</th><th>Tipo</th><th>Trajetória</th><th>Status final</th><th>Data</th><th></th></tr></thead>
          <tbody>${DB.comunicacoes.map(c => `
            <tr class="clickable" onclick="location.hash='#/carta-espelho'">
              <td>${userCell(c.cliente, `${c.doc} · ${c.dist}`)}</td>
              <td class="small">${c.tipo}</td>
              <td><div class="row" style="gap:4px;flex-wrap:wrap">${c.steps.map(stepChip).join('<i data-lucide="chevron-right" style="width:14px;height:14px;color:var(--subtle)"></i>')}</div></td>
              <td>${statusBadge(c.final.status)}</td><td class="small muted">${c.data}</td>
              <td><button class="btn btn-ghost btn-sm">Evidência</button></td>
            </tr>`).join('')}</tbody>
        </table></div>
      </div>`,
    mount(el) {
      bindFilters(el);
      const days = Array.from({ length: 14 }, (_, i) => `${String(25 + i > 30 ? i - 5 : 25 + i).padStart(2, '0')}/${25 + i > 30 ? '10' : '09'}`);
      chart($('#ch-ent'), {
        type: 'bar',
        data: { labels: days, datasets: [
          { label: 'WhatsApp', data: days.map(() => 36000 + Math.random() * 7000), backgroundColor: palette.blue, borderRadius: 4, stack: 's' },
          { label: 'E-mail', data: days.map(() => 2500 + Math.random() * 1200), backgroundColor: palette.green, borderRadius: 4, stack: 's' },
          { label: 'Carta', data: days.map(() => 400 + Math.random() * 300), backgroundColor: palette.warn, borderRadius: 4, stack: 's' },
        ] },
        options: { scales: { ...gridScales({ yTicks: { callback: v => compact(v) } }), x: { stacked: true, grid: { display: false }, border: { display: false } }, y: { stacked: true, grid: { color: '#eef1f6' }, border: { display: false }, ticks: { callback: v => compact(v) } } } },
      });
      $('#btn-tpl').addEventListener('click', () => modal(`
        <div class="modal-head"><div><h3>Templates de mensagem</h3><p>Modelos aprovados pela CPFL e homologados na Meta</p></div>${closeBtn}</div>
        <div class="modal-body"><div class="list">
          ${[['Comunicado de inclusão', 'WhatsApp', 'Aprovado'], ['Comunicado de inclusão', 'E-mail', 'Aprovado'], ['Carta de inclusão (AR)', 'Carta', 'Aprovado'], ['2º comunicado · melhor endereço', 'Carta', 'Aprovado'], ['Oferta feirão de quitação', 'SMS', 'Em revisão'], ['Lembrete de parcela do acordo', 'WhatsApp', 'Aprovado']].map(([n, c, s]) => `
            <div class="list-item"><span class="ico-box"><i data-lucide="${channelIcon(c)}"></i></span><div class="grow"><strong>${n}</strong><span class="sub">${c} · atualizado em 01/10/2026</span></div>${statusBadge(s === 'Aprovado' ? 'Ativo' : 'Pendente')}<button class="btn btn-ghost btn-sm" data-toast="Editor de template aberto">Editar</button></div>`).join('')}
        </div></div>
        <div class="modal-foot"><button class="btn btn-primary" data-toast="Novo template criado como rascunho" data-close-after><i data-lucide="plus"></i>Novo template</button></div>`));
    },
  };

  /* ============================ CARTA ESPELHO ============================ */
  VIEWS['carta-espelho'] = {
    title: 'Carta espelho',
    render: () => {
      const c = DB.clientes[0];
      return `
      ${pageHead('Negativação', 'Carta espelho e evidências', 'Consulta das evidências dos comunicados de negativação para auditoria e atendimento',
        `<button class="btn btn-outline" data-toast="Pacote de evidências (.zip) em preparação · 120 registros" data-icon="archive"><i data-lucide="archive"></i>Download em lote</button>`)}
      <div class="grid" style="grid-template-columns:minmax(0,360px) minmax(0,1fr)" id="ce-grid">
        <div class="card" style="align-self:start">
          <div class="card-body stack" style="gap:12px">
            <div class="input-icon"><i data-lucide="search"></i><input class="input" placeholder="CPF/CNPJ, UC ou protocolo" data-filter="#ce-list"></div>
            <div class="row"><input class="input" type="date" value="2026-10-01"><input class="input" type="date" value="2026-10-08"></div>
          </div>
          <div id="ce-list" style="max-height:620px;overflow:auto;border-top:1px solid var(--border)">
            <table class="table" style="min-width:0"><tbody>
              ${DB.clientes.slice(0, 14).map((x, i) => `
                <tr class="clickable ${i === 0 ? 'sel' : ''}" data-i="${i}" style="${i === 0 ? 'background:var(--blue-50)' : ''}">
                  <td>${userCell(x.nome, `UC ${x.uc} · ${x.data}`, x.pj)}</td>
                  <td class="num"><span class="ico-box ${x.canal === 'WhatsApp' ? 'wa' : x.canal === 'Carta' ? 'warn' : ''}" style="width:28px;height:28px;margin-left:auto"><i data-lucide="${channelIcon(x.canal)}" style="width:14px;height:14px"></i></span></td>
                </tr>`).join('')}
            </tbody></table>
          </div>
        </div>
        <div class="card">
          <div class="card-head">
            <div><h3 id="ce-nome">${c.nome}</h3><p id="ce-sub">${c.doc} · UC ${c.uc} · ${c.dist}</p></div>
            <div class="row"><button class="btn btn-sm btn-outline" data-toast="Evidência enviada para impressão" data-icon="printer"><i data-lucide="printer"></i></button><button class="btn btn-sm btn-primary" data-toast="Carta espelho baixada (PDF assinado)" data-icon="file-down"><i data-lucide="download"></i>PDF</button></div>
          </div>
          <div class="tabs-line" data-tabs="ce"><button class="tab active" data-name="carta">Carta espelho</button><button class="tab" data-name="wa">WhatsApp</button><button class="tab" data-name="email">E-mail</button><button class="tab" data-name="trilha">Trilha de entrega</button></div>
          <div class="card-body" style="background:var(--surface-2)">
            <div data-pane="ce" data-name="carta">
              <div class="letter" style="max-width:720px;margin:0 auto">
                <span class="stamp">EVIDÊNCIA · ENTREGUE</span>
                <div class="row-between" style="align-items:flex-start"><div><strong style="font-size:15px;color:#0a3d91">CPFL ENERGIA</strong><div style="font-size:11px;color:#777">Comunicado de inclusão em cadastro de inadimplentes</div></div></div>
                <p style="margin-top:22px">Campinas, 02 de outubro de 2026</p>
                <p style="margin-top:12px"><b id="ce-dest">${c.nome.toUpperCase()}</b><br>${c.doc}<br>Rua das Palmeiras, 1.204 – ${c.cidade}</p>
                <h4>Comunicado de débito</h4>
                <p>Prezado(a) cliente, informamos que constam em aberto as faturas abaixo referentes à Unidade Consumidora <b>${c.uc}</b>. Em cumprimento ao Código de Defesa do Consumidor (art. 43, §2º) e à Resolução ANEEL nº 1.000/2021, comunicamos que, não havendo a regularização no prazo de 10 (dez) dias a contar do recebimento, seus dados poderão ser incluídos em cadastro de proteção ao crédito.</p>
                <table><thead><tr><th>Referência</th><th>Vencimento</th><th>Valor</th></tr></thead><tbody>
                  <tr><td>06/2026</td><td>15/07/2026</td><td>R$ 162,40</td></tr><tr><td>07/2026</td><td>15/08/2026</td><td>R$ 158,90</td></tr><tr><td>08/2026</td><td>15/09/2026</td><td>R$ 164,90</td></tr>
                </tbody></table>
                <p>Para negociar com condições especiais, acesse <b>negocie.cpfl.com.br</b> ou utilize o QR Code. Caso o pagamento já tenha sido efetuado, desconsidere este comunicado.</p>
                <p style="margin-top:20px;font-size:11px;color:#888">Protocolo ${c.protocolo} · Carta gerada pela plataforma PREVINITY · Postagem 02/10/2026 · AR digital nº BR${c.uc}SP</p>
              </div>
            </div>
            <div data-pane="ce" data-name="wa" class="hide"><div class="wa-phone" style="max-width:420px;margin:0 auto">
              <div class="wa-bubble"><b>CPFL Energia ✔</b><br><br>Olá! Identificamos débito em aberto na UC <b>${c.uc.slice(0, 4)}****</b> no valor de <b>${money(c.valor)}</b>. Regularize em até 10 dias para evitar a inclusão do seu CPF em cadastro de inadimplentes.<div class="time">02/10 07:02 <i data-lucide="check-check"></i></div><a class="btn-wa">Negociar agora</a></div>
            </div><p class="small muted mt-2" style="text-align:center">Entregue 07:02:14 · Lido 07:18:40 · ID Meta wamid.HBgM${c.uc}</p></div>
            <div data-pane="ce" data-name="email" class="hide"><div class="letter" style="max-width:640px;margin:0 auto"><div class="small muted">De: CPFL Energia &lt;comunicados@cpfl.com.br&gt;<br>Assunto: Comunicado de débito · UC ${c.uc}</div><hr style="border:0;border-top:1px solid #eee;margin:14px 0"><p>Prezado(a) ${c.nome.split(' ')[0]}, consta débito de <b>${money(c.valor)}</b>...</p><p class="mt-2" style="font-size:11px;color:#888">Status: não utilizado (comunicação entregue via WhatsApp)</p></div></div>
            <div data-pane="ce" data-name="trilha" class="hide"><div class="card card-pad" style="max-width:640px;margin:0 auto"><div class="timeline">
              <div class="tl-item ok"><span class="tl-dot"><i data-lucide="check"></i></span><strong>Comunicado gerado</strong><span class="sub">02/10/2026 06:40 · template v3 aprovado</span></div>
              <div class="tl-item ok"><span class="tl-dot"><i data-lucide="check"></i></span><strong>WhatsApp entregue</strong><span class="sub">02/10/2026 07:02 · número verificado</span></div>
              <div class="tl-item ok"><span class="tl-dot"><i data-lucide="check"></i></span><strong>WhatsApp lido</strong><span class="sub">02/10/2026 07:18</span></div>
              <div class="tl-item ok"><span class="tl-dot"><i data-lucide="check"></i></span><strong>Prazo de 10 dias concluído</strong><span class="sub">12/10/2026 · apto para inclusão</span></div>
              <div class="tl-item pending"><span class="tl-dot"><i data-lucide="clock"></i></span><strong>Inclusão no bureau</strong><span class="sub">Agendada</span></div>
            </div></div></div>
          </div>
        </div>
      </div>`;
    },
    mount(el) {
      bindFilters(el);
      const mq = matchMedia('(max-width: 1080px)');
      const setCols = () => { $('#ce-grid').style.gridTemplateColumns = mq.matches ? 'minmax(0,1fr)' : 'minmax(0,360px) minmax(0,1fr)'; };
      setCols(); mq.addEventListener('change', setCols);
      el.addEventListener('click', e => {
        const r = e.target.closest('tr[data-i]');
        if (!r) return;
        const c = DB.clientes[+r.dataset.i];
        $$('#ce-list tr').forEach(x => x.style.background = '');
        r.style.background = 'var(--blue-50)';
        $('#ce-nome').textContent = c.nome;
        $('#ce-sub').textContent = `${c.doc} · UC ${c.uc} · ${c.dist}`;
        $('#ce-dest').textContent = c.nome.toUpperCase();
      });
    },
  };
})();
