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

// Ajuste le canvas à la largeur de la fenêtre
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = 120;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Clic pour passer de l'intro à la transmission
document.body.addEventListener("click", async () => {
  if (sequenceStarted) return; // éviter double clic
  sequenceStarted = true;

  // Stop le son d’intro
  intro.pause();
  intro.currentTime = 0;

  // Joue le clic
  click.play();

  // Petit délai pour laisser le "clic" résonner
  setTimeout(() => {
    fadeInMessage();
  }, 300);
});

// Lance le message avec fade-in et oscilloscope
function fadeInMessage() {
  message.volume = 0;
  message.play();

  const fadeInterval = setInterval(() => {
    if (message.volume < 1) message.volume = Math.min(1, message.volume + 0.02);
    else clearInterval(fadeInterval);
  }, 100);

  setupAudioContext();
  startOscilloscope();
  startTransmissionSequence();
}

// Prépare le contexte audio pour l’oscilloscope
function setupAudioContext() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const src = audioCtx.createMediaElementSource(message);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  src.connect(analyser);
  analyser.connect(audioCtx.destination);
  dataArray = new Uint8Array(analyser.frequencyBinCount);
}

// Animation de l’oscilloscope
function startOscilloscope() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArrayLocal = new Uint8Array(bufferLength);
  const amplitude = 50;

  function draw() {
    analyser.getByteFrequencyData(dataArrayLocal);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#d4af7f";

    const midX = canvas.width / 2;
    const cY = canvas.height / 2;
    const half = Math.floor(bufferLength / 2);
    const wHalf = canvas.width / 2;

    // Gauche
    ctx.beginPath();
    for (let i = 0; i < half; i++) {
      const rawValue = dataArrayLocal[i + 5] / 255;
      const value = Math.sqrt(rawValue);
      const x = midX - (i / (half - 1)) * wHalf;
      const y = cY - value * amplitude;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Droite
    ctx.beginPath();
    for (let i = 0; i < half; i++) {
      const rawValue = dataArrayLocal[i + 5] / 255;
      const value = Math.sqrt(rawValue);
      const x = midX + (i / (half - 1)) * wHalf;
      const y = cY - value * amplitude;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    animationId = requestAnimationFrame(draw);
  }
  draw();
}

// Synchronisation des phrases avec la bande son
function startTransmissionSequence() {
  // ces timings sont en millisecondes
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
