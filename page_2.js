// page_2.js — version cinématique + anneaux affinés
window.addEventListener("DOMContentLoaded", () => {
  // ===== Préparation Audio =====
  let audio = document.getElementById("audio");
  if (!audio) {
    audio = document.createElement("audio");
    audio.id = "audio";
    document.body.appendChild(audio);
  }
  audio.src = "les-enfants-d-argax.mp3";
  audio.loop = false;
  audio.crossOrigin = "anonymous";
  audio.load();

  // stoppe tout autre son
  document.querySelectorAll("audio").forEach(a => {
    if (a !== audio) {
      a.pause(); a.currentTime = 0; a.removeAttribute("src"); a.load();
    }
  });

  const l1 = document.getElementById("line1");
  const l2 = document.getElementById("line2");
  const l3 = document.getElementById("line3");
  const container = document.querySelector(".content") || document.body;

  // ===== CANVAS FOND CINÉMATIQUE =====
  const canvas = document.createElement("canvas");
  canvas.id = "backgroundCanvas";
  Object.assign(canvas.style, {
    position: "fixed",
    top: "0", left: "0", width: "100%", height: "100%",
    zIndex: "1", pointerEvents: "none",
  });
  document.body.prepend(canvas);
  const ctx2d = canvas.getContext("2d");
  let w, h;
  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // étoiles
  const stars = Array.from({ length: 250 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random() * 0.5 + 0.5,
    size: Math.random() * 1.2 + 0.3,
    twinkle: Math.random() * 1.5
  }));

  let vortexAngle = 0;
  function drawBackground() {
    ctx2d.clearRect(0, 0, w, h);
    // gradient radial brume dorée
    const grad = ctx2d.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)/1.2);
    grad.addColorStop(0, "rgba(212,175,55,0.12)");
    grad.addColorStop(1, "rgba(11,12,16,0.9)");
    ctx2d.fillStyle = grad;
    ctx2d.fillRect(0, 0, w, h);

    // vortex tournant rouge mat très diffus
    ctx2d.save();
    ctx2d.translate(w/2, h/2);
    ctx2d.rotate(vortexAngle);
    const vortexGrad = ctx2d.createRadialGradient(0, 0, 0, 0, 0, Math.max(w,h)/2);
    vortexGrad.addColorStop(0, "rgba(139,30,63,0.10)");
    vortexGrad.addColorStop(1, "rgba(11,12,16,0)");
    ctx2d.fillStyle = vortexGrad;
    ctx2d.beginPath();
    ctx2d.arc(0, 0, Math.max(w,h)/2, 0, Math.PI*2);
    ctx2d.fill();
    ctx2d.restore();
    vortexAngle += 0.0004;

    // étoiles scintillantes
    stars.forEach(s => {
      s.twinkle += 0.05;
      const alpha = 0.4 + Math.sin(s.twinkle) * 0.4;
      ctx2d.fillStyle = `rgba(192,192,192,${alpha})`;
      ctx2d.beginPath();
      ctx2d.arc(s.x, s.y, s.size, 0, Math.PI*2);
      ctx2d.fill();
      // déplacement lent pour donner un effet de glissement
      s.x += 0.02 * s.z;
      if (s.x > w) s.x = 0;
    });
  }

  // ===== Anneau d’Argax revisité =====
  const ringWrapper = document.createElement("div");
  ringWrapper.id = "argax-ring";
  ringWrapper.innerHTML = `
    <svg width="420" height="420" viewBox="0 0 300 300">
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.9"/>
          <stop offset="60%" stop-color="#8B1E3F" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#0B0C10" stop-opacity="0"/>
        </radialGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="4"/></filter>
      </defs>
      <circle cx="150" cy="150" r="110" fill="url(#halo)" filter="url(#blur)"/>
      <circle id="ringGold" cx="150" cy="150" r="110" stroke="#D4AF37" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle id="ringSilver" cx="150" cy="150" r="90" stroke="#C0C0C0" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <circle id="ringRed" cx="150" cy="150" r="130" stroke="#8B1E3F" stroke-width="1" fill="none" stroke-linecap="round"/>
    </svg>`;
  Object.assign(ringWrapper.style, {
    position: "fixed", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)", zIndex: "20",
    pointerEvents: "none", width: "420px", height: "420px"
  });
  container.appendChild(ringWrapper);

  const ringGold = ringWrapper.querySelector("#ringGold");
  const ringSilver = ringWrapper.querySelector("#ringSilver");
  const ringRed = ringWrapper.querySelector("#ringRed");

  // ===== AudioContext + analyser =====
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const src = ctx.createMediaElementSource(audio);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  src.connect(analyser);
  analyser.connect(ctx.destination);

  audio.play().catch(()=>{});

  // ===== Glitch =====
  const glitchChars = ['▓','▒','░','█','@','#','%','*','≈','±'];
  function glitchEffect(el, duration = 1200, intervalMs = 60) {
    if (!el) return;
    const original = el.textContent;
    const iv = setInterval(() => {
      el.textContent = original
        .split('')
        .map(ch => (Math.random() > 0.7 ? glitchChars[Math.floor(Math.random()*glitchChars.length)] : ch))
        .join('');
    }, intervalMs);
    setTimeout(() => { clearInterval(iv); el.textContent = original; }, duration);
  }

  if (l2) {
    const mo = new MutationObserver(muts => {
      muts.forEach(m => {
        if (m.attributeName === "class" && m.target.classList.contains("glitch")) glitchEffect(m.target);
      });
    });
    mo.observe(l2, { attributes: true });
  }

  // ===== Affichage des lignes =====
  setTimeout(() => l1?.classList.add("visible"), 79530);
  setTimeout(() => { if (l2) { l2.classList.add("visible"); l2.classList.add("glitch"); }}, 83370);
  setTimeout(() => l3?.classList.add("visible"), 87360);

  // ===== Animation principale =====
  let rotG=0, rotS=0, rotR=0;
  function animate() {
    requestAnimationFrame(animate);
    drawBackground();
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i=0;i<dataArray.length;i++) sum += (dataArray[i]/255)**2;
    const rms = Math.sqrt(sum/dataArray.length);
    const e = Math.min(1, rms*2.2);

    const gScale = 1 + e*0.1 + Math.sin(Date.now()/600)*0.02;
    const sScale = 1 + e*0.05;
    const rScale = 1 + e*0.12;
    ringGold.setAttribute("transform", `rotate(${rotG},150,150) scale(${gScale})`);
    ringSilver.setAttribute("transform", `rotate(${rotS},150,150) scale(${sScale})`);
    ringRed.setAttribute("transform", `rotate(${rotR},150,150) scale(${rScale})`);
    ringGold.setAttribute("stroke-width", 2 + e*3);
    ringSilver.setAttribute("stroke-width", 1.2 + e*1.2);
    ringRed.setAttribute("stroke-width", 1 + e*2);
    ringRed.style.opacity = String(0.3 + e*0.5);

    rotG += 0.1 + e*0.25;
    rotS -= 0.08 + e*0.15;
    rotR += 0.04 + e*0.1;
  }
  animate();

  // ===== Code secret =====
  let inputBuffer = "";
  document.addEventListener("keydown", e => {
    if (/^[0-9]$/.test(e.key)) {
      inputBuffer += e.key;
      if (inputBuffer.length > 3) inputBuffer = inputBuffer.slice(-3);
      if (inputBuffer === "749") window.location.href = "https://discord.gg/tHqVHMNKNu";
    }
  });
});
