const audio = document.getElementById("audio");
const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");
const line3 = document.getElementById("line3");
const canvas = document.getElementById("oscilloscope");
const ctx = canvas.getContext("2d");

let animationId = null;
let sequenceStarted = false;
let audioCtx = null;
let analyser = null;

// Resize canvas
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = 120;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Lancement audio et AudioContext au clic
document.body.addEventListener("click", async () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
  }
  if (audio.paused) try { await audio.play(); } catch(e){ console.warn(e); }
});

// Timing phrases et cercles
audio.addEventListener("play", () => {
  if (sequenceStarted) return;
  sequenceStarted = true;

  document.querySelectorAll(".signal-circle").forEach(c => c.classList.add("pulse"));

  setTimeout(() => line1.classList.add("visible"), 81220);
  setTimeout(() => line2.classList.add("visible", "pulse"), 83940);
  setTimeout(() => line3.classList.add("visible"), 88230);

  startOscilloscope();
});

audio.addEventListener("pause", () => {
  document.querySelectorAll(".signal-circle").forEach(c => c.classList.remove("pulse"));
  cancelAnimationFrame(animationId);
});

audio.addEventListener("ended", () => {
  document.querySelectorAll(".signal-circle").forEach(c => c.classList.remove("pulse"));
  cancelAnimationFrame(animationId);
});

// Oscilloscope centré
function startOscilloscope() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArrayLocal = new Uint8Array(bufferLength);
  const amplitude = 50;

  function draw() {
    analyser.getByteFrequencyData(dataArrayLocal);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#d4af7f';

    const midX = canvas.width / 2;
    const cY = canvas.height / 2;
    const half = Math.floor(bufferLength / 2);

    // Gauche
    ctx.beginPath();
    for (let i = 0; i < half; i++) {
      const shiftedIndex = Math.min(bufferLength - 1, i + 5);
      const rawValue = dataArrayLocal[shiftedIndex] / 255;
      const value = Math.sqrt(rawValue);
      const x = midX - (i / Math.max(1, half - 1)) * midX;
      const y = cY - value * amplitude;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Droite
    ctx.beginPath();
    for (let i = 0; i < half; i++) {
      const shiftedIndex = Math.min(bufferLength - 1, i + 5);
      const rawValue = dataArrayLocal[shiftedIndex] / 255;
      const value = Math.sqrt(rawValue);
      const x = midX + (i / Math.max(1, half - 1)) * midX;
      const y = cY - value * amplitude;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    animationId = requestAnimationFrame(draw);
  }
  draw();
}

// Code secret 749
let inputBuffer = "";
document.addEventListener("keydown", e => {
  if (/^[0-9]$/.test(e.key)) {
    inputBuffer += e.key;
    if (inputBuffer.length > 3) inputBuffer = inputBuffer.slice(-3);
    if (inputBuffer === "749") window.location.href = "https://discord.gg/tonLienDiscord";
  }
});
