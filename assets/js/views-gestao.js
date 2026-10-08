(function () {
  const { $, $$, money, num, compact, chart, palette, gridScales, statusBadge, modal, closeBtn, toast } = UI;
  const { pageHead, kpi } = H;

  /* ============================ RELATÓRIOS ============================ */
  const reports = [
    ['file-x-2', '', 'Negativações', 'Inclusões, exclusões, rejeições e retornos do bureau por distribuidora'],
    ['send', 'violet', 'Entregabilidade por canal', 'WhatsApp, e-mail, carta e SMS · envios, entregas, leituras e transbordo'],
    ['handshake', 'green', 'Negociações e acordos', 'Acordos formalizados, valores recuperados, quebras e conversão'],
    ['megaphone', 'warn', 'Campanhas', 'Público impactado, acessos, conversão e recuperação por campanha'],
    ['badge-dollar-sign', 'green', 'Remuneração por sucesso', 'Apuração por idade da fatura paga conforme proposta comercial'],
    ['user-round-search', '', 'Enriquecimento cadastral', 'Solicitações, campos retornados e taxas de localização'],
    ['timer', 'violet', 'Níveis de serviço (SLA)', 'Prazos de processamento, comunicação D+1 útil e disponibilidade'],
    ['file-check-2', 'warn', 'Evidências para auditoria', 'Cartas espelho, logs e comprovantes de entrega por período'],
  ];

  VIEWS.relatorios = {
    title: 'Relatórios',
    render: () => `
      ${pageHead('Gestão', 'Relatórios e indicadores', 'Acompanhamento por distribuidora, exportação e agendamento de envios',
        `<button class="btn btn-outline" id="btn-agendar"><i data-lucide="calendar-clock"></i>Agendar envio</button><button class="btn btn-primary" data-toast="Relatório consolidado gerado (.xlsx)" data-icon="file-down"><i data-lucide="download"></i>Exportar consolidado</button>`)}
      <div class="card card-pad">
        <div class="row wrap" style="gap:12px">
          <div class="field" style="min-width:200px;flex:1"><label>Período</label><select class="select"><option>Outubro/2026 (parcial)</option><option>Setembro/2026</option><option>3º trimestre 2026</option><option>Personalizado</option></select></div>
          <div class="field" style="min-width:200px;flex:1"><label>Distribuidora</label><select class="select"><option>Todas</option>${DB.distribuidoras.map(d => `<option>${d.cod} · ${d.nome}</option>`).join('')}</select></div>
          <div class="field" style="min-width:200px;flex:1"><label>Tipo de pessoa</label><select class="select"><option>PF e PJ</option><option>PF</option><option>PJ</option></select></div>
          <div class="field" style="min-width:160px"><label>&nbsp;</label><button class="btn btn-dark" data-toast="Filtros aplicados" data-icon="filter"><i data-lucide="filter"></i>Aplicar</button></div>
        </div>
      </div>

      <div class="grid g-4 mt-3">${reports.map(([i, c, t, d]) => `
        <div class="card card-pad" style="display:flex;flex-direction:column;gap:10px">
          <span class="ico-box ${c}"><i data-lucide="${i}"></i></span>
          <strong class="strong">${t}</strong><p class="small muted" style="flex:1">${d}</p>
          <div class="row" style="gap:6px"><button class="btn btn-sm btn-outline" data-toast="${t}: visualização aberta" data-icon="eye"><i data-lucide="eye"></i>Ver</button><button class="btn btn-sm btn-ghost" data-toast="${t} exportado (.xlsx)" data-icon="file-down"><i data-lucide="download"></i>Exportar</button></div>
        </div>`).join('')}
      </div>

      <div class="grid g-2 mt-3">
        <div class="card">
          <div class="card-head"><div><h3>Negativações confirmadas x falhas</h3><p>Por distribuidora · mês corrente</p></div></div>
          <div class="card-body"><div class="chart-box"><canvas id="ch-dist-neg"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-head"><div><h3>Remuneração por sucesso · apuração</h3><p>Valores pagos por idade da fatura (base de cálculo)</p></div></div>
          <div class="table-wrap"><table class="table" style="min-width:0">
            <thead><tr><th>Idade da fatura paga</th><th class="num">Acordos pagos</th><th class="num">Valor pago</th><th class="num">Participação</th></tr></thead>
            <tbody>${[['31–90 dias', 15_420, 9_812_400], ['91–180 dias', 9_880, 6_402_100], ['181–360 dias', 5_610, 4_218_300], ['1–2 anos', 2_710, 2_688_900], ['> 2 anos', 1_270, 1_478_300]].map(([f, q, v]) => `<tr><td class="strong">${f}</td><td class="num">${num(q)}</td><td class="num strong">${money(v, 0)}</td><td class="num">${(v / 246000).toFixed(1).replace('.', ',')}%</td></tr>`).join('')}
            <tr style="background:var(--surface-2)"><td class="strong">Total</td><td class="num strong">34.890</td><td class="num strong">R$ 24.600.000</td><td class="num strong">100%</td></tr></tbody>
          </table></div>
          <div class="card-foot"><span>Percentuais de remuneração conforme proposta comercial</span></div>
        </div>
      </div>

      <div class="card mt-3">
        <div class="card-head"><div><h3>Volumetria contratual de referência</h3><p>Documento 05 – Especificação Técnica · 48 meses · consumo acumulado</p></div><span class="badge badge-blue no-dot">Mês 1 de 48</span></div>
        <div class="table-wrap"><table class="table">
          <thead><tr><th>Serviço</th><th class="num">48 meses</th><th class="num">Por dia (ref.)</th><th class="num">Realizado no mês</th><th style="width:240px">Consumo do mês x referência</th></tr></thead>
          <tbody>${DB.volumetria.map(([s, t, d], i) => { const pct = [96, 88, 104, 72, 61, 80, 93, 110, 50][i]; const real = Math.round(d * 30 * pct / 100); return `
            <tr><td class="strong">${s}</td><td class="num">${num(t)}</td><td class="num">${num(d)}</td><td class="num strong">${num(real)}</td>
            <td><div class="row"><div class="progress thin ${pct > 100 ? 'warn' : 'green'}" style="flex:1"><span style="width:${Math.min(pct, 100)}%"></span></div><span class="small strong" style="width:44px;text-align:right">${pct}%</span></div></td></tr>`; }).join('')}</tbody>
        </table></div>
        <div class="card-foot"><span>Volumes estimativos para dimensionamento, sem garantia de consumo mínimo. SMS sem quantitativo individualizado.</span></div>
      </div>`,
    mount() {
      chart($('#ch-dist-neg'), {
        type: 'bar',
        data: { labels: ['Paulista', 'Piratininga', 'Santa Cruz', 'Jaguari', 'Mococa', 'Leste P.', 'Sul P.', 'RGE', 'RGE Sul'], datasets: [
          { label: 'Confirmadas', data: [482, 196, 54, 6, 5, 7, 9, 171, 148].map(v => v * 1000), backgroundColor: palette.blue, borderRadius: 6, stack: 'a' },
          { label: 'Falhas', data: [3.1, 1.4, .5, .1, .1, .1, .2, 1.2, 1.1].map(v => v * 1000), backgroundColor: palette.danger, borderRadius: 6, stack: 'a' },
        ] },
        options: { scales: { x: { stacked: true, grid: { display: false }, border: { display: false } }, y: { stacked: true, grid: { color: '#eef1f6' }, border: { display: false }, ticks: { callback: v => compact(v) } } } },
      });
      $('#btn-agendar').addEventListener('click', () => modal(`
        <div class="modal-head"><div><h3>Agendar envio de relatório</h3><p>Entrega automática por e-mail ou SFTP</p></div>${closeBtn}</div>
        <div class="modal-body"><div class="form-grid">
          <div class="field span-2"><label>Relatórios</label><div class="chip-group" data-multi>${reports.slice(0, 6).map(([, , t], i) => `<button class="chip ${i < 3 ? 'active' : ''}">${t}</button>`).join('')}</div></div>
          <div class="field"><label>Frequência</label><select class="select"><option>Diária (08:00)</option><option>Semanal (segunda)</option><option>Mensal (dia 1)</option></select></div>
          <div class="field"><label>Formato</label><select class="select"><option>Excel (.xlsx)</option><option>CSV</option><option>PDF executivo</option></select></div>
          <div class="field span-2"><label>Destinatários</label><input class="input" value="cobranca@cpfl.com.br; diretoria.comercial@cpfl.com.br"></div>
        </div></div>
        <div class="modal-foot"><button class="btn btn-ghost" data-close>Cancelar</button><button class="btn btn-primary" data-toast="Agendamento criado" data-close-after>Agendar</button></div>`));
    },
  };

  /* ============================ AUDITORIA ============================ */
  const lvl = { info: ['badge-blue', 'Info'], ok: ['badge-green', 'Sucesso'], warn: ['badge-warn', 'Atenção'] };
  VIEWS.auditoria = {
    title: 'Auditoria e logs',
    render: () => `
      ${pageHead('Gestão', 'Auditoria e trilha de logs', 'Registros imutáveis de acessos, operações e evidências disponíveis para auditoria',
        `<button class="btn btn-outline" data-toast="Solicitação de auditoria registrada" data-icon="clipboard-check"><i data-lucide="clipboard-check"></i>Solicitar pacote de auditoria</button><button class="btn btn-primary" data-toast="Logs exportados (.csv assinado)" data-icon="file-down"><i data-lucide="download"></i>Exportar logs</button>`)}
      <div class="grid g-4">
        ${kpi({ icon: 'scroll-text', label: 'Eventos registrados (30d)', value: '18,4 mi' })}
        ${kpi({ icon: 'log-in', color: 'violet', label: 'Acessos de usuários', value: '1.284', foot: '100% com MFA' })}
        ${kpi({ icon: 'shield-alert', color: 'warn', label: 'Eventos de atenção', value: '37', foot: '0 incidentes de segurança' })}
        ${kpi({ icon: 'hard-drive', color: 'green', label: 'Retenção de evidências', value: '5 anos', foot: 'Armazenamento criptografado' })}
      </div>
      <div class="card mt-3">
        <div class="toolbar">
          <div class="input-icon"><i data-lucide="search"></i><input class="input" placeholder="Usuário, ação ou recurso" data-filter="#tb-aud"></div>
          <select class="select"><option>Todos os níveis</option><option>Info</option><option>Sucesso</option><option>Atenção</option></select>
          <select class="select"><option>Todos os usuários</option>${DB.usuarios.map(u => `<option>${u.nome}</option>`).join('')}</select>
          <select class="select"><option>Últimas 24 horas</option><option>Últimos 7 dias</option><option>Últimos 30 dias</option></select>
        </div>
        <div class="table-wrap"><table class="table" id="tb-aud">
          <thead><tr><th>Data/hora</th><th>Usuário</th><th>Ação</th><th>Recurso</th><th>IP</th><th>Nível</th></tr></thead>
          <tbody>${DB.auditoria.map(a => `<tr><td class="mono">${a.data}</td><td class="strong">${a.usuario}</td><td>${a.acao}</td><td class="small">${a.recurso}</td><td class="mono muted">${a.ip}</td><td><span class="badge ${lvl[a.nivel][0]}">${lvl[a.nivel][1]}</span></td></tr>`).join('')}</tbody>
        </table></div>
        <div class="card-foot"><span>Hash encadeado SHA-256 · integridade verificada às 08:00</span><div class="pager"><button>‹</button><button class="active">1</button><button>2</button><button>3</button><button>›</button></div></div>
      </div>
      <div class="grid g-3 mt-3">
        ${[['scale', 'Resolução ANEEL nº 1.000/2021', 'Prazos e conteúdo dos comunicados de inclusão observados em cada registro.'], ['shield-check', 'LGPD', 'Perfis de acesso, minimização, mascaramento em tela e registro de finalidade.'], ['file-search', 'CDC · art. 43', 'Comunicação prévia por escrito com evidência de entrega (carta espelho).']].map(([i, t, d]) => `
          <div class="card card-pad"><div class="row"><span class="ico-box green"><i data-lucide="${i}"></i></span><strong class="strong">${t}</strong></div><p class="small muted mt-2">${d}</p></div>`).join('')}
      </div>`,
    mount(el) { bindFilters(el); },
  };

  /* ============================ USUÁRIOS ============================ */
  const perms = ['Dashboard', 'Lotes e negativação', 'Comandos manuais', 'Comunicações', 'Negociações', 'Campanhas', 'Enriquecimento', 'Consultas', 'Relatórios', 'Auditoria', 'Usuários'];
  const perfis = { 'Administrador': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 'Gestor de cobrança': [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], 'Analista operacional': [1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0], 'Auditoria': [1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0], 'Consulta': [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0] };

  VIEWS.usuarios = {
    title: 'Usuários e acessos',
    render: () => `
      ${pageHead('Gestão', 'Usuários e perfis de acesso', 'Segregação por distribuidora e permissões por perfil, conforme requisitos de TI CPFL',
        `<button class="btn btn-primary" id="btn-convite"><i data-lucide="user-plus"></i>Convidar usuário</button>`)}
      <div class="tabs-line card" data-tabs="usr" style="border-radius:var(--radius-lg) var(--radius-lg) 0 0;border-bottom:0"><button class="tab active" data-name="u">Usuários</button><button class="tab" data-name="p">Perfis e permissões</button><button class="tab" data-name="s">Políticas de segurança</button></div>
      <div class="card" style="border-radius:0 0 var(--radius-lg) var(--radius-lg)">
        <div data-pane="usr" data-name="u">
          <div class="toolbar"><div class="input-icon"><i data-lucide="search"></i><input class="input" placeholder="Buscar usuário" data-filter="#tb-usr"></div></div>
          <div class="table-wrap"><table class="table" id="tb-usr">
            <thead><tr><th>Usuário</th><th>Perfil</th><th>Distribuidoras</th><th>Último acesso</th><th>MFA</th><th>Status</th><th></th></tr></thead>
            <tbody>${DB.usuarios.map(u => `<tr>
              <td><div class="cell-user"><span class="avatar ${u.cor}">${u.ini}</span><div><strong>${u.nome}</strong><span>${u.email}</span></div></div></td>
              <td><span class="badge no-dot ${u.perfil === 'Administrador' ? 'badge-dark' : ''}">${u.perfil}</span></td>
              <td>${u.dist}</td><td class="small muted">${u.ultimo}</td>
              <td><i data-lucide="${u.perfil === 'Conta de serviço' ? 'key-round' : 'shield-check'}" style="color:var(--green-700)"></i></td>
              <td>${statusBadge(u.status)}</td>
              <td><button class="btn btn-ghost btn-icon btn-sm" data-toast="Edição de usuário aberta" data-icon="user-cog"><i data-lucide="more-horizontal"></i></button></td></tr>`).join('')}</tbody>
          </table></div>
        </div>
        <div data-pane="usr" data-name="p" class="hide table-wrap">
          <table class="table">
            <thead><tr><th>Permissão</th>${Object.keys(perfis).map(p => `<th style="text-align:center">${p}</th>`).join('')}</tr></thead>
            <tbody>${perms.map((p, i) => `<tr><td class="strong">${p}</td>${Object.values(perfis).map(v => `<td style="text-align:center"><label class="switch"><input type="checkbox" ${v[i] ? 'checked' : ''}><span></span></label></td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>
        <div data-pane="usr" data-name="s" class="hide card-body">
          <div class="list">
            ${[['Autenticação em dois fatores obrigatória', 'Todos os usuários humanos', true], ['Expiração de sessão por inatividade', '15 minutos', true], ['Restrição por IP corporativo', 'Faixas 10.0.0.0/8 e VPN', true], ['Mascaramento de CPF/CNPJ em tela', 'Exibição parcial para perfis sem necessidade', true], ['Download de dados pessoais com aprovação', 'Exige justificativa e registro em auditoria', false]].map(([t, d, on]) => `
              <div class="list-item"><div class="grow"><strong>${t}</strong><span class="sub">${d}</span></div><label class="switch"><input type="checkbox" ${on ? 'checked' : ''}><span></span></label></div>`).join('')}
          </div>
        </div>
      </div>`,
    mount(el) {
      bindFilters(el);
      $('#btn-convite').addEventListener('click', () => modal(`
        <div class="modal-head"><div><h3>Convidar usuário</h3><p>O convite expira em 48 horas</p></div>${closeBtn}</div>
        <div class="modal-body"><div class="form-grid">
          <div class="field"><label>Nome completo</label><input class="input" placeholder="Nome"></div>
          <div class="field"><label>E-mail corporativo</label><input class="input" placeholder="nome@cpfl.com.br"></div>
          <div class="field"><label>Perfil</label><select class="select">${Object.keys(perfis).map(p => `<option>${p}</option>`).join('')}</select></div>
          <div class="field"><label>Distribuidoras</label><select class="select"><option>Todas</option>${DB.distribuidoras.map(d => `<option>${d.nome}</option>`).join('')}</select></div>
        </div></div>
        <div class="modal-foot"><button class="btn btn-ghost" data-close>Cancelar</button><button class="btn btn-primary" data-toast="Convite enviado" data-icon="mail-check" data-close-after>Enviar convite</button></div>`));
    },
  };

  /* ============================ INTEGRAÇÕES ============================ */
  const integ = [
    ['database', 'dark', 'SAP CCS · CPFL', 'Recepção de arquivos e retorno para atualização interna', 'SFTP + API', '38 ms', 'Hoje 05:48'],
    ['building-2', '', 'QUOD · Bureau', 'Comandos de inclusão/exclusão e retorno dos resultados', 'API REST', '112 ms', 'Hoje 07:55'],
    ['message-circle', 'wa', 'WhatsApp Business API', 'Número verificado CPFL · templates homologados Meta', 'Cloud API', '210 ms', 'Hoje 08:40'],
    ['mail', 'violet', 'E-mail transacional', 'Domínio autenticado SPF/DKIM/DMARC', 'SMTP/API', '95 ms', 'Hoje 08:38'],
    ['mail-open', 'warn', 'Carta e AR digital', 'Impressão, postagem e rastreio de entrega', 'API Correios', '340 ms', 'Hoje 06:00'],
    ['smartphone', 'violet', 'Gateway SMS', 'Campanhas e lembretes complementares', 'API', '180 ms', 'Hoje 08:30'],
    ['qr-code', 'green', 'Pagamentos · Pix e boleto', 'Geração, identificação e conciliação de recebimentos', 'API bancária', '150 ms', 'Hoje 08:41'],
    ['bell-ring', '', 'Push · App CPFL', 'Notificações no aplicativo da distribuidora', 'FCM/APNs', '—', 'Ontem 19:00'],
  ];
  VIEWS.integracoes = {
    title: 'Integrações',
    render: () => `
      ${pageHead('Gestão', 'Integrações e conectores', 'Conectividade com sistemas CPFL, bureau, canais de comunicação e meios de pagamento',
        `<button class="btn btn-outline" id="btn-api"><i data-lucide="key-round"></i>Chaves de API</button><button class="btn btn-primary" data-toast="Teste executado: 8/8 conectores OK" data-icon="activity"><i data-lucide="activity"></i>Testar todos</button>`)}
      <div class="grid g-4">${integ.map(([i, c, n, d, t, lat, last]) => `
        <div class="card card-pad" style="display:flex;flex-direction:column;gap:12px">
          <div class="row-between"><span class="ico-box ${c}"><i data-lucide="${i}"></i></span><span class="badge badge-green">Conectado</span></div>
          <div><strong class="strong">${n}</strong><p class="small muted mt-1">${d}</p></div>
          <div class="row-between small" style="margin-top:auto;padding-top:10px;border-top:1px dashed var(--border)"><span class="muted">${t}</span><span class="muted">latência <b class="strong">${lat}</b></span></div>
          <div class="row-between small"><span class="muted">Última sincronização</span><span class="strong">${last}</span></div>
        </div>`).join('')}
      </div>
      <div class="card mt-3">
        <div class="card-head"><div><h3>Disponibilidade dos ambientes</h3><p>Últimos 30 dias · monitoramento contínuo</p></div><span class="badge badge-green">Operacional</span></div>
        <div class="card-body">
          ${['Portal de gestão', 'Portal do consumidor', 'API de processamento', 'Mensageria'].map(s => `
            <div class="row-between small mt-2"><strong class="strong">${s}</strong><span class="muted">30 dias</span></div>
            <div class="row mt-1" style="gap:3px">${Array.from({ length: 30 }, (_, i) => `<span style="flex:1;height:28px;border-radius:4px;background:${(s === 'Mensageria' && i === 17) ? palette.warn : palette.green};opacity:${(s === 'Mensageria' && i === 17) ? 1 : .85}" title="Dia ${i + 1}"></span>`).join('')}</div>`).join('')}
        </div>
      </div>`,
    mount() {
      $('#btn-api').addEventListener('click', () => modal(`
        <div class="modal-head"><div><h3>Chaves de API</h3><p>Acesso programático à plataforma Previnity</p></div>${closeBtn}</div>
        <div class="modal-body"><div class="list">
          ${[['Produção · SAP CCS', 'pvn_live_8f2a••••••••••c41e', 'Criada em 01/09/2026'], ['Homologação', 'pvn_test_19bd••••••••••7a02', 'Criada em 15/08/2026']].map(([n, k, d]) => `
            <div class="list-item"><span class="ico-box"><i data-lucide="key-round"></i></span><div class="grow"><strong>${n}</strong><span class="sub mono">${k}</span><br><span class="sub">${d}</span></div><button class="btn btn-ghost btn-sm" data-toast="Chave copiada" data-icon="copy"><i data-lucide="copy"></i></button><button class="btn btn-danger btn-sm" data-toast="Chave revogada" data-icon="trash-2">Revogar</button></div>`).join('')}
        </div></div>
        <div class="modal-foot"><button class="btn btn-primary" data-toast="Nova chave gerada" data-close-after><i data-lucide="plus"></i>Gerar nova chave</button></div>`));
    },
  };
})();
