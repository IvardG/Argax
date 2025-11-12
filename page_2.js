window.addEventListener("DOMContentLoaded", () => {
  // ===== Sélecteurs =====
  const audio = document.getElementById("audio");
  const l1 = document.getElementById("line1");
  const l2 = document.getElementById("line2");
  const l3 = document.getElementById("line3");
  const container = document.querySelector(".content");

  // ===== Création du SVG de l’Anneau d’Argax =====
  const ringWrapper = document.createElement("div");
  ringWrapper.id = "argax-ring";
  ringWrapper.innerHTML = `
    <svg width="300" height="300" viewBox="0 0 300 300">
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.8"/>
          <stop offset="60%" stop-color="#8B1E3F" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#0B0C10" stop-opacity="0"/>
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="4"/>
        </filter>
      </defs>
      <!-- Halo -->
      <circle cx="150" cy="150" r="100" fill="url(#halo)" filter="url(#blur)"/>
      <!-- Anneaux -->
      <circle id="ringGold" cx="150" cy="150" r="100" stroke="#D4AF37" stroke-width="2" fill="none" />
      <circle id="ringSilver" cx="150" cy="150" r="85" stroke="#C0C0C0" stroke-width="1" fill="none" />
      <circle id="ringRed" cx="150" cy="150" r="115" stroke="#8B1E3F" stroke-width="1.5" fill="none" />
    </svg>
  `;
  ringWrapper.style.position = "fixed";
  ringWrapper.style.top = "50%";
  ringWrapper.style.left = "50%";
  ringWrapper.style.transform = "translate(-50%, -50%)";
  ringWrapper.style.zIndex = "2";
  container.appendChild(ringWrapper);

  const ringGold = ringWrapper.querySelector("#ringGold");
  const ringSilver = ringWrapper.querySelector("#ringSilver");
  const ringRed = ringWrapper.querySelector("#ringRed");

  // ===== Audio et contexte Web Audio =====
  const ctx = new AudioContext();
  const src = ctx.createMediaElementSource(audio);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  src.connect(analyser);
  analyser.connect(ctx.destination);

  // ===== Lancement audio =====
  audio.play();
  ctx.resume();

  // ===== Synchronisation des phrases =====
  setTimeout(() => l1.classList.add("visible"), 79530);
  setTimeout(() => {
    l2.classList.add("visible");
    l2.classList.add("glitch"); // effet de brouillage
  }, 83370);
  setTimeout(() => l3.classList.add("visible"), 87360);

  // ===== Effet de brouillage sur "Fréquence 7-4-9" =====
  const glitchChars = ['▓','▒','░','█','@','#','%','*','≈','±'];
  function glitchEffect(element, duration = 1200) {
    const original = element.textContent;
    const interval = setInterval(() => {
      element.textContent = original
        .split('')
        .map(ch => (Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : ch))
        .join('');
    }, 60);
    setTimeout(() => {
      clearInterval(interval);
      element.textContent = original;
      element.classList.remove("glitch");
    }, duration);
  }

  // Applique le glitch dès que la classe "glitch" est ajoutée
  const observer = new MutationObserver(mutations => {
    for (let m of mutations) {
      if (m.attributeName === "class" && m.target.classList.contains("glitch")) {
        glitchEffect(m.target);
      }
    }
  });
  observer.observe(l2, { attributes: true });

  // ===== Animation de l’anneau synchronisée au son =====
  let rotationGold = 0;
  let rotationSilver = 0;
  let rotationRed = 0;

  function animateRing() {
    requestAnimationFrame(animateRing);
    analyser.getByteFrequencyData(dataArray);
    const avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength;

    // variation subtile du rayon en fonction de la fréquence moyenne
    const pulse = 1 + Math.sin(Date.now() / 400) * 0.05 + (avg / 512) * 0.2;
    ringGold.setAttribute("transform", `rotate(${rotationGold},150,150) scale(${pulse})`);
    ringSilver.setAttribute("transform", `rotate(${rotationSilver},150,150)`);
    ringRed.setAttribute("transform", `rotate(${rotationRed},150,150)`);

    rotationGold += 0.15 + avg / 2000;
    rotationSilver -= 0.1 + avg / 2500;
    rotationRed += 0.05 + avg / 3000;
  }
  animateRing();

  // ===== Code secret caché =====
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
});
