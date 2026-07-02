let milliseconds = 0;
let seconds = 0;
let minutes = 0;

let timer = null;
let running = false;
let lapNumber = 0;

const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");
const clearBtn = document.getElementById("clearBtn");
const lapContainer = document.getElementById("laps");
const lapCount = document.getElementById("lapCount");

function updateDisplay() {
  let min = minutes < 10 ? "0" + minutes : minutes;
  let sec = seconds < 10 ? "0" + seconds : seconds;
  let ms = milliseconds < 10 ? "0" + milliseconds : milliseconds;

  display.textContent = `${min}:${sec}:${ms}`;
}

function stopwatch() {
  milliseconds++;

  if (milliseconds === 100) {
    milliseconds = 0;
    seconds++;
  }

  if (seconds === 60) {
    seconds = 0;
    minutes++;
  }

  updateDisplay();
}

startBtn.addEventListener("click", () => {
  if (!running) {
    timer = setInterval(stopwatch, 10);
    running = true;
    startBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  } else {
    clearInterval(timer);
    running = false;
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
});

resetBtn.addEventListener("click", () => {
  clearInterval(timer);
  running = false;

  milliseconds = 0;
  seconds = 0;
  minutes = 0;
  updateDisplay();

  startBtn.innerHTML = '<i class="fa-solid fa-play"></i>';

  lapContainer.innerHTML = "";
  lapNumber = 0;
  lapCount.textContent = "0";
  localStorage.removeItem("laps");
});

lapBtn.addEventListener("click", () => {
  if (!running) return;

  lapNumber++;
  const time = display.textContent;
  const label = "LAP #" + String(lapNumber).padStart(2, "0");

  const lap = document.createElement("div");
  lap.className = "lap";
  lap.innerHTML = `
    <div class="lap-header">
      <span>${label}</span>
      <span>${time} <i class="fa-solid fa-stopwatch"></i></span>
    </div>
  `;

  lapContainer.prepend(lap);
  lapCount.textContent = lapNumber;
  saveLaps();
});

clearBtn.addEventListener("click", () => {
  lapContainer.innerHTML = "";
  lapNumber = 0;
  lapCount.textContent = "0";
  localStorage.removeItem("laps");
});

updateDisplay();

function saveLaps() {
  localStorage.setItem("laps", lapContainer.innerHTML);
  localStorage.setItem("lapNumber", lapNumber);
}

window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
    document.getElementById("themeBtn").innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  const savedLaps = localStorage.getItem("laps");
  if (savedLaps) {
    lapContainer.innerHTML = savedLaps;
  }

  const savedLapNumber = localStorage.getItem("lapNumber");
  if (savedLapNumber) {
    lapNumber = Number(savedLapNumber);
    lapCount.textContent = lapNumber;
  }
});

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    localStorage.setItem("theme", "light");
  } else {
    themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem("theme", "dark");
  }
});

document.addEventListener("keydown", (e) => {
  if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;

  if (e.code === "Space") {
    e.preventDefault();
    startBtn.click();
  }

  if (e.key === "l" || e.key === "L") {
    lapBtn.click();
  }

  if (e.key === "r" || e.key === "R") {
    resetBtn.click();
  }

  if (e.key === "d" || e.key === "D") {
    themeBtn.click();
  }
});

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    button.style.transform = "scale(.92)";
    setTimeout(() => {
      button.style.transform = "";
    }, 120);
  });
});