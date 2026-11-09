const CORES = ['#e3a8c7','#ae6e48','#47b3ab','#a9d98f','#9279d2','#f0c04a','#e9856b','#6fa8dc'];

function svgGato(fundo) {
  return '<svg class="cat" viewBox="0 0 100 100" aria-hidden="true">' +
    '<rect width="100" height="100" rx="14" fill="' + (fundo || 'none') + '"/>' +
    '<path d="M18 40 L22 12 L42 28 Z M82 40 L78 12 L58 28 Z" fill="#2a2a2e"/>' +
    '<ellipse cx="50" cy="58" rx="34" ry="30" fill="#2a2a2e"/>' +
    '<path d="M50 36 C38 40 30 52 32 66 C36 80 64 80 68 66 C70 52 62 40 50 36Z" fill="#fff"/>' +
    '<ellipse cx="36" cy="56" rx="7" ry="8" fill="#fff" stroke="#222" stroke-width="1.5"/>' +
    '<ellipse cx="64" cy="56" rx="7" ry="8" fill="#fff" stroke="#222" stroke-width="1.5"/>' +
    '<circle cx="37" cy="57" r="4" fill="#222"/><circle cx="63" cy="57" r="4" fill="#222"/>' +
    '<path d="M46 66 L54 66 L50 71Z" fill="#f2a3b3"/>' +
    '<path d="M50 71 Q44 76 40 73 M50 71 Q56 76 60 73" stroke="#444" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
    '</svg>';
}
const SVG_X = '<svg class="x" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5L19 19M19 5L5 19" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/></svg>';

const el = {
  tab: document.getElementById('tabuleiro'),
  cont: document.getElementById('contador'),
  vidas: document.getElementById('vidas'),
  nivel: document.getElementById('nivel'),
  tela: document.getElementById('telaFim'),
  fimT: document.getElementById('fimTitulo'),
  fimP: document.getElementById('fimTexto'),
  fimB: document.getElementById('btnFim'),
  caixaGato: document.getElementById('caixaGato')
};

const VIDAS_MAX = 7;
let mostrarAjuda = true;
try { mostrarAjuda = localStorage.getItem('gatinhos-ajuda') !== '0'; } catch (e) {}
let nivel = 1;
try { nivel = parseInt(localStorage.getItem('gatinhos-nivel'), 10) || 1; } catch (e) {}
let fase, estado, vidas, acabou;

function iniciar() {
  fase = gerarFase(nivel);
  const n = fase.n;
  estado = Array.from({ length: n }, () => new Array(n).fill(0)); // 0 vazio, 1 X, 2 gato
  vidas = VIDAS_MAX; acabou = false;
  el.tela.hidden = true;
  desenhar();
}

function desenhar() {
  const n = fase.n, reg = fase.regioes;
  el.tab.style.gridTemplateColumns = 'repeat(' + n + ',1fr)';
  el.tab.style.gridTemplateRows = 'repeat(' + n + ',1fr)';
  el.tab.innerHTML = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'celula';
    b.style.background = CORES[reg[r][c] % CORES.length];
    b.dataset.r = r; b.dataset.c = c;
    b.addEventListener('click', () => tocar(r, c));
    el.tab.appendChild(b);
  }
  el.nivel.textContent = 'Nível ' + nivel + ' · ' + n + '×' + n;
  atualizar();
}

function celulaEl(r, c) { return el.tab.children[r * fase.n + c]; }

function conflitos() {
  const n = fase.n, gatos = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (estado[r][c] === 2) gatos.push([r, c]);
  const ruins = new Set();
  for (let i = 0; i < gatos.length; i++) for (let j = i + 1; j < gatos.length; j++) {
    const [r1, c1] = gatos[i], [r2, c2] = gatos[j];
    const mesmaCor = fase.regioes[r1][c1] === fase.regioes[r2][c2];
    const toca = Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1;
    if (r1 === r2 || c1 === c2 || mesmaCor || toca) { ruins.add(r1 * n + c1); ruins.add(r2 * n + c2); }
  }
  return { gatos: gatos.length, ruins };
}

