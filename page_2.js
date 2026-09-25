const intro = document.getElementById("introSound");
const click = document.getElementById("clickSound");
const message = document.getElementById("messageSound");
const spiralePath = document.getElementById("spiral-path");

const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");
const line3 = document.getElementById("line3");

let audioCtx = null;
let analyser = null;
let dataArray = null;
let animationId = null;
let sequenceStarted = false;

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

// Fade-in du message + visualisation spirale
function fadeInMessage() {
  message.volume = 0;
  message.play();

  const fadeInterval = setInterval(() => {
    if (message.volume < 1) message.volume = Math.min(1, message.volume + 0.02);
    else clearInterval(fadeInterval);
  }, 100);

  setupAudioContext();
  startSpiralVisualizer();
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

// Génère la spirale d'Argax
function generateSpiral(amplitude = 1) {
  const cx = 200;
  const cy = 200;
  const turns = 5;
  const points = 300;
  const maxRadius = 100;
  
  let pathData = "";
  
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const angle = t * Math.PI * 2 * turns;
    const radius = maxRadius * t * amplitude;
    
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * amplitude;
    
    if (i === 0) {
      pathData += `M${x},${y}`;
    } else {
      pathData += ` L${x},${y}`;
    }
  }
  
  return pathData;
}

// Visualiseur spirale qui respire avec l'audio
function startSpiralVisualizer() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArrayLocal = new Uint8Array(bufferLength);

  function draw() {
    analyser.getByteFrequencyData(dataArrayLocal);
    
    // Calcul de l'amplitude moyenne (respiration)
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArrayLocal[i];
    }
    const average = sum / bufferLength;
    const amplitude = 0.5 + (average / 255) * 1.5;

    // Mise à jour de la spirale
    const newPath = generateSpiral(amplitude);
    spiralePath.setAttribute("d", newPath);
    
    // Variation d'opacité basée sur les fréquences
    const maxFreq = Math.max(...dataArrayLocal);
    spiralePath.style.opacity = 0.5 + (maxFreq / 255) * 0.5;

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
