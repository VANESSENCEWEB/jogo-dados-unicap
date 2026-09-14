/**
 * Efeitos sonoros com Web Audio API — sem MP3 e sem biblioteca.
 * A rolagem imita dados na mesa (estalos + ruído) e o pouso é um baque.
 */
let audioCtx;
let somLigado = true;

export function somEstaLigado() {
  return somLigado;
}

export function definirSom(ligado) {
  somLigado = Boolean(ligado);
}

function getCtx() {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) audioCtx = new AudioContextClass();
  return audioCtx;
}

async function preparar() {
  const ctx = getCtx();
  if (!ctx) return null;
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      return null;
    }
  }
  return ctx;
}

function vibrar(padrao) {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(padrao);
  }
}

function ruido(ctx, duracao) {
  const tamanho = Math.max(1, Math.floor(ctx.sampleRate * duracao));
  const buffer = ctx.createBuffer(1, tamanho, ctx.sampleRate);
  const dados = buffer.getChannelData(0);
  for (let i = 0; i < tamanho; i += 1) {
    dados[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  return source;
}

/** Estalo curto de um dado batendo em outro / na madeira. */
function estalo(ctx, inicio, volume = 0.22) {
  const duracao = 0.045 + Math.random() * 0.03;
  const source = ruido(ctx, duracao);
  const filtro = ctx.createBiquadFilter();
  filtro.type = 'bandpass';
  const freq = 900 + Math.random() * 2400;
  filtro.frequency.setValueAtTime(freq, inicio);
  filtro.Q.value = 1.8 + Math.random();

  const ganho = ctx.createGain();
  ganho.gain.setValueAtTime(volume, inicio);
  ganho.gain.exponentialRampToValueAtTime(0.001, inicio + duracao);

  source.connect(filtro);
  filtro.connect(ganho);
  ganho.connect(ctx.destination);
  source.start(inicio);
}

function tom(ctx, { frequencia, inicio, duracao, tipo = 'triangle', volume = 0.08 }) {
  const osc = ctx.createOscillator();
  const ganho = ctx.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(frequencia, inicio);
  ganho.gain.setValueAtTime(volume, inicio);
  ganho.gain.exponentialRampToValueAtTime(0.001, inicio + duracao);
  osc.connect(ganho);
  ganho.connect(ctx.destination);
  osc.start(inicio);
  osc.stop(inicio + duracao + 0.02);
}

/** Clique seco ao trocar a skin no carrossel. */
export async function tocarCliqueUi() {
  if (!somLigado) return;
  const ctx = await preparar();
  if (!ctx) return;
  estalo(ctx, ctx.currentTime, 0.12);
}

/**
 * Rolagem: ~1,25s de estalos irregulares + um ruído grave de “correr na mesa”.
 * Dura quase a animação 3D, para parecer dado de verdade.
 */
export async function tocarRolagem() {
  if (!somLigado) return;
  const ctx = await preparar();
  if (!ctx) return;

  const agora = ctx.currentTime;
  const duracao = 1.22;
  vibrar([18, 30, 18, 40, 22]);

  const source = ruido(ctx, duracao);
  const filtro = ctx.createBiquadFilter();
  filtro.type = 'lowpass';
  filtro.frequency.setValueAtTime(420, agora);
  filtro.frequency.exponentialRampToValueAtTime(180, agora + duracao);

  const ganho = ctx.createGain();
  ganho.gain.setValueAtTime(0.07, agora);
  ganho.gain.exponentialRampToValueAtTime(0.02, agora + duracao * 0.7);
  ganho.gain.exponentialRampToValueAtTime(0.001, agora + duracao);

  source.connect(filtro);
  filtro.connect(ganho);
  ganho.connect(ctx.destination);
  source.start(agora);

  let t = 0.02;
  while (t < duracao - 0.08) {
    estalo(ctx, agora + t, 0.14 + Math.random() * 0.1);
    t += 0.045 + Math.random() * 0.09;
  }
}

/** Baque do dado parando na mesa. */
export async function tocarPouso() {
  if (!somLigado) return;
  const ctx = await preparar();
  if (!ctx) return;

  const agora = ctx.currentTime;
  vibrar([40, 60, 25]);

  tom(ctx, { frequencia: 140, inicio: agora, duracao: 0.16, tipo: 'sine', volume: 0.11 });
  tom(ctx, { frequencia: 82, inicio: agora, duracao: 0.22, tipo: 'sine', volume: 0.07 });
  estalo(ctx, agora, 0.28);
  estalo(ctx, agora + 0.035, 0.16);
}

export async function tocarResultado(tipo) {
  if (!somLigado) return;
  const ctx = await preparar();
  if (!ctx) return;

  const agora = ctx.currentTime;

  if (tipo === 'empate') {
    tom(ctx, { frequencia: 220, inicio: agora, duracao: 0.18, tipo: 'sine', volume: 0.07 });
    tom(ctx, { frequencia: 196, inicio: agora + 0.12, duracao: 0.22, tipo: 'sine', volume: 0.06 });
    return;
  }

  tom(ctx, { frequencia: 392, inicio: agora, duracao: 0.12, volume: 0.08 });
  tom(ctx, { frequencia: 523, inicio: agora + 0.1, duracao: 0.14, volume: 0.09 });
  tom(ctx, { frequencia: 659, inicio: agora + 0.22, duracao: 0.32, volume: 0.1 });
}
