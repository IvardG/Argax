document.addEventListener("DOMContentLoaded", () => {
  // --- Lecture du son principal dès le chargement ---
  const audio = new Audio("les-enfants-d-argax.mp3");
  audio.volume = 1.0;
  audio.play();

  // --- Création du halo doré vaporeux centré ---
  const halo = document.createElement("div");
  halo.style.position = "fixed";
  halo.style.top = "50%";
  halo.style.left = "50%";
  halo.style.width = "700px";
  halo.style.height = "700px";
  halo.style.background = "radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.08) 40%, transparent 80%)";
  halo.style.borderRadius = "50%";
  halo.style.filter = "blur(100px)";
  halo.style.transform = "translate(-50%, -50%) scale(0.9)";
  halo.style.opacity = "0";
  halo.style.transition = "opacity 4s ease, transform 6s ease";
  halo.style.zIndex = "0";
  document.body.appendChild(halo);

  // fade-in doux du halo
  setTimeout(() => {
    halo.style.opacity = "1";
    halo.style.transform = "translate(-50%, -50%) scale(1)";
  }, 1000);

  // --- Création du SVG central (anneau + cercles animés) ---
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 400 400");
  svg.style.position = "fixed";
  svg.style.top = "50%";
  svg.style.left = "50%";
  svg.style.transform = "translate(-50%, -50%)";
  svg.style.width = "400px";
  svg.style.height = "400px";
  svg.style.zIndex = "1";
  document.body.appendChild(svg);

  const circles = [
    { r: 110, color: "#C0C0C0", width: 1, dur: 9 },
    { r: 150, color: "#D4AF37", width: 2, dur: 14 },
    { r: 190, color: "#8B1E3F", width: 1.5, dur: 20 }
  ];

  circles.forEach(c => {
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", 200);
    circle.setAttribute("cy", 200);
    circle.setAttribute("r", c.r);
    circle.setAttribute("stroke", c.color);
    circle.setAttribute("stroke-width", c.width);
    circle.setAttribute("fill", "none");
    circle.style.opacity = 0.7;
    circle.style.animation = `pulse-${c.r} ${c.dur}s ease-in-out infinite alternate`;
    svg.appendChild(circle);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse-${c.r} {
        from { transform: scale(1); opacity: 0.5; }
        to { transform: scale(1.05); opacity: 0.9; }
      }
    `;
    document.head.appendChild(style);
  });

  // --- Création et affichage progressif des lignes de texte ---
  const l1 = document.createElement("div");
  const l2 = document.createElement("div");
  const l3 = document.createElement("div");
  [l1, l2, l3].forEach(l => {
    l.classList.add("line");
    document.body.appendChild(l);
  });

  l1.textContent = "Transmission entrante...";
  l2.textContent = "Canal sécurisé ouvert.";
  l3.textContent = "Fréquence 7-4-9";

  // --- Timings synchro avec la bande son ---
  setTimeout(() => l1.classList.add("visible"), 79530);
  setTimeout(() => l2.classList.add("visible"), 83370);
  setTimeout(() => {
    l3.classList.add("visible");
    l3.classList.add("glitch"); // effet brouillage sur “Fréquence 7-4-9”
    setTimeout(() => l3.classList.remove("glitch"), 2500);
  }, 87360);

  // --- Code secret ---
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
