// ===========================
// PAGE_2.JS — Transmission directe, code secret caché
// ===========================

let audioContext, analyser, dataArray, animationId;
let messageAudio;

// --- Initialisation ---
window.addEventListener('DOMContentLoaded', async () => {
  await setupAudioContext();
  startCircularVisualizer();
  playTransmission();
  startTransmissionSequence();
});

// ===========================
// AUDIO SETUP
// ===========================
async function setupAudioContext() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  dataArray = new Uint8Array(analyser.frequencyBinCount);
}

// ===========================
// LECTURE DE L’AUDIO
// ===========================
async function playTransmission() {
  messageAudio = new Audio('les-enfants-d-argax.mp3');
  messageAudio.volume = 1.0;

  const msgSource = audioContext.createMediaElementSource(messageAudio);
  msgSource.connect(analyser);
  analyser.connect(audioContext.destination);

  try {
    await messageAudio.play();
  } catch (err) {
    console.warn("Lecture bloquée par le navigateur : interaction requise.", err);
  }
}

// ===========================
// VISUALISATION CIRCULAIRE (SVG)
// ===========================
function startCircularVisualizer() {
  const ring = document.getElementById('osc-ring');
  if (!ring) return;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  ring.setAttribute('stroke-dasharray', String(circumference));

  const bufferLength = analyser.frequencyBinCount;
  const dataArrayLocal = new Uint8Array(bufferLength);

  let t = 0;
  function draw() {
    analyser.getByteFrequencyData(dataArrayLocal);
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArrayLocal[i] / 255;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / bufferLength);
    const visible = Math.max(0.05, Math.min(1, rms * 1.8));
    const offset = circumference * (1 - visible);
    ring.style.strokeDashoffset = String(offset);
    const pulse = 1 + rms * 0.15;
    ring.style.transform = `scale(${pulse})`;
    ring.style.transformOrigin = '110px 110px';
    ring.style.opacity = String(0.6 + rms * 0.5);
    t += 1;
    ring.style.rotate = `${t * 0.5}deg`;
    animationId = requestAnimationFrame(draw);
  }
  draw();
}

// ===========================
// SYNCHRONISATION DU TEXTE
// ===========================
function startTransmissionSequence() {
  const l1 = document.getElementById('line1');
  const l2 = document.getElementById('line2');
  const l3 = document.getElementById('line3');

  // Ajuste ces timings en ms pour caler sur la bande son
  setTimeout(() => l1.classList.add('visible'), 79530);
  setTimeout(() => l2.classList.add('visible'), 83370);
  setTimeout(() => l3.classList.add('visible'), 87360);
}

// ===========================
// CODE SECRET (inchangé)
// ===========================
let inputBuffer = "";
document.addEventListener("keydown", e => {
  if (/^[0-9]$/.test(e.key)) {
    inputBuffer += e.key;
    if (inputBuffer.length > 3) inputBuffer = inputBuffer.slice(-3);
    if (inputBuffer === "749") {
      window.location.href = "https://discord.gg/tHqVHMNKNu";
    }
  }
});

// ===========================
// NETTOYAGE
// ===========================
window.addEventListener('beforeunload', () => {
  if (animationId) cancelAnimationFrame(animationId);
  if (audioContext) audioContext.close();
});

