// ===========================
// PAGE_2.JS — Les Enfants d’Argax
// ===========================

let audioContext, analyser, dataArray, animationId;
let ambient, messageAudio;
let sequenceStarted = false;

// --- Initialisation ---
window.addEventListener('DOMContentLoaded', async () => {
  await setupAudioContext();
  startCircularVisualizer();
  playAmbientLoop();
  startTransmissionSequence();
  enableClickForTransmission();
});

// ===========================
// AUDIO SETUP
// ===========================
async function setupAudioContext() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  dataArray = new Uint8Array(analyser.frequencyBinCount);

  // Ambiance principale
  ambient = new Audio('Argax_intro.mp3');
  ambient.loop = true;
  ambient.volume = 0.7;
  const source = audioContext.createMediaElementSource(ambient);
  source.connect(analyser);
  analyser.connect(audioContext.destination);
}

// ===========================
// AMBIANCE AUDIO
// ===========================
function playAmbientLoop() {
  ambient.play().catch(() => {
    console.warn("Lecture auto bloquée — cliquez pour activer le son.");
  });
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

  setTimeout(() => line1.classList.add("visible"), 79530);
  setTimeout(() => line2.classList.add("visible", "pulse"), 83370);
  setTimeout(() => line3.classList.add("visible"), 87360);

}

// ===========================
// GESTION DU CLIC POUR LANCER LA TRANSMISSION
// ===========================
function enableClickForTransmission() {
  document.body.addEventListener('click', async () => {
    // Évite double clics
    if (sequenceStarted) return;
    sequenceStarted = true;

    // 1. Stop la boucle d'ambiance
    ambient.pause();

    // 2. Joue le son du clic
    const clickSound = new Audio('clic.mp3');
    clickSound.volume = 0.8;
    await clickSound.play().catch(err => console.warn(err));

    // 3. Lance la transmission principale
    messageAudio = new Audio('les-enfants-d-argax.mp3');
    messageAudio.volume = 1.0;

    const msgSource = audioContext.createMediaElementSource(messageAudio);
    msgSource.connect(analyser);
    analyser.connect(audioContext.destination);

    await messageAudio.play().catch(err => console.warn(err));

    // 4. Quand la transmission se termine, on relance la boucle
    messageAudio.addEventListener('ended', () => {
      sequenceStarted = false;
      playAmbientLoop();
    });
  });
}

// ===========================
// NETTOYAGE
// ===========================
window.addEventListener('beforeunload', () => {
  if (animationId) cancelAnimationFrame(animationId);
  if (audioContext) audioContext.close();
});

