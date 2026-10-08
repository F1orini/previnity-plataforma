(function () {
  const { $, $$, money, toast, icons } = UI;
  const debts = [
    { uc: '4821 1903', end: 'Rua das Palmeiras, 1.204 · Campinas/SP', dist: 'CPFL Paulista', faturas: [['06/2026', 162.4], ['07/2026', 158.9], ['08/2026', 164.9]], encargos: 96.4, negativado: true },
    { uc: '4830 7752', end: 'Av. Brasil, 88 · Sumaré/SP', dist: 'CPFL Paulista', faturas: [['03/2025', 212.3], ['04/2025', 198.7]], encargos: 488.7, negativado: true },
  ];
  const state = { step: 0, sel: [0, 1], offer: 0, pay: 'pix' };
  const total = () => state.sel.reduce((s, i) => s + debts[i].faturas.reduce((a, f) => a + f[1], 0) + debts[i].encargos, 0);
  const encargos = () => state.sel.reduce((s, i) => s + debts[i].encargos, 0);
  const offers = () => {
    const t = total(), e = encargos(), principal = t - e;
    return [
      { tag: 'Maior desconto', title: 'À vista', parc: 1, valor: principal + e * 0.1, desc: 0.9 },
      { title: 'Entrada + 3x', parc: 4, valor: principal + e * 0.3, desc: 0.7 },
      { title: 'Entrada + 6x', parc: 7, valor: principal + e * 0.5, desc: 0.5 },
      { title: 'Em até 12x', parc: 12, valor: principal + e * 0.8, desc: 0.2 },
    ];
  };
  const firstName = 'Ana Paula';

  const summary = () => {
    const o = offers()[state.offer];
    return `
      <div class="card j-summary">
        <div class="card-body">
          <span class="small muted" style="font-weight:600;text-transform:uppercase;letter-spacing:.08em">Resumo</span>
          <div class="list mt-1">
            <div class="list-item" style="padding:10px 0"><div class="grow small">Unidades selecionadas</div><span class="strong">${state.sel.length}</span></div>
            <div class="list-item" style="padding:10px 0"><div class="grow small">Valor original</div><span class="strong">${money(total())}</span></div>
            ${state.step >= 2 ? `<div class="list-item" style="padding:10px 0"><div class="grow small">Desconto</div><span class="strong text-green">- ${money(total() - o.valor)}</span></div>
            <div class="list-item" style="padding:10px 0"><div class="grow small">Condição</div><span class="strong">${o.parc === 1 ? 'À vista' : o.parc + 'x de ' + money(o.valor / o.parc)}</span></div>` : ''}
          </div>
          <div class="row-between mt-2" style="padding-top:14px;border-top:1px solid var(--border)"><span class="strong">Total a pagar</span><span style="font-size:24px;font-weight:800;color:var(--blue);letter-spacing:-.03em">${money(state.step >= 2 ? o.valor : total())}</span></div>
        </div>
        <div class="card-foot" style="justify-content:flex-start"><i data-lucide="shield-check" style="color:var(--green-700)"></i><span>Oferta autorizada pela CPFL · válida até 31/10/2026</span></div>
      </div>`;
  };

  const qrSvg = () => {
    let seed = 7; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const n = 29, s = 6; let rects = '';
    const finder = (x, y) => `<rect x="${x * s}" y="${y * s}" width="${7 * s}" height="${7 * s}" fill="#07122b"/><rect x="${(x + 1) * s}" y="${(y + 1) * s}" width="${5 * s}" height="${5 * s}" fill="#fff"/><rect x="${(x + 2) * s}" y="${(y + 2) * s}" width="${3 * s}" height="${3 * s}" fill="#07122b"/>`;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const inF = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
      if (!inF && r() > .52) rects += `<rect x="${x * s}" y="${y * s}" width="${s}" height="${s}" fill="#07122b"/>`;
    }
    return `<svg viewBox="0 0 ${n * s} ${n * s}" width="100%" height="100%">${rects}${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}<rect x="${n * s / 2 - 16}" y="${n * s / 2 - 16}" width="32" height="32" rx="8" fill="#fff"/><image href="assets/img/simbolo.png" x="${n * s / 2 - 12}" y="${n * s / 2 - 12}" width="24" height="24"/></svg>`;
  };

  const views = [
    // 0 · Verificação
    () => `
      <div class="card" style="max-width:520px;margin:0 auto">
        <div class="card-body" style="padding:32px">
          <div class="ico-box wa" style="width:56px;height:56px;border-radius:16px"><i data-lucide="message-circle"></i></div>
          <h2 class="mt-3" style="font-size:24px">Confirme sua identidade</h2>
          <p class="muted mt-1">Enviamos um código de 6 dígitos para o WhatsApp terminado em <b class="strong">•••• 4127</b>.</p>
          <div class="row mt-3" style="gap:8px" id="otp">${Array.from({ length: 6 }, (_, i) => `<input class="input" maxlength="1" inputmode="numeric" value="${'382914'[i]}" style="text-align:center;font-size:22px;font-weight:700;height:58px">`).join('')}</div>
          <button class="btn btn-primary btn-lg btn-block mt-3" data-next>Confirmar código</button>
          <div class="row-between mt-2 small"><a href="#" data-toast="Código reenviado" data-icon="send" style="font-weight:600">Reenviar código</a><a href="#" data-toast="Código enviado por SMS" data-icon="smartphone" style="font-weight:600">Receber por SMS</a></div>
        </div>
      </div>`,
    // 1 · Débitos
    () => `
      <div class="j-grid">
        <div>
          <h2 style="font-size:26px">Olá, ${firstName} 👋</h2>
          <p class="muted mt-1">Encontramos <b class="strong">${debts.length} unidades consumidoras</b> com débitos em aberto. Selecione o que deseja negociar.</p>
          <div class="row mt-3" style="padding:14px 16px;border-radius:14px;background:var(--danger-50);color:#b42318"><i data-lucide="triangle-alert"></i><span class="small" style="font-weight:600">Seu CPF está registrado em cadastro de inadimplentes por débitos com a CPFL. Negocie para regularizar.</span></div>
          <div class="mt-3">${debts.map((d, i) => `
            <label class="debt ${state.sel.includes(i) ? 'selected' : ''}" data-debt="${i}">
              <input type="checkbox" ${state.sel.includes(i) ? 'checked' : ''}>
              <span class="ico-box"><i data-lucide="zap"></i></span>
              <div class="grow">
                <div class="row-between"><strong class="strong">UC ${d.uc}</strong><span class="strong">${money(d.faturas.reduce((a, f) => a + f[1], 0) + d.encargos)}</span></div>
                <div class="small muted">${d.end} · ${d.dist}</div>
                <div class="row mt-1 wrap" style="gap:6px">${d.faturas.map(f => `<span class="badge no-dot">${f[0]} · ${money(f[1])}</span>`).join('')}${d.negativado ? '<span class="badge badge-danger">Negativado</span>' : ''}</div>
              </div>
            </label>`).join('')}
          </div>
          <button class="btn btn-primary btn-lg mt-3" data-next>Ver ofertas <i data-lucide="arrow-right"></i></button>
        </div>
        ${summary()}
      </div>`,
    // 2 · Ofertas
    () => `
      <div class="j-grid">
        <div>
          <h2 style="font-size:26px">Escolha a melhor condição</h2>
          <p class="muted mt-1">Ofertas válidas para o <b class="strong">Feirão Limpa Nome CPFL</b>.</p>
          <div class="grid g-2 mt-4" style="gap:18px">${offers().map((o, i) => `
            <div class="offer ${state.offer === i ? 'selected' : ''}" data-offer="${i}">
              ${o.tag ? `<span class="tag">${o.tag}</span>` : ''}
              <div class="row-between"><strong class="strong" style="font-size:16px">${o.title}</strong><span class="badge badge-green no-dot">-${Math.round(o.desc * 100)}% encargos</span></div>
              <div class="from mt-2">${money(total())}</div>
              <div class="val">${o.parc === 1 ? money(o.valor) : o.parc + 'x ' + money(o.valor / o.parc)}</div>
              <div class="small muted">${o.parc === 1 ? 'Pagamento único via Pix, boleto ou cartão' : 'Total ' + money(o.valor) + ' · 1ª parcela hoje'}</div>
            </div>`).join('')}
          </div>
          <button class="btn btn-primary btn-lg mt-4" data-next>Continuar <i data-lucide="arrow-right"></i></button>
        </div>
        ${summary()}
      </div>`,
    // 3 · Revisão e aceite
    () => {
      const o = offers()[state.offer];
      return `
      <div class="j-grid">
        <div class="card"><div class="card-body" style="padding:28px">
          <h2 style="font-size:24px">Revise seu acordo</h2>
          <div class="dl mt-3">
            <div><span>Titular</span><strong>Ana Paula Ribeiro</strong></div>
            <div><span>CPF</span><strong>***.719.336-**</strong></div>
            <div><span>Unidades consumidoras</span><strong>${state.sel.map(i => debts[i].uc).join(', ')}</strong></div>
            <div><span>Condição</span><strong>${o.parc === 1 ? 'À vista' : o.parc + 'x de ' + money(o.valor / o.parc)}</strong></div>
            <div><span>Valor total</span><strong>${money(o.valor)}</strong></div>
            <div><span>Vencimento da 1ª parcela</span><strong>Hoje, 08/10/2026</strong></div>
          </div>
          <div class="field mt-3"><label>Enviar comprovante e lembretes para</label><div class="chip-group" data-multi><button class="chip active"><i data-lucide="message-circle"></i>WhatsApp</button><button class="chip active"><i data-lucide="mail"></i>ana.r***@gmail.com</button></div></div>
          <div class="mt-3" style="padding:16px;border-radius:14px;background:var(--surface-2);border:1px solid var(--border);max-height:140px;overflow:auto;font-size:12.5px;color:var(--muted)">
            <b class="strong">Termo de acordo para pagamento de débitos</b><br>Pelo presente instrumento, o(a) titular reconhece os débitos relacionados e aceita as condições ofertadas pela CPFL. O não pagamento na data acordada implicará o cancelamento do acordo e o restabelecimento do valor original. Após a confirmação do pagamento, a exclusão do registro em cadastro de inadimplentes será solicitada em até 5 dias úteis. Os dados serão tratados conforme a LGPD...
          </div>
          <label class="check mt-3"><input type="checkbox" id="aceite" checked> Li e aceito o termo de acordo</label>
          <button class="btn btn-primary btn-lg btn-block mt-3" data-next><i data-lucide="file-signature"></i>Confirmar acordo e pagar</button>
        </div></div>
        ${summary()}
      </div>`;
    },
    // 4 · Pagamento
    () => {
      const o = offers()[state.offer];
      const valor = o.valor / o.parc;
      return `
      <div class="j-grid">
        <div class="card">
          <div class="card-body" style="padding:28px">
            <div class="row-between wrap"><h2 style="font-size:24px">Pagamento</h2><span class="badge badge-blue no-dot">Acordo AC-550481</span></div>
            <div class="tabs mt-3" data-tabs="pay" style="width:100%">
              <button class="tab active" data-name="pix" style="flex:1"><i data-lucide="qr-code"></i>Pix</button>
              <button class="tab" data-name="boleto" style="flex:1"><i data-lucide="barcode"></i>Boleto</button>
              <button class="tab" data-name="cartao" style="flex:1"><i data-lucide="credit-card"></i>Cartão</button>
            </div>
            <div data-pane="pay" data-name="pix" style="text-align:center" class="mt-4">
              <div class="qr">${qrSvg()}</div>
              <div style="font-size:30px;font-weight:800;color:var(--ink);letter-spacing:-.03em" class="mt-2">${money(valor)}</div>
              <p class="small muted">Expira em <b class="strong" id="pix-timer">29:59</b> · aprovação imediata</p>
              <div class="row mt-3" style="max-width:480px;margin-inline:auto"><input class="input mono" readonly value="00020126580014BR.GOV.BCB.PIX0136cpfl-previnity-ac550481520400005303986"><button class="btn btn-dark" data-toast="Código Pix copiado" data-icon="copy"><i data-lucide="copy"></i>Copiar</button></div>
            </div>
            <div data-pane="pay" data-name="boleto" class="hide mt-4">
              <div class="card card-pad" style="background:var(--surface-2)">
                <span class="small muted">Linha digitável</span>
                <div class="mono strong mt-1" style="font-size:15px;word-break:break-all">34191.79001 01043.510047 91020.150008 1 ${String(Math.round(valor * 100)).padStart(10, '0')}</div>
                <div class="row mt-2"><svg height="56" width="100%" preserveAspectRatio="none" viewBox="0 0 300 56">${Array.from({ length: 90 }, (_, i) => `<rect x="${i * 3.3}" width="${i % 3 ? 1.2 : 2.2}" height="56" fill="#07122b"/>`).join('')}</svg></div>
              </div>
              <p class="small muted mt-2">Compensação em até 2 dias úteis. Vencimento: 10/10/2026.</p>
              <div class="row mt-2"><button class="btn btn-dark" data-toast="Linha digitável copiada" data-icon="copy"><i data-lucide="copy"></i>Copiar código</button><button class="btn btn-outline" data-toast="Boleto baixado (PDF)" data-icon="file-down"><i data-lucide="download"></i>Baixar PDF</button></div>
            </div>
            <div data-pane="pay" data-name="cartao" class="hide mt-4">
              <div class="form-grid">
                <div class="field span-2"><label>Número do cartão</label><input class="input" placeholder="0000 0000 0000 0000"></div>
                <div class="field span-2"><label>Nome impresso</label><input class="input" placeholder="Como no cartão"></div>
                <div class="field"><label>Validade</label><input class="input" placeholder="MM/AA"></div>
                <div class="field"><label>CVV</label><input class="input" placeholder="123"></div>
              </div>
            </div>
            <button class="btn btn-accent btn-lg btn-block mt-4" data-next><i data-lucide="check-circle-2"></i>Simular pagamento confirmado</button>
          </div>
        </div>
        ${summary()}
      </div>`;
    },
    // 5 · Sucesso
    () => `
      <div class="card" style="max-width:620px;margin:0 auto;text-align:center">
        <div class="card-body" style="padding:44px 32px">
          <div class="success-ring"><i data-lucide="check"></i></div>
          <h2 class="mt-4" style="font-size:28px">Pagamento confirmado!</h2>
          <p class="muted mt-1" style="font-size:15px">Parabéns, ${firstName.split(' ')[0]}. Seu acordo foi registrado e a CPFL já foi notificada.</p>
          <div class="grid g-2 mt-4" style="gap:12px;text-align:left">
            <div class="card card-pad" style="padding:16px"><span class="small muted">Protocolo</span><div class="strong mono">AC-550481</div></div>
            <div class="card card-pad" style="padding:16px"><span class="small muted">Valor pago</span><div class="strong">${money(offers()[state.offer].valor / offers()[state.offer].parc)}</div></div>
          </div>
          <div class="timeline mt-4" style="text-align:left">
            <div class="tl-item ok"><span class="tl-dot"><i data-lucide="check"></i></span><strong>Pagamento recebido</strong><span class="sub">Agora · identificação automática</span></div>
            <div class="tl-item"><span class="tl-dot"><i data-lucide="refresh-cw"></i></span><strong>Baixa das faturas na CPFL</strong><span class="sub">Em até 1 dia útil</span></div>
            <div class="tl-item pending"><span class="tl-dot"><i data-lucide="user-check"></i></span><strong>Nome retirado do cadastro de inadimplentes</strong><span class="sub">Em até 5 dias úteis</span></div>
          </div>
          <div class="row mt-4" style="justify-content:center;flex-wrap:wrap"><button class="btn btn-outline" data-toast="Comprovante baixado" data-icon="file-down"><i data-lucide="download"></i>Comprovante</button><button class="btn btn-outline" data-toast="Termo do acordo enviado por WhatsApp" data-icon="send"><i data-lucide="file-text"></i>Termo do acordo</button><a class="btn btn-primary" href="negociar">Concluir</a></div>
        </div>
      </div>`,
  ];

  const landing = $('#landing'), journey = $('#journey');
  let pixTimer;
  function go(step) {
    state.step = step;
    clearInterval(pixTimer);
    $('#j-view').innerHTML = views[step]();
    $$('#j-progress span').forEach((s, i) => s.classList.toggle('on', i <= Math.min(step, 4)));
    $('#j-label').textContent = step >= 5 ? 'Concluído' : `Etapa ${step + 1} de 5`;
    $('#j-back').style.visibility = step === 0 || step >= 5 ? 'hidden' : 'visible';
    icons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (step === 4) {
      let s = 1799;
      pixTimer = setInterval(() => { const el = $('#pix-timer'); if (!el) return clearInterval(pixTimer); s--; el.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }, 1000);
    }
    if (step === 5) confetti();
  }
  function start() { landing.classList.add('hide'); journey.classList.remove('hide'); go(0); }

  $('#form-cpf').addEventListener('submit', e => { e.preventDefault(); start(); });
  $$('[data-start]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); start(); }));
  $('#j-back').addEventListener('click', () => go(Math.max(0, state.step - 1)));

  journey.addEventListener('click', e => {
    if (e.target.closest('[data-next]')) {
      if (state.step === 1 && !state.sel.length) return toast('Selecione ao menos uma unidade', 'info');
      if (state.step === 3 && !$('#aceite').checked) return toast('É necessário aceitar o termo', 'info');
      go(state.step + 1);
    }
    const d = e.target.closest('[data-debt]');
    if (d && e.target.tagName === 'INPUT') {
      const i = +d.dataset.debt;
      state.sel = e.target.checked ? [...new Set([...state.sel, i])] : state.sel.filter(x => x !== i);
      go(1);
    }
    const o = e.target.closest('[data-offer]');
    if (o) { state.offer = +o.dataset.offer; go(2); }
  });
  journey.addEventListener('input', e => {
    const inputs = $$('#otp input');
    const i = inputs.indexOf(e.target);
    if (i > -1 && e.target.value && inputs[i + 1]) inputs[i + 1].focus();
  });

  $('#cpf').addEventListener('input', e => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 11);
    e.target.value = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  });

  function confetti() {
    const colors = ['#0563ff', '#00e5a0', '#07122b', '#7c5cff', '#f59e0b'];
    for (let i = 0; i < 90; i++) {
      const c = document.createElement('span');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = colors[i % colors.length];
      c.style.borderRadius = i % 3 ? '2px' : '50%';
      c.style.animationDuration = 2.2 + Math.random() * 2 + 's';
      c.style.animationDelay = Math.random() * .6 + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 5000);
    }
  }

  icons();
})();
