const intro = document.getElementById("introSound");
const click = document.getElementById("clickSound");
const message = document.getElementById("messageSound");
const canvas = document.getElementById("oscilloscope");
const ctx = canvas.getContext("2d");

const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");
const line3 = document.getElementById("line3");

let audioCtx = null;
let analyser = null;
let dataArray = null;
let animationId = null;
let sequenceStarted = false;

// Ajustement du canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = 400;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Clic pour passer de l'intro à la transmission
document.body.addEventListener("click", async () => {
  if (sequenceStarted) return;
  sequenceStarted = true;

  intro.pause();
  intro.currentTime = 0;
  click.play();

  setTimeout(() => {
    fadeInMessage();
  }, 300);
});

// Fade-in du message + visualisation circulaire
function fadeInMessage() {
  message.volume = 0;
  message.play();

  const fadeInterval = setInterval(() => {
    if (message.volume < 1) message.volume = Math.min(1, message.volume + 0.02);
    else clearInterval(fadeInterval);
  }, 100);

  setupAudioContext();
  startCircularVisualizer();
  startTransmissionSequence();
}

// Prépare le contexte audio
function setupAudioContext() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const src = audioCtx.createMediaElementSource(message);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  src.connect(analyser);
  analyser.connect(audioCtx.destination);
  dataArray = new Uint8Array(analyser.frequencyBinCount);
}

// Oscilloscope circulaire
function startCircularVisualizer() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArrayLocal = new Uint8Array(bufferLength);

  function draw() {
    analyser.getByteFrequencyData(dataArrayLocal);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 100;
    const points = 128; // nombre de points autour du cercle
    const angleStep = (Math.PI * 2) / points;

    ctx.beginPath();
    for (let i = 0; i < points; i++) {
      const value = dataArrayLocal[i % bufferLength] / 255;
      const amplitude = radius + value * 80;
      const angle = i * angleStep;

      const x = cx + Math.cos(angle) * amplitude;
      const y = cy + Math.sin(angle) * amplitude;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Halo doux et couleur dorée
    ctx.strokeStyle = "#d4af7f";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#d4af7f";
    ctx.lineWidth = 2;
    ctx.stroke();

    animationId = requestAnimationFrame(draw);
  }

  draw();
}

// Synchronisation des phrases avec la bande son
function startTransmissionSequence() {
  setTimeout(() => line1.classList.add("visible"), 79530);
  setTimeout(() => line2.classList.add("visible", "pulse"), 83370);
  setTimeout(() => line3.classList.add("visible"), 87360);

  message.addEventListener("ended", () => {
    cancelAnimationFrame(animationId);
  });
}

// Code secret "749"
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
