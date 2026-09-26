const intro = document.getElementById("introSound");
const click = document.getElementById("clickSound");
const message = document.getElementById("messageSound");

const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");
const line3 = document.getElementById("line3");

let audioCtx = null;
let analyser = null;
let animationId = null;
let sequenceStarted = false;
let rotationAngle = 0;

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

function setupAudioContext() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const src = audioCtx.createMediaElementSource(message);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  src.connect(analyser);
  analyser.connect(audioCtx.destination);
}

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
    const y = cy + Math.sin(angle) * radius;
    
    if (i === 0) {
      pathData += `M${x},${y}`;
    } else {
      pathData += ` L${x},${y}`;
    }
  }
  
  return pathData;
}

function startSpiralVisualizer() {
  const spiralPath = document.getElementById("spiral-path");
  const spiralGroup = document.getElementById("spiral-group");
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArrayLocal = new Uint8Array(bufferLength);

  function draw() {
    analyser.getByteFrequencyData(dataArrayLocal);
    
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArrayLocal[i];
    }
    const average = sum / bufferLength;
    const amplitude = 0.6 + (average / 255) * 1.4;

    const newPath = generateSpiral(amplitude);
    spiralPath.setAttribute("d", newPath);
    
    rotationAngle += 0.5;
    if (rotationAngle > 360) rotationAngle = 0;
    spiralGroup.setAttribute("transform", `rotate(${rotationAngle} 200 200)`);
    
    const maxFreq = Math.max(...dataArrayLocal);
    spiralPath.style.opacity = 0.5 + (maxFreq / 255) * 0.5;

    animationId = requestAnimationFrame(draw);
  }

  draw();
}

function startTransmissionSequence() {
  setTimeout(() => line1.classList.add("visible"), 79530);
  setTimeout(() => line2.classList.add("visible"), 83370);
  setTimeout(() => line3.classList.add("visible"), 87360);

  message.addEventListener("ended", () => {
    cancelAnimationFrame(animationId);
  });
}

let inputBuffer = "";
document.addEventListener("keydown", e => {
  if (/^[0-9]$/.test(e.key)) {
    inputBuffer += e.key;
    if (inputBuffer.length > 3) inputBuffer = inputBuffer.slice(-3);
    if (inputBuffer === "749") {
      window.location.href = "https://discord.gg/tHqVHMNKNu";
    }
  }
});const intro = document.getElementById("introSound");
const click = document.getElementById("clickSound");
const message = document.getElementById("messageSound");
const spiralePath = document.getElementById("spiral-path");
const spiralGroup = document.getElementById("spiral-group");

const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");
const line3 = document.getElementById("line3");

let audioCtx = null;
let analyser = null;
let animationId = null;
let sequenceStarted = false;
let rotationAngle = 0;

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

function setupAudioContext() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const src = audioCtx.createMediaElementSource(message);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  src.connect(analyser);
  analyser.connect(audioCtx.destination);
}

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
    const y = cy + Math.sin(angle) * radius;
    
    if (i === 0) {
      pathData += `M${x},${y}`;
    } else {
      pathData += ` L${x},${y}`;
    }
  }
  
  return pathData;
}

function startSpiralVisualizer() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArrayLocal = new Uint8Array(bufferLength);

  function draw() {
    analyser.getByteFrequencyData(dataArrayLocal);
    
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArrayLocal[i];
    }
    const average = sum / bufferLength;
    const amplitude = 0.6 + (average / 255) * 1.4;

    // Mise à jour de la spirale
    const newPath = generateSpiral(amplitude);
    spiralePath.setAttribute("d", newPath);
    
    // Rotation continue
    rotationAngle += 0.5; // Vitesse de rotation
    if (rotationAngle > 360) rotationAngle = 0;
    spiralGroup.setAttribute("transform", `rotate(${rotationAngle} 200 200)`);
    
    // Variation d'opacité avec l'audio
    const maxFreq = Math.max(...dataArrayLocal);
    spiralPath.style.opacity = 0.5 + (maxFreq / 255) * 0.5;

    animationId = requestAnimationFrame(draw);
  }

  draw();
}

function startTransmissionSequence() {
  setTimeout(() => line1.classList.add("visible"), 79530);
  setTimeout(() => line2.classList.add("visible"), 83370);
  setTimeout(() => line3.classList.add("visible"), 87360);

  message.addEventListener("ended", () => {
    cancelAnimationFrame(animationId);
  });
}

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
