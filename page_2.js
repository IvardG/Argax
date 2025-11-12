document.addEventListener("DOMContentLoaded", () => {
  // Lecture du message principal immédiatement
  const audio = new Audio("les-enfants-d-argax.mp3");
  audio.volume = 1.0;
  audio.play();

  // Création du halo et du cercle
  const halo = document.createElement("div");
  halo.classList.add("halo");
  document.body.appendChild(halo);

  // Création de l'anneau SVG
  const svgNS = "http://www.w3.org/2000/svg";
  const ring = document.createElementNS(svgNS, "svg");
  ring.setAttribute("id", "ring");
  ring.setAttribute("viewBox", "0 0 400 400");

  const circles = [
    { r: 120, color: "#C0C0C0", width: 1.2 },
    { r: 150, color: "#D4AF37", width: 2.5 },
    { r: 180, color: "#8B1E3F", width: 1.8 }
  ];

  circles.forEach(cfg => {
    const c = document.createElementNS(svgNS, "circle");
    c.setAttribute("cx", "200");
    c.setAttribute("cy", "200");
    c.setAttribute("r", cfg.r);
    c.setAttribute("stroke", cfg.color);
    c.setAttribute("stroke-width", cfg.width);
    c.setAttribute("fill", "none");
    c.style.opacity = 0.6;
    ring.appendChild(c);
  });

  document.body.appendChild(ring);

  // --- Textes synchronisés ---
  const lines = [
    "Transmission entrante...",
    "Canal sécurisé ouvert.",
    "Fréquence 7-4-9"
  ];

  lines.forEach((text, i) => {
    const el = document.createElement("div");
    el.classList.add("line");
    el.textContent = text;
    el.style.top = `${60 + i * 8}vh`;
    document.body.appendChild(el);
    lines[i] = el; // remplace le texte par l'élément
  });

  // Synchronisation avec la bande-son
  setTimeout(() => lines[0].classList.add("visible"), 79530);
  setTimeout(() => lines[1].classList.add("visible"), 83370);
  setTimeout(() => {
    lines[2].classList.add("visible", "glitch");
    setTimeout(() => lines[2].classList.remove("glitch"), 2500);
  }, 87360);

  // --- Code secret "749" ---
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
