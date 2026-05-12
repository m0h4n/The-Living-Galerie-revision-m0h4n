// =========================================================
// THE LIVING GALERIE - JavaScript sencillo para principiantes
// Controla el temporizador de 2 minutos y el movimiento entre escenas.
// =========================================================

const STORY_TIME_SECONDS = 120;
const FINAL_SCREENS = ["fin-sin-tiempo", "final-sombras", "final-error-fatal", "final-justicia"];

const timerWidget = document.getElementById("timer-widget");
const timerCount = document.getElementById("timer-count");
let secondsLeft = STORY_TIME_SECONDS;
let timerInterval = null;

function getCurrentSceneId() {
  return window.location.hash ? window.location.hash.replace("#", "") : "home";
}

function isTimerScene(sceneId) {
  return sceneId !== "home" && !FINAL_SCREENS.includes(sceneId);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerWidget.hidden = true;
  timerWidget.classList.remove("is-ending");
}

function startTimer() {
  secondsLeft = STORY_TIME_SECONDS;
  timerCount.textContent = formatTime(secondsLeft);
  timerWidget.hidden = false;
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    secondsLeft -= 1;
    timerCount.textContent = formatTime(secondsLeft);

    if (secondsLeft <= 15) {
      timerWidget.classList.add("is-ending");
    } else {
      timerWidget.classList.remove("is-ending");
    }

    if (secondsLeft <= 0) {
      stopTimer();
      window.location.hash = "fin-sin-tiempo";
    }
  }, 1000);
}

function moveToCurrentScene() {
  const sceneId = getCurrentSceneId();
  const activeScene = document.getElementById(sceneId);

  if (activeScene) {
    activeScene.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (activeScene && isTimerScene(sceneId)) {
    startTimer();
  } else {
    stopTimer();
  }
}

window.addEventListener("hashchange", moveToCurrentScene);
window.addEventListener("load", moveToCurrentScene);
