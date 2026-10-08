// Dados fictícios para demonstração. Nenhum dado real de cliente.
(function () {
  let seed = 42;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const pick = arr => arr[Math.floor(rnd() * arr.length)];
  const int = (a, b) => Math.floor(a + rnd() * (b - a + 1));

  const distribuidoras = [
    { cod: '01', nome: 'CPFL Paulista', sigla: 'PAU', clientes: 4_812_330 },
    { cod: '02', nome: 'CPFL Piratininga', sigla: 'PIR', clientes: 1_884_120 },
    { cod: '03', nome: 'CPFL Santa Cruz', sigla: 'STC', clientes: 512_480 },
    { cod: '04', nome: 'Santa Cruz · Jaguari', sigla: 'JAG', clientes: 48_300 },
    { cod: '05', nome: 'Santa Cruz · Mococa', sigla: 'MOC', clientes: 47_910 },
    { cod: '06', nome: 'Santa Cruz · Leste Paulista', sigla: 'LPA', clientes: 61_220 },
    { cod: '07', nome: 'Santa Cruz · Sul Paulista', sigla: 'SPA', clientes: 87_450 },
    { cod: '08', nome: 'RGE', sigla: 'RGE', clientes: 1_620_880 },
    { cod: '09', nome: 'RGE Sul', sigla: 'RGS', clientes: 1_402_760 },
  ];

  const nomes = ['Ana Paula Ribeiro', 'Carlos Eduardo Lima', 'Juliana Martins', 'Rafael Souza', 'Fernanda Alves', 'Marcos Vinícius Rocha', 'Patrícia Gomes', 'Lucas Ferreira', 'Beatriz Carvalho', 'Thiago Barbosa', 'Camila Nunes', 'Gustavo Pereira', 'Larissa Teixeira', 'Bruno Cardoso', 'Aline Moreira', 'Diego Santos', 'Renata Oliveira', 'Felipe Araújo', 'Vanessa Dias', 'Rodrigo Mendes', 'Padaria Pão Dourado ME', 'Mercado Bom Preço Ltda', 'Oficina São Jorge ME', 'Clínica Vida Plena Ltda', 'Restaurante Sabor da Terra'];
  const cidades = ['Campinas/SP', 'Ribeirão Preto/SP', 'Sorocaba/SP', 'Santos/SP', 'Bauru/SP', 'Piracicaba/SP', 'Jundiaí/SP', 'Porto Alegre/RS', 'Caxias do Sul/RS', 'Santa Cruz do Rio Pardo/SP', 'Mococa/SP', 'Pelotas/RS'];

  const maskDoc = (pj) => pj ? `${int(10, 99)}.***.***/0001-${int(10, 99)}` : `***.${int(100, 999)}.${int(100, 999)}-**`;
  const pad = n => String(n).padStart(2, '0');

  const clientes = Array.from({ length: 48 }, (_, i) => {
    const nome = nomes[i % nomes.length];
    const pj = /ME|Ltda/.test(nome);
    const d = pick(distribuidoras);
    const status = pick(['Incluído', 'Incluído', 'Incluído', 'Excluído', 'Pendente', 'Rejeitado', 'Em processamento']);
    const valor = pj ? int(1800, 24000) + rnd() : int(120, 2800) + rnd();
    return {
      id: 'NEG-' + (2026100000 + i * 37),
      nome, pj, doc: maskDoc(pj),
      uc: String(int(10000000, 99999999)),
      dist: d.nome, distCod: d.cod,
      cidade: pick(cidades),
      valor, faturas: int(1, 6), atraso: int(35, 720),
      status,
      data: `${pad(int(1, 7))}/10/2026`,
      canal: pick(['WhatsApp', 'WhatsApp', 'WhatsApp', 'E-mail', 'Carta']),
      protocolo: 'QD' + int(100000000, 999999999),
    };
  });

  const hoje = '08/10/2026';
  const lotes = distribuidoras.map((d, i) => {
    const total = Math.round(d.clientes * 0.009 + int(400, 1900));
    const statusArr = ['Concluído', 'Concluído', 'Concluído', 'Concluído', 'Concluído', 'Concluído', 'Processando', 'Concluído', 'Validando'];
    const st = statusArr[i];
    const rej = st === 'Concluído' ? int(3, 60) : 0;
    const incl = Math.round(total * 0.82);
    return {
      id: `CPFL_NEG_${d.cod}_20261008.txt`,
      lote: 'LT-' + (88410 + i),
      dist: d.nome, cod: d.cod,
      recebido: `${hoje} 0${int(1, 5)}:${pad(int(0, 59))}`,
      total, inclusoes: incl, exclusoes: total - incl, rejeitados: rej,
      status: st,
      progresso: st === 'Concluído' ? 100 : st === 'Processando' ? 64 : 18,
      origem: i % 3 === 0 ? 'SFTP' : 'API SAP CCS',
      tamanho: (total * 0.62 / 1000).toFixed(1) + ' MB',
    };
  });

  const historicoLotes = Array.from({ length: 14 }, (_, i) => {
    const d = distribuidoras[i % 9];
    const dia = 7 - Math.floor(i / 9) - (i % 2);
    const total = int(3000, 48000);
    return {
      id: `CPFL_NEG_${d.cod}_202610${pad(Math.max(dia, 1))}.txt`, lote: 'LT-' + (88400 - i), dist: d.nome, cod: d.cod,
      recebido: `${pad(Math.max(dia, 1))}/10/2026 0${int(1, 5)}:${pad(int(0, 59))}`, total,
      inclusoes: Math.round(total * .8), exclusoes: Math.round(total * .2), rejeitados: int(0, 80),
      status: 'Concluído', progresso: 100, origem: i % 3 === 0 ? 'SFTP' : 'API SAP CCS', tamanho: (total * .62 / 1000).toFixed(1) + ' MB',
    };
  });

  const campanhas = [
    { id: 'CMP-0142', nome: 'Feirão Limpa Nome CPFL – Outubro', tipo: 'Feirão de quitação', status: 'Ativa', inicio: '01/10/2026', fim: '31/10/2026', publico: 248_310, canais: ['WhatsApp', 'SMS', 'E-mail', 'Push'], desconto: 'até 90% em juros e multa', acordos: 18_942, recuperado: 7_842_310, conversao: 7.6, dist: 'Todas' },
    { id: 'CMP-0139', nome: 'Régua preventiva – vencimento D-3', tipo: 'Preventiva', status: 'Ativa', inicio: '15/09/2026', fim: 'Contínua', publico: 412_880, canais: ['WhatsApp', 'SMS'], desconto: '—', acordos: 0, recuperado: 12_310_400, conversao: 31.2, dist: 'Todas' },
    { id: 'CMP-0137', nome: 'Quita Fácil RGE – Parcelamento 12x', tipo: 'Promocional', status: 'Ativa', inicio: '20/09/2026', fim: '20/10/2026', publico: 61_220, canais: ['WhatsApp', 'E-mail'], desconto: 'entrada 10% + 12x sem juros', acordos: 4_120, recuperado: 1_934_800, conversao: 6.7, dist: 'RGE / RGE Sul' },
    { id: 'CMP-0144', nome: 'Black Friday da Quitação', tipo: 'Feirão de quitação', status: 'Agendada', inicio: '20/11/2026', fim: '30/11/2026', publico: 520_000, canais: ['WhatsApp', 'SMS', 'E-mail', 'Push', 'Portal'], desconto: 'até 95% em juros e multa', acordos: 0, recuperado: 0, conversao: 0, dist: 'Todas' },
    { id: 'CMP-0131', nome: 'Reativação PJ – Comércio local', tipo: 'Estímulo à negociação', status: 'Encerrada', inicio: '01/08/2026', fim: '31/08/2026', publico: 22_410, canais: ['E-mail', 'WhatsApp'], desconto: 'até 70% em encargos', acordos: 1_388, recuperado: 2_418_900, conversao: 6.2, dist: 'CPFL Paulista' },
    { id: 'CMP-0128', nome: 'Feirão Dia das Mães', tipo: 'Feirão de quitação', status: 'Encerrada', inicio: '01/05/2026', fim: '15/05/2026', publico: 198_200, canais: ['WhatsApp', 'SMS', 'E-mail'], desconto: 'até 85% em juros e multa', acordos: 13_610, recuperado: 5_102_330, conversao: 6.9, dist: 'Todas' },
  ];

  const acordos = Array.from({ length: 22 }, (_, i) => {
    const c = clientes[(i * 3) % clientes.length];
    const original = c.valor;
    const desconto = pick([0.2, 0.35, 0.5, 0.6, 0.15]);
    const parcelas = pick([1, 1, 3, 6, 10, 12]);
    return {
      id: 'AC-' + (550120 + i * 11),
      cliente: c.nome, doc: c.doc, dist: c.dist, pj: c.pj,
      original, negociado: original * (1 - desconto), desconto, parcelas,
      meio: pick(['Pix', 'Pix', 'Boleto', 'Cartão de crédito']),
      status: pick(['Pago', 'Pago', 'Em dia', 'Aguardando pagamento', 'Quebrado']),
      data: `${pad(int(1, 8))}/10/2026`,
      canal: pick(['Portal web', 'WhatsApp', 'App CPFL', 'Portal web']),
      campanha: pick(['Feirão Limpa Nome CPFL – Outubro', 'Quita Fácil RGE – Parcelamento 12x', '—']),
      faixa: pick(['31–90 dias', '91–180 dias', '181–360 dias', '> 360 dias']),
    };
  });

  const comunicacoes = clientes.slice(0, 30).map((c, i) => {
    const fluxo = pick(['wa', 'wa', 'wa', 'wa-email', 'wa-email-carta', 'sms']);
    const steps = [];
    if (fluxo === 'sms') steps.push({ canal: 'SMS', status: 'Entregue', hora: '08:14' });
    else {
      steps.push({ canal: 'WhatsApp', status: fluxo === 'wa' ? 'Lido' : 'Não entregue', hora: '07:02' });
      if (fluxo !== 'wa') steps.push({ canal: 'E-mail', status: fluxo === 'wa-email' ? 'Aberto' : 'Bounce', hora: '09:30' });
      if (fluxo === 'wa-email-carta') steps.push({ canal: 'Carta', status: 'Postada', hora: '09/10' });
    }
    return { id: 'COM-' + (9001200 + i * 7), cliente: c.nome, doc: c.doc, dist: c.dist, uc: c.uc, valor: c.valor, steps, final: steps[steps.length - 1], tipo: i % 5 === 0 ? '2º comunicado' : 'Comunicado de inclusão', data: c.data };
  });

  const enriquecimentos = [
    { id: 'ENR-3021', solicitado: '07/10/2026 14:22', usuario: 'Mariana Costa', registros: 12_480, campos: ['Telefone', 'E-mail', 'Endereço'], status: 'Concluído', taxa: 78.4, dist: 'CPFL Paulista' },
    { id: 'ENR-3020', solicitado: '06/10/2026 10:05', usuario: 'João Henrique', registros: 4_210, campos: ['Telefone', 'CPF/CNPJ'], status: 'Concluído', taxa: 83.1, dist: 'RGE' },
    { id: 'ENR-3022', solicitado: '08/10/2026 08:01', usuario: 'Mariana Costa', registros: 8_930, campos: ['Endereço', 'E-mail'], status: 'Processando', taxa: 41.0, dist: 'CPFL Piratininga' },
    { id: 'ENR-3018', solicitado: '02/10/2026 16:47', usuario: 'Equipe Cobrança', registros: 21_600, campos: ['Telefone', 'E-mail', 'Endereço', 'CPF/CNPJ'], status: 'Concluído', taxa: 71.9, dist: 'Todas' },
    { id: 'ENR-3015', solicitado: '29/09/2026 09:12', usuario: 'João Henrique', registros: 2_340, campos: ['Telefone'], status: 'Concluído', taxa: 88.7, dist: 'RGE Sul' },
  ];

  const usuarios = [
    { nome: 'Mariana Costa', email: 'mariana.costa@cpfl.com.br', perfil: 'Administrador', dist: 'Todas', ultimo: 'Agora', status: 'Ativo', ini: 'MC', cor: '' },
    { nome: 'João Henrique Prado', email: 'joao.prado@cpfl.com.br', perfil: 'Gestor de cobrança', dist: 'RGE / RGE Sul', ultimo: 'Hoje, 07:48', status: 'Ativo', ini: 'JP', cor: 'green' },
    { nome: 'Sofia Andrade', email: 'sofia.andrade@cpfl.com.br', perfil: 'Analista operacional', dist: 'CPFL Paulista', ultimo: 'Ontem, 18:10', status: 'Ativo', ini: 'SA', cor: 'violet' },
    { nome: 'Ricardo Tavares', email: 'ricardo.tavares@cpfl.com.br', perfil: 'Auditoria', dist: 'Todas', ultimo: '03/10/2026', status: 'Ativo', ini: 'RT', cor: 'warn' },
    { nome: 'Helena Duarte', email: 'helena.duarte@cpfl.com.br', perfil: 'Consulta', dist: 'CPFL Santa Cruz', ultimo: '28/09/2026', status: 'Inativo', ini: 'HD', cor: '' },
    { nome: 'Integração SAP CCS', email: 'svc-sapccs@cpfl.com.br', perfil: 'Conta de serviço', dist: 'Todas', ultimo: 'Hoje, 05:12', status: 'Ativo', ini: 'API', cor: 'green' },
  ];

  const auditoria = [
    { data: '08/10/2026 08:41:12', usuario: 'Mariana Costa', acao: 'Login com MFA', recurso: 'Portal de Gestão', ip: '10.12.4.88', nivel: 'info' },
    { data: '08/10/2026 08:12:03', usuario: 'Sistema', acao: 'Lote processado', recurso: 'LT-88410 · CPFL Paulista', ip: '—', nivel: 'ok' },
    { data: '08/10/2026 07:55:40', usuario: 'Sistema', acao: 'Retorno bureau recebido', recurso: 'QUOD · 41.208 comandos', ip: '—', nivel: 'ok' },
    { data: '08/10/2026 07:31:19', usuario: 'João Henrique Prado', acao: 'Exportou relatório', recurso: 'Acordos · RGE · Setembro', ip: '10.40.1.22', nivel: 'info' },
    { data: '08/10/2026 06:02:55', usuario: 'Sistema', acao: 'Falha de validação', recurso: 'LT-88416 · 23 registros sem CEP', ip: '—', nivel: 'warn' },
    { data: '08/10/2026 05:12:08', usuario: 'Integração SAP CCS', acao: 'Arquivo recebido via SFTP', recurso: 'CPFL_NEG_01_20261008.txt', ip: '172.16.8.4', nivel: 'info' },
    { data: '07/10/2026 18:22:47', usuario: 'Sofia Andrade', acao: 'Exclusão manual solicitada', recurso: 'UC 48211903 · pagamento confirmado', ip: '10.12.9.31', nivel: 'warn' },
    { data: '07/10/2026 16:05:10', usuario: 'Ricardo Tavares', acao: 'Download de evidências', recurso: 'Carta espelho · 120 registros', ip: '10.12.2.17', nivel: 'info' },
    { data: '07/10/2026 14:22:31', usuario: 'Mariana Costa', acao: 'Solicitou enriquecimento', recurso: 'ENR-3021 · 12.480 registros', ip: '10.12.4.88', nivel: 'info' },
    { data: '07/10/2026 11:48:02', usuario: 'Mariana Costa', acao: 'Alterou perfil de acesso', recurso: 'Helena Duarte → Inativo', ip: '10.12.4.88', nivel: 'warn' },
  ];

  const volumetria = [
    ['Negativação – WhatsApp', 43_680_000, 41_364],
    ['Negativação – e-mail', 15_600_000, 14_773],
    ['Negativação – carta', 3_120_000, 2_955],
    ['Enriquecimento de dados', 365_771, 484],
    ['Carta extrajudicial', 113_556, 150],
    ['E-mail extrajudicial', 104_711, 139],
    ['Score e análise de carteira', 698_034, 923],
    ['2º comunicado / melhor endereço', 99_719, 132],
    ['Banco de dados', 9_084, 12],
  ];

  window.DB = { distribuidoras, clientes, lotes, historicoLotes, campanhas, acordos, comunicacoes, enriquecimentos, usuarios, auditoria, volumetria };
})();
