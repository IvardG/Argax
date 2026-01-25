// page_2.js — version corrigée : force la lecture de les-enfants-d-argax.mp3
window.addEventListener("DOMContentLoaded", () => {
  // ===== Sélecteurs & éléments de texte =====
  // On cherche d'abord un élément <audio id="audio"> existant
  let audio = document.getElementById("audio");

  // Si l'élément audio existe on s'en sert, sinon on en crée un
  if (!audio) {
    audio = document.createElement("audio");
    audio.id = "audio";
    document.body.appendChild(audio);
  }

  // On force la source voulue (écrase Argax_intro.mp3 si présent)
  audio.src = "les-enfants-d-argax.mp3";
  audio.loop = false;
  audio.crossOrigin = "anonymous"; // utile si cross-origin
  audio.load();

  const l1 = document.getElementById("line1");
  const l2 = document.getElementById("line2");
  const l3 = document.getElementById("line3");
  const container = document.querySelector(".content") || document.body;

  // ===== STOPPER TOUS LES AUTRES AUDIOS (sécurise contre Argax_intro.mp3 actif) =====
  document.querySelectorAll("audio").forEach(a => {
    // si élément audio différent de celui qu'on veut lire, le stopper
    if (a !== audio) {
      try {
        a.pause();
        a.currentTime = 0;
        // si c'est une balise <audio> créée ailleurs, on retire la source pour éviter relance auto
        a.removeAttribute("src");
        a.load();
      } catch (err) {
        console.warn("Impossible de stopper un audio:", err);
      }
    }
  });

  // ===== Création du SVG de l’Anneau d’Argax (triple anneau) =====
  const ringWrapper = document.createElement("div");
  ringWrapper.id = "argax-ring";
  ringWrapper.innerHTML = `
    <svg width="360" height="360" viewBox="0 0 300 300" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.85"/>
          <stop offset="55%" stop-color="#8B1E3F" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#0B0C10" stop-opacity="0"/>
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="4"/>
        </filter>
      </defs>
      <circle cx="150" cy="150" r="95" fill="url(#halo)" filter="url(#blur)"/>
      <circle id="ringGold" cx="150" cy="150" r="95" stroke="#D4AF37" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle id="ringSilver" cx="150" cy="150" r="80" stroke="#C0C0C0" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <circle id="ringRed" cx="150" cy="150" r="110" stroke="#8B1E3F" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    </svg>
  `;
  // style direct (tu peux aussi mettre ces règles dans style.css)
  Object.assign(ringWrapper.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: "20",
    pointerEvents: "none",
    width: "360px",
    height: "360px"
  });
  container.appendChild(ringWrapper);

  const ringGold = ringWrapper.querySelector("#ringGold");
  const ringSilver = ringWrapper.querySelector("#ringSilver");
  const ringRed = ringWrapper.querySelector("#ringRed");

  // ===== AudioContext & Analyser =====
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  // Resume possible (certains navigateurs exigent interaction, mais on essaye)
  if (ctx.state === "suspended") {
    ctx.resume().catch(()=>{ /* silence */ });
  }

  // Connecter l'élément audio à l'analyseur
  const src = ctx.createMediaElementSource(audio);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  src.connect(analyser);
  analyser.connect(ctx.destination);

  // ===== Lancer la lecture (forcée) =====
  audio.play().catch(err => {
    // Certains navigateurs bloquent la lecture automatique ; on avertit mais on continue
    console.warn("La lecture automatique a été bloquée :", err);
  });

  // ===== Synchronisation des phrases (timings fournis) =====
  setTimeout(() => l1 && l1.classList.add("visible"), 79530);
  setTimeout(() => {
    if (l2) {
      l2.classList.add("visible");
      l2.classList.add("glitch"); // déclenche le glitch css + js
    }
  }, 83370);
  setTimeout(() => l3 && l3.classList.add("visible"), 87360);

  // ===== Effet de brouillage (glitch) sur la phrase 2 =====
  const glitchChars = ['▓','▒','░','█','@','#','%','*','≈','±'];
  function glitchEffect(el, duration = 1200, intervalMs = 60) {
    if (!el) return;
    const original = el.textContent;
    const iv = setInterval(() => {
      el.textContent = original
        .split('')
        .map(ch => (Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : ch))
        .join('');
    }, intervalMs);
    setTimeout(() => {
      clearInterval(iv);
      el.textContent = original;
      el.classList.remove("glitch");
    }, duration);
  }
  // observer pour attraper l'ajout de la classe .glitch
  if (l2) {
    const mo = new MutationObserver(muts => {
      muts.forEach(m => {
        if (m.attributeName === "class" && m.target.classList.contains("glitch")) {
          glitchEffect(m.target, 1200, 60);
        }
      });
    });
    mo.observe(l2, { attributes: true });
  }

  // ===== Animation de l'anneau synchronisée au son =====
  let rotG = 0, rotS = 0, rotR = 0;
  function animate() {
    animationId = requestAnimationFrame(animate);
    analyser.getByteFrequencyData(dataArray);

    // calcul d'énergie (RMS-like)
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) { sum += (dataArray[i] / 255) * (dataArray[i] / 255); }
    const rms = Math.sqrt(sum / bufferLength); // 0..1 approx
    const energy = Math.min(1, rms * 2.2);

    // pulsation légère (or) et variation stroke-width
    const goldPulse = 1 + energy * 0.12 + Math.sin(Date.now() / 600) * 0.01;
    const goldWidth = 2.5 + energy * 3.5;
    ringGold.setAttribute("stroke-width", String(goldWidth));
    ringGold.setAttribute("transform", `rotate(${rotG},150,150) scale(${goldPulse})`);

    // silver tourne inverse, vitesse dépendante de bas-médiums
    const silverPulse = 1 + Math.sin(Date.now() / 1100) * 0.005;
    const silverWidth = 1.2 + energy * 1.2;
    ringSilver.setAttribute("stroke-width", String(silverWidth));
    ringSilver.setAttribute("transform", `rotate(${rotS},150,150) scale(${silverPulse})`);

    // ring red large, souffle + opacité variable via style
    const redPulse = 1 + energy * 0.06;
    const redWidth = 1.2 + energy * 2.0;
    ringRed.setAttribute("stroke-width", String(redWidth));
    ringRed.setAttribute("transform", `rotate(${rotR},150,150) scale(${redPulse})`);
    ringRed.style.opacity = String(0.35 + energy * 0.6);

    // rotation speeds (différentiels)
    rotG += 0.12 + energy * 0.3; // or tourne plus vite sur énergie
    rotS -= 0.09 + energy * 0.18; // argent inverse
    rotR += 0.04 + energy * 0.12; // rouge lent
  }
  animate();

  // ===== Code secret "749" (inchangé) =====
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

  // ===== Nettoyage éventuel =====
  window.addEventListener("beforeunload", () => {
    if (animationId) cancelAnimationFrame(animationId);
    if (ctx && ctx.close) ctx.close();
  });
});
