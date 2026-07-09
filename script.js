(function () {
  "use strict";

  /* ============================================================
     Navigation between screens
     ============================================================ */
  const screens = document.querySelectorAll(".screen");

  function goTo(name) {
    screens.forEach((s) => {
      s.classList.toggle("screen--hidden", s.dataset.screen !== name);
    });
    if (name === "jugar") startGame();
    if (name === "inicio" || name === "aprender") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll("[data-goto]").forEach((el) => {
    el.addEventListener("click", () => goTo(el.dataset.goto));
  });

  /* ============================================================
     News data — 5 rondas
     ============================================================ */
  const NEWS = [
    {
      url: "salud-total-noticias.info",
      headline: "¡¡CIENTÍFICOS DESCUBREN QUE EL AGUA TIBIA CON LIMÓN CURA EL CÁNCER EN 24 HORAS!!",
      body: "Un médico anónimo asegura que los hospitales ocultan esta cura desde hace décadas. Compártelo antes de que lo eliminen de internet.",
      isTrue: false,
      why: "Titular en mayúsculas, promesa médica imposible, fuente anónima y llamada a compartir con urgencia: cuatro señales clásicas de una fake new.",
      art: "alert"
    },
    {
      url: "gobierno.mx",
      headline: "El Banco de México mantiene sin cambios la tasa de interés de referencia",
      body: "En su último comunicado, la institución explicó los factores considerados para la decisión, citando datos de inflación y crecimiento económico.",
      isTrue: true,
      why: "Fuente institucional identificable, lenguaje sobrio y datos verificables: así se ve una noticia con respaldo real.",
      art: "doc"
    },
    {
      url: "virall-hoy.net",
      headline: "Video muestra a un perro hablando perfectamente español frente a testigos",
      body: "Vecinos afirman que el animal repite frases completas. Nadie ha podido explicar el fenómeno, dicen los comentarios de la publicación.",
      isTrue: false,
      why: "Una afirmación que rompe las leyes conocidas de la biología, sin evidencia verificable ni fuente seria: clásico anzuelo viral.",
      art: "alert"
    },
    {
      url: "universidad-uni.edu.mx",
      headline: "La universidad pública inaugura una nueva biblioteca en su campus central",
      body: "El nuevo edificio cuenta con salas de estudio, acervo digital y horario extendido, según el comunicado oficial del rectorado.",
      isTrue: true,
      why: "Anuncio institucional, verificable y sin lenguaje alarmista: coincide con cómo se reportan hechos reales.",
      art: "doc"
    },
    {
      url: "verdad-oculta-24.com",
      headline: "URGENTE: seres de otro planeta fueron vistos caminando anoche por el centro de la ciudad",
      body: "Testigos anonimos aseguran ke las autoridades ocultan la verdad. Comparte antes de ke la noticia sea censurada!!!",
      isTrue: false,
      why: "Errores ortográficos, urgencia fabricada, testigos anónimos y una afirmación extraordinaria sin evidencia: varias banderas rojas juntas.",
      art: "alert"
    }
  ];

  const ART = {
    alert: `<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="150" fill="#f6dcd8"/>
      <polygon points="100,20 140,95 60,95" fill="none" stroke="#b3272d" stroke-width="6" stroke-linejoin="round"/>
      <rect x="96" y="45" width="8" height="28" fill="#b3272d"/>
      <circle cx="100" cy="82" r="4.5" fill="#b3272d"/>
    </svg>`,
    doc: `<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="150" fill="#dcefe2"/>
      <rect x="70" y="28" width="60" height="80" rx="4" fill="#fff" stroke="#1f4d3d" stroke-width="4"/>
      <line x1="80" y1="48" x2="120" y2="48" stroke="#1f4d3d" stroke-width="4"/>
      <line x1="80" y1="62" x2="120" y2="62" stroke="#1f4d3d" stroke-width="4"/>
      <line x1="80" y1="76" x2="108" y2="76" stroke="#1f4d3d" stroke-width="4"/>
    </svg>`
  };

  /* ============================================================
     Game state
     ============================================================ */
  let order = [];
  let idx = 0;
  let score = 0;
  let answered = false;

  const els = {
    progressFill: document.getElementById("progress-fill"),
    progressCount: document.getElementById("progress-count"),
    url: document.getElementById("news-url"),
    img: document.getElementById("news-img"),
    headline: document.getElementById("news-headline"),
    body: document.getElementById("news-body"),
    btnTrue: document.getElementById("btn-verdadero"),
    btnFalse: document.getElementById("btn-falso"),
    feedback: document.getElementById("feedback-banner"),
    feedbackTitle: document.getElementById("feedback-title"),
    feedbackText: document.getElementById("feedback-text"),
    btnNext: document.getElementById("btn-next"),
    scoreNumber: document.getElementById("score-number"),
    scoreMsg: document.getElementById("score-msg")
  };

  function shuffledIndices(n) {
    const arr = Array.from({ length: n }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function startGame() {
    order = shuffledIndices(NEWS.length);
    idx = 0;
    score = 0;
    answered = false;
    renderRound();
  }

  function renderRound() {
    answered = false;
    const item = NEWS[order[idx]];

    els.progressCount.textContent = `${idx + 1} / ${NEWS.length}`;
    els.progressFill.style.width = `${((idx + 1) / NEWS.length) * 100}%`;

    els.url.textContent = item.url;
    els.img.innerHTML = ART[item.art];
    els.headline.textContent = item.headline;
    els.body.textContent = item.body;

    els.feedback.classList.remove("show", "correct", "incorrect");
    els.btnTrue.disabled = false;
    els.btnFalse.disabled = false;
  }

  function handleAnswer(userSaysTrue) {
    if (answered) return;
    answered = true;

    const item = NEWS[order[idx]];
    const correct = userSaysTrue === item.isTrue;
    if (correct) score++;

    els.btnTrue.disabled = true;
    els.btnFalse.disabled = true;

    els.feedback.classList.add("show", correct ? "correct" : "incorrect");
    els.feedbackTitle.textContent = correct ? "¡Correcto! Loki no te engañó." : "Loki logró engañarte esta vez.";
    els.feedbackText.textContent = `Esta noticia es ${item.isTrue ? "verdadera" : "falsa"}. ${item.why}`;

    els.btnNext.textContent = idx < NEWS.length - 1 ? "Siguiente →" : "Ver resultado →";
  }

  els.btnTrue.addEventListener("click", () => handleAnswer(true));
  els.btnFalse.addEventListener("click", () => handleAnswer(false));

  els.btnNext.addEventListener("click", () => {
    if (idx < NEWS.length - 1) {
      idx++;
      renderRound();
    } else {
      finishGame();
    }
  });

  function finishGame() {
    els.scoreNumber.textContent = `${score}/${NEWS.length}`;
    let msg;
    if (score === NEWS.length) {
      msg = "Perfecto. Ni el mismísimo Loki podría engañarte.";
    } else if (score >= Math.ceil(NEWS.length * 0.6)) {
      msg = "Buen ojo. Aprendiste a leer entre líneas, pero aún hay trucos por descubrir.";
    } else {
      msg = "Loki se salió con la suya. Repasa las señales y vuelve a intentarlo.";
    }
    els.scoreMsg.textContent = msg;
    goTo("fin");
  }
})();
