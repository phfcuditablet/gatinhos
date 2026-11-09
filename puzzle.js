// Gerador de fases: 1 gato por linha, coluna e cor; gatos não se tocam (nem na diagonal).
function criarRng(semente) {
  let a = semente >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function tamanhoDoNivel(nivel) {
  if (nivel <= 2) return 5;
  if (nivel <= 4) return 6;
  if (nivel <= 7) return 7;
  if (nivel <= 10) return 8;
  return 8;
}

function sortearSolucao(n, rand) {
  const cols = new Array(n).fill(-1);
  const usadas = new Array(n).fill(false);
  function ir(r) {
    if (r === n) return true;
    const opcoes = [];
    for (let c = 0; c < n; c++) opcoes.push(c);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [opcoes[i], opcoes[j]] = [opcoes[j], opcoes[i]];
    }
    for (const c of opcoes) {
      if (usadas[c]) continue;
      if (r > 0 && Math.abs(cols[r - 1] - c) <= 1) continue;
      cols[r] = c; usadas[c] = true;
      if (ir(r + 1)) return true;
      usadas[c] = false; cols[r] = -1;
    }
    return false;
  }
  return ir(0) ? cols : null;
}

function crescerRegioes(n, solucao, rand) {
  const reg = Array.from({ length: n }, () => new Array(n).fill(-1));
  solucao.forEach((c, r) => { reg[r][c] = r; });
  let faltam = n * n - n;
  const viz = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (faltam > 0) {
    const fronteira = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (reg[r][c] !== -1) continue;
      for (const [dr, dc] of viz) {
        const rr = r + dr, cc = c + dc;
        if (rr >= 0 && rr < n && cc >= 0 && cc < n && reg[rr][cc] !== -1) {
          fronteira.push([r, c, reg[rr][cc]]);
        }
      }
    }
    const [r, c, id] = fronteira[Math.floor(rand() * fronteira.length)];
    reg[r][c] = id; faltam--;
  }
  return reg;
}

function contarSolucoes(n, reg, limite) {
  const colUsada = new Array(n).fill(false);
  const regUsada = new Array(n).fill(false);
  let total = 0;
  function ir(r, anterior) {
    if (total >= limite) return;
    if (r === n) { total++; return; }
    for (let c = 0; c < n; c++) {
      if (colUsada[c] || regUsada[reg[r][c]]) continue;
      if (r > 0 && Math.abs(anterior - c) <= 1) continue;
      colUsada[c] = true; regUsada[reg[r][c]] = true;
      ir(r + 1, c);
      colUsada[c] = false; regUsada[reg[r][c]] = false;
    }
  }
  ir(0, -9);
  return total;
}

function gerarFase(nivel) {
  const n = tamanhoDoNivel(nivel);
  const rand = criarRng(nivel * 7919 + 13);
  for (let tentativa = 0; tentativa < 20000; tentativa++) {
    const solucao = sortearSolucao(n, rand);
    const regioes = crescerRegioes(n, solucao, rand);
    if (contarSolucoes(n, regioes, 2) === 1) return { n, solucao, regioes };
  }
  return null;
}

if (typeof module !== 'undefined') module.exports = { gerarFase, tamanhoDoNivel, contarSolucoes };
