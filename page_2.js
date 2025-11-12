// === PAGE_2.JS — Version Transmission Cosmique ===
// Lecture automatique du message + visualisation circulaire + texte synchronisé + code secret

window.addEventListener("DOMContentLoaded", () => {
  const audio = new Audio("les-enfants-d-argax.mp3");
  audio.volume = 1.0;
  audio.play();

  // === Crée le SVG visuel dynamique ===
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "transmission-ring");
  svg.setAttribute("viewBox", "0 0 400 400");
  document.querySelector("main").appendChild(svg);

  const ring = document.createElementNS(svgNS, "circle");
  ring.setAttribute("cx", "200");
  ring.setAttribute("cy", "200");
  ring.setAttribute("r", "120");
  ring.setAttribute("stroke", "rgba(0,255,255,0.5)");
  ring.setAttribute("stroke-width", "2");
  ring.setAttribute("fill", "none");
  svg.appendChild(ring);

  // === Particules cosmiques autour de l’anneau ===
  const particles = [];
  for (let i = 0; i < 60; i++) {
    const p = document.createElementNS(svgNS, "circle");
    p.setAttribute("r", Math.random() * 1.5 + 0.5);
    p.setAttribute("fill", "rgba(0,255,255,0.4)");
    svg.appendChild(p);
    particles.push({
      el: p,
      angle: Math.random() * Math.PI * 2,
      radius: 120 + Math.random() * 20 - 10,
      speed: Math.random() * 0.002 + 0.001
    });
  }

  // === Analyser audio pour animer ===
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const src = audioCtx.createMediaElementSource(audio);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  src.connect(analyser);
  analyser.connect(audioCtx.destination);
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function animate() {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(dataArray);

    // Intensité moyenne du spectre
    let avg = dataArray.reduce((a, b) => a + b) / bufferLength;
    let glow = 0.2 + avg / 512;

    // Animation du ring (pulsation)
    ring.setAttribute(
      "stroke",
      `rgba(0,255,255,${Math.min(1, glow)})`
    );
    ring.setAttribute("stroke-width", 2 + glow * 4);

    // Mouvement des particules
    particles.forEach((p) => {
      p.angle += p.speed;
      const x = 200 + Math.cos(p.angle) * p.radius;
      const y = 200 + Math.sin(p.angle) * p.radius;
      p.el.setAttribute("cx", x);
      p.el.setAttribute("cy", y);
      p.el.setAttribute("fill", `rgba(0,255,255,${0.2 + glow * 0.6})`);
    });
  }
  animate();

  // === Synchronisation du texte ===
  const l1 = document.getElementById("line1");
  const l2 = document.getElementById("line2");
  const l3 = document.getElementById("line3");

  // timings en ms pour caler sur la bande son
  setTimeout(() => l1.classList.add("visible"), 79530);
  setTimeout(() => l2.classList.add("visible"), 83370);
  setTimeout(() => l3.classList.add("visible"), 87360);

  // === Code secret "749" ===
  let inputBuffer = "";
  document.addEventListener("keydown", (e) => {
    if (/^[0-9]$/.test(e.key)) {
      inputBuffer += e.key;
      if (inputBuffer.length > 3) inputBuffer = inputBuffer.slice(-3);
      if (inputBuffer === "749") {
        window.location.href = "https://discord.gg/tHqVHMNKNu";
      }
    }
  });
});
