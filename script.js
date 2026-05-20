// =========================================================
// THE LIVING GALERIE
// SISTEMA TEMPORAL UNIFICADO
// =========================================================

/* 
=========================================================
CAMBIO IMPORTANTE
=========================================================

Antes existían DOS temporizadores:

1. timer-widget
2. barra experimental nueva

Problema:
- dobles intervalos
- doble lógica temporal
- posibles conflictos
- desincronización

Ahora:
EXISTE UN SOLO SISTEMA TEMPORAL.
*/

/* 
=========================================================
DURACIÓN TOTAL
=========================================================
*/

const STORY_TIME_SECONDS = 60;

/* 
=========================================================
PANTALLAS FINALES
=========================================================

Si el usuario llega a una de estas pantallas,
el temporizador no debe iniciarse.
*/

const FINAL_SCREENS = [
  "fin-sin-tiempo",
  "final-sombras",
  "final-error-fatal",
  "final-justicia"
];

/* 
=========================================================
CAPTURA DE ELEMENTOS HTML
=========================================================
*/

/* reloj original */

const timerWidget =
  document.getElementById("timer-widget");

const timerCount =
  document.getElementById("timer-count");

/* 
=========================================================
NUEVA BARRA NARRATIVA
=========================================================

La barra horizontal reutiliza
el MISMO sistema temporal.
*/

const progressFill =
  document.getElementById(
    "story-progress-fill"
  );

/* 
=========================================================
ESTADO TEMPORAL
=========================================================
*/

/* tiempo restante */

let secondsLeft = STORY_TIME_SECONDS;

/* intervalo principal */

let timerInterval = null;

/* 
=========================================================
CAMBIO IMPORTANTE
=========================================================

Antes:
el proyecto usaba navegación con hashes:

#home
#escena
#final

Ahora:
cada escena funciona como un HTML independiente.

Por eso ya NO necesitamos:
- hashes
- scroll automático
- navegación SPA
*/

/* 
=========================================================
DETECTAR SI ES PANTALLA FINAL
=========================================================
*/

function isFinalScreen() {

  const bodyId = document.body.id;

  return FINAL_SCREENS.includes(bodyId);
}

/* 
=========================================================
FORMATEAR TIEMPO
=========================================================

Convierte segundos en:

00:00
*/

function formatTime(totalSeconds) {

  const minutes =
    Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");

  const seconds =
    (totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

/* 
=========================================================
DETENER TEMPORIZADOR
=========================================================
*/

function stopTimer() {

  clearInterval(timerInterval);

  timerInterval = null;

  timerWidget.hidden = true;
}

/* 
=========================================================
INICIAR TEMPORIZADOR
=========================================================
*/

function startTimer() {

  /* reiniciar tiempo */

  secondsLeft = STORY_TIME_SECONDS;

  /* actualizar reloj */

  timerCount.textContent =
    formatTime(secondsLeft);

  /* mostrar reloj */

  timerWidget.hidden = false;

  /* limpiar intervalos previos */

  clearInterval(timerInterval);

  /* 
  =======================================================
  INTERVALO PRINCIPAL
  =======================================================
  */

  timerInterval = setInterval(() => {

    /* disminuir tiempo */

    secondsLeft--;

    /* actualizar reloj */

    timerCount.textContent =
      formatTime(secondsLeft);

    /* 
    =====================================================
    CALCULAR PROGRESO VISUAL
    =====================================================
    */

    const progreso =
      ((STORY_TIME_SECONDS - secondsLeft)
      / STORY_TIME_SECONDS) * 100;

    /* actualizar barra */

    progressFill.style.width =
      progreso + "%";

    /* 
    =====================================================
    ALERTA VISUAL
    =====================================================

    Cuando queda poco tiempo:
    - el reloj pulsa
    - la barra se intensifica
    */

    if (secondsLeft <= 15) {

      timerWidget.classList.add(
        "is-ending"
      );

      progressFill.style.filter =
        "brightness(1.15) saturate(1.3)";

    } else {

      timerWidget.classList.remove(
        "is-ending"
      );

      progressFill.style.filter =
        "none";
    }

    /* 
    =====================================================
    FINAL DEL TIEMPO
    =====================================================
    */

    if (secondsLeft <= 0) {

      stopTimer();

      /* 
      CAMBIO IMPORTANTE

      Antes:
      la navegación dependía de hashes.

      Ahora:
      usamos navegación normal entre HTMLs.

      Aquí pueden enviar al usuario a:
      - otra página
      - una pantalla final
      - una escena de derrota
      */

      window.location.href =
        "fin-sin-tiempo.html";
    }

  }, 1000);
}

/* 
=========================================================
CONTROL PRINCIPAL
=========================================================

Si NO estamos en una pantalla final,
iniciar temporizador.
*/

function initializeTimer() {

  if (!isFinalScreen()) {

    startTimer();

  } else {

    stopTimer();
  }
}

/* 
=========================================================
INICIAR SISTEMA TEMPORAL
=========================================================
*/

window.addEventListener(
  "load",
  initializeTimer
);  