function bloqueadas() {
  const n = fase.n, reg = fase.regioes;
  const auto = Array.from({ length: n }, () => new Array(n).fill(false));
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (estado[r][c] !== 2) continue;
    for (let rr = 0; rr < n; rr++) for (let cc = 0; cc < n; cc++) {
      if (estado[rr][cc] === 2) continue;
      if (rr === r || cc === c || reg[rr][cc] === reg[r][c] ||
          (Math.abs(rr - r) <= 1 && Math.abs(cc - c) <= 1)) auto[rr][cc] = true;
    }
  }
  return auto;
}

function atualizar() {
  const n = fase.n;
  const { gatos, ruins } = conflitos();
  const auto = bloqueadas();
  const bloq = (r, c) => r >= 0 && r < n && c >= 0 && c < n && estado[r][c] !== 2 && (estado[r][c] === 1 || auto[r][c]);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const b = celulaEl(r, c), v = estado[r][c];
    const sombra = mostrarAjuda && v === 0 && auto[r][c];
    b.innerHTML = v === 1 ? SVG_X : v === 2 ? svgGato() : sombra ? SVG_X : '';
    b.classList.toggle('auto', sombra);
    const dentro = mostrarAjuda && bloq(r, c);
    b.classList.toggle('bt', dentro && !bloq(r - 1, c));
    b.classList.toggle('bb', dentro && !bloq(r + 1, c));
    b.classList.toggle('bl', dentro && !bloq(r, c - 1));
    b.classList.toggle('br', dentro && !bloq(r, c + 1));
    b.classList.toggle('conflito', ruins.has(r * n + c));
    b.setAttribute('aria-label', 'Linha ' + (r + 1) + ', coluna ' + (c + 1) + ': ' + (v === 1 ? 'marcado' : v === 2 ? 'gato' : 'vazio'));
  }
  el.cont.innerHTML = svgGato() + '<span class="' + (gatos === n ? 'ok' : '') + '">' + gatos + '/' + n + '</span>';
  el.vidas.innerHTML = '';
  for (let i = 0; i < VIDAS_MAX; i++) el.vidas.innerHTML += '<span class="coracao ' + (i < vidas ? '' : 'perdido') + '">❤️</span>';
  if (gatos === n && ruins.size === 0) fimDeJogo(true);
}

function tocar(r, c) {
  if (acabou) return;
  const atual = estado[r][c];
  if (atual === 0) { estado[r][c] = 1; }
  else if (atual === 1) {
    if (fase.solucao[r] !== c) {
      vidas--;
      const b = celulaEl(r, c);
      b.classList.remove('erro'); void b.offsetWidth; b.classList.add('erro');
      estado[r][c] = 1;
      atualizar();
      if (vidas <= 0) fimDeJogo(false);
      return;
    }
    estado[r][c] = 2;
  } else { estado[r][c] = 0; }
  atualizar();
}

function fimDeJogo(ganhou) {
  acabou = true;
  el.caixaGato.innerHTML = svgGato();
  if (ganhou) {
    el.fimT.textContent = 'Achou todos!';
    el.fimP.textContent = 'Você encontrou os ' + fase.n + ' gatinhos do nível ' + nivel + '.';
    el.fimB.textContent = 'Próximo nível';
    el.fimB.onclick = () => { nivel++; salvar(); iniciar(); };
  } else {
    el.fimT.textContent = 'Acabaram as vidas';
    el.fimP.textContent = 'Os gatinhos se esconderam bem. Tente este nível de novo.';
    el.fimB.textContent = 'Tentar de novo';
    el.fimB.onclick = iniciar;
  }
  setTimeout(() => { el.tela.hidden = false; el.fimB.focus(); }, ganhou ? 350 : 500);
}

function salvar() { try { localStorage.setItem('gatinhos-nivel', String(nivel)); } catch (e) {} }

document.getElementById('btnReiniciar').addEventListener('click', iniciar);
document.getElementById('btnDica').addEventListener('click', () => {
  if (acabou) return;
  const n = fase.n;
  for (let r = 0; r < n; r++) {
    const c = fase.solucao[r];
    if (estado[r][c] !== 2) {
      const b = celulaEl(r, c);
      b.classList.remove('dica'); void b.offsetWidth; b.classList.add('dica');
      return;
    }
  }
});

const chk = document.getElementById('chkAjuda');
chk.checked = mostrarAjuda;
chk.addEventListener('change', () => {
  mostrarAjuda = chk.checked;
  try { localStorage.setItem('gatinhos-ajuda', mostrarAjuda ? '1' : '0'); } catch (e) {}
  atualizar();
});

iniciar();
