const intro = document.getElementById("introSound");
const clickSound = document.getElementById("clickSound");
const message = document.getElementById("messageSound");

const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");
const line3 = document.getElementById("line3");
const canvas = document.getElementById("oscilloscope");
const ctx = canvas.getContext("2d");

let animationId = null;
let audioCtx = null;
let analyser = null;
let dataArray = null;
let hasStarted = false;

// --- Redimensionnement du canvas ---
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = 120;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// --- Initialisation audio après interaction utilisateur ---
document.body.addEventListener("click", async () => {
  if (hasStarted) return;
  hasStarted = true;

  // Lecture du clic
  clickSound.play();

  // Fade-out de la boucle d’intro
  const fadeOut = setInterval(() => {
    if (intro.volume > 0.02) {
      intro.volume -= 0.02;
    } else {
      intro.pause();
      clearInterval(fadeOut);
    }
  }, 100);

  // Lancement du message
  setTimeout(async () => {
    message.volume = 0.7;

    // Création du contexte audio
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaElementSource(message);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    try { await message.play(); } catch(e){ console.warn(e); }

    // Lancement de l’oscilloscope et des phrases
    startOscilloscope();
    startTransmissionText();
  }, 400);
});

// --- Apparition progressive du texte ---
function startTransmissionText() {
  setTimeout(() => line1.classList.add("visible"), 2000);
  setTimeout(() => line2.classList.add("visible", "pulse"), 5000);
  setTimeout(() => line3.classList.add("visible"), 8000);
}

// --- Oscilloscope cosmique ---
function startOscilloscope() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArrayLocal = new Uint8Array(bufferLength);
  const amplitude = 50;

  function draw() {
    analyser.getByteFrequencyData(dataArrayLocal);

    // Légère traînée lumineuse (effet persistance)
    ctx.fillStyle = "rgba(14, 14, 20, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dégradé radial léger
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, "#94d7ff");
    grad.addColorStop(1, "#d4af7f");
    ctx.strokeStyle = grad;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    const centerY = canvas.height / 2;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArrayLocal[i] / 255;
      const y = centerY - (Math.sqrt(v) * amplitude);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.quadraticCurveTo(x - sliceWidth / 2, centerY, x, y);

      x += sliceWidth;
    }

    ctx.stroke();
    animationId = requestAnimationFrame(draw);
  }

  draw();
}

// --- Code secret 749 ---
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
