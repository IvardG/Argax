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
    let dataArray = null;

    // resize du canvas
    function resizeCanvas() {
      canvas.width = canvas.clientWidth;
      canvas.height = 120;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // clic utilisateur pour lancer l'audio et AudioContext
    document.body.addEventListener("click", async () => {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const src = audioCtx.createMediaElementSource(audio);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        analyser.connect(audioCtx.destination);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
      }
      if (audio.paused) {
        try { await audio.play(); } catch(e){ console.warn(e); }
      }
    });

    // synchronisation des phrases et déclenchement des cercles
    audio.addEventListener("play", () => {
      if (sequenceStarted) return;
      sequenceStarted = true;

      // déclencher cercles pulsants
      document.querySelectorAll(".signal-circle").forEach(c => c.classList.add("pulse"));

      // timing des phrases (en ms)
      setTimeout(() => line1.classList.add("visible"), 81220);    // phrase 1
      setTimeout(() => line2.classList.add("visible", "pulse"), 83940); // phrase 2
      setTimeout(() => line3.classList.add("visible"), 88230);    // phrase 3

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
      const halfWidth = () => canvas.width / 2;
      const centerY = () => canvas.height / 2;
      const half = Math.floor(bufferLength / 2);

      function draw() {
        analyser.getByteFrequencyData(dataArrayLocal);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#d4af7f';

        const midX = canvas.width / 2;
        const cY = centerY();
        const wHalf = halfWidth();

        // gauche
        ctx.beginPath();
        for (let i = 0; i < half; i++) {
          const shiftedIndex = Math.min(bufferLength - 1, i + 5);
          const rawValue = dataArrayLocal[shiftedIndex] / 255;
          const value = Math.sqrt(rawValue);
          const x = midX - (i / Math.max(1, half - 1)) * wHalf;
          const y = cY - value * amplitude;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // droite
        ctx.beginPath();
        for (let i = 0; i < half; i++) {
          const shiftedIndex = Math.min(bufferLength - 1, i + 5);
          const rawValue = dataArrayLocal[shiftedIndex] / 255;
          const value = Math.sqrt(rawValue);
          const x = midX + (i / Math.max(1, half - 1)) * wHalf;
          const y = cY - value * amplitude;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        animationId = requestAnimationFrame(draw);
      }
      draw();
    }

    // code secret 749
    let inputBuffer = "";
    document.addEventListener("keydown", e => {
      if (/^[0-9]$/.test(e.key)) {
        inputBuffer += e.key;
        if (inputBuffer.length > 3) inputBuffer = inputBuffer.slice(-3);
        if (inputBuffer === "749") {
          window.location.href = "https://discord.gg/tonLienDiscord";
        }
      }
    });
