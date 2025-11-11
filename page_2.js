// ===========================
// PAGE_2.JS — Les Enfants d’Argax
// ===========================

// --- Variables globales ---
let audioContext, analyser, source, dataArray, animationId;
let audioElement = document.getElementById('audio');

// --- Initialisation globale ---
window.addEventListener('DOMContentLoaded', async () => {
  await setupAudioContext();
  startCircularVisualizer();
  playAmbientLoop();
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

  // Connecter la balise audio à l’analyseur et à la sortie
  source = audioContext.createMediaElementSource(audioElement);
  source.connect(analyser);
  analyser.connect(audioContext.destination);
}

// ===========================
// AMBIANCE AUDIO
// ===========================
function playAmbientLoop() {
  audioElement.loop = true;
  audioElement.volume = 0.8;
  audioElement.play().catch(err => {
    console.warn("Lecture auto bloquée, interaction utilisateur requise :", err);
  });
}

// ===========================
// VISUALISATION SVG (Anneau)
// ===========================
function startCircularVisualizer() {
  const ring = document.getElementById('osc-ring');
  const base = document.getElementById('osc-base');

  const baseRadius = 70;
  const circumference = 2 * Math.PI * baseRadius;
  ring.setAttribute('stroke-dasharray', String(circumference));

  const bufferLength = analyser.frequencyBinCount;
  const dataArrayLocal = new Uint8Array(bufferLength);

  let t = 0;
  function drawSVG() {
    analyser.getByteFrequencyData(dataArrayLocal);

    // Calcul RMS global
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArrayLocal[i] / 255;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / bufferLength); // 0 à 1 environ

    // Modulation du dash (longueur visible de l’anneau)
    const visible = Math.max(0.05, Math.min(1, rms * 1.8));
    const offset = circumference * (1 - visible);
    ring.style.strokeDashoffset = String(offset);

    // Effets de pulsation et wobble
    const pulse = 1 + rms * 0.08;
    const wobble = 1 + Math.sin(t * 0.02) * 0.005 + rms * 0.02;
    ring.style.transform = `translate3d(0,0,0) scale(${pulse * wobble})`;
    ring.style.transformOrigin = '110px 110px';

    // Largeur et opacité
    const sw = 2 + rms * 6;
    ring.setAttribute('stroke-width', String(sw));
    ring.style.opacity = String(0.6 + rms * 0.5);

    // Rotation douce
    t += 1;
    const rot = (t * 0.02) + rms * 12;
    ring.style.rotate = `${rot}deg`;

    animationId = requestAnimationFrame(drawSVG);
  }

  drawSVG();
}

// ===========================
// SYNCHRONISATION DES PHRASES
// ===========================
function startTransmissionSequence() {
  const l1 = document.getElementById('line1');
  const l2 = document.getElementById('line2');
  const l3 = document.getElementById('line3');

  // On synchronise les apparitions avec la bande-son (approx.)
  // Adapte les timings selon la durée de ton fichier audio.
  setTimeout(() => l1.classList.add('visible'), 2000);   // 2s
  setTimeout(() => l2.classList.add('visible'), 6500);   // 6.5s
  setTimeout(() => l3.classList.add('visible'), 10500);  // 10.5s
}

// ===========================
// NETTOYAGE
// ===========================
window.addEventListener('beforeunload', () => {
  if (animationId) cancelAnimationFrame(animationId);
  if (audioContext) audioContext.close();
});
