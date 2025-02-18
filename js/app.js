// Utility to append text to the build log
function appendLog(message) {
  const logElement = document.getElementById("build-log");
  const lines = logElement.innerHTML
    .split("<br/>")
    .filter((line) => line.trim() !== "");

  // Add new line
  lines.push(`<code>${message}</code>`);

  // Keep only last 7 lines
  if (lines.length > 7) {
    lines.splice(0, lines.length - 7);
  }

  // Update log content
  logElement.innerHTML = lines.join("<br/>");
  logElement.scrollTop = logElement.scrollHeight;
}

// Add initialization for battery cells
function initializeBattery() {
  const cellsContainer = document.querySelector(".battery-cells");
  for (let i = 0; i < 20; i++) {
    const cell = document.createElement("div");
    cell.className = "battery-cell";
    cellsContainer.appendChild(cell);
  }
}

// Replace updateProgress function
function updateProgress(percentage) {
  const cells = document.querySelectorAll(".battery-cell");
  const percentageText = document.querySelector(".battery-percentage");
  const activeCells = Math.floor((percentage / 100) * cells.length);

  cells.forEach((cell, index) => {
    if (index < activeCells) {
      cell.classList.add("active");
      cell.classList.add("glow-effect");
    } else {
      cell.classList.remove("active");
      cell.classList.remove("glow-effect");
    }
  });

  percentageText.textContent = `${percentage}%`;
  percentageText.classList.add("glow-effect");
}

// Modified device detection function with failure chance for Android
function detectDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android/i.test(userAgent)) {
    // 10% chance of failure for Android
    const randomNum = Math.random();
    if (randomNum < 0.1) {
      return "FAIL";
    }
    return 9;
  } else {
    return 10;
  }
}

function getTimeStamp() {
  const now = new Date();
  return "[" + now.toLocaleTimeString() + "]";
}

let startTime;

// Simulate build steps with progress updates
function runBuildSequence() {
  startTime = Date.now();
  const steps = [
    "Initializing components...",
    "Reading configuration files...",
    "Loading modules: Webpack, Babel, ESLint...",
    "Installing dependencies: React, Redux, Lodash...",
    "Compiling source code...",
    "Linting source files...",
    "Minifying assets...",
    "Bundling project...",
    "Running tests...",
    "Finalizing build artifacts...",
  ];

  let delay = 0;
  const totalSteps = steps.length;

  steps.forEach((step, index) => {
    // Generate a random delay between 1s (1000ms) and 3s (3000ms)
    const randomDelay = Math.floor(Math.random() * 2000) + 1000;
    setTimeout(() => {
      appendLog(getTimeStamp() + " " + step);
      // Calculate progress percentage (rounded)
      const progress = Math.round(((index + 1) / totalSteps) * 100);
      updateProgress(progress);
    }, delay);
    delay += randomDelay;
  });

  // After build steps, detect device and print output number
  setTimeout(() => {
    const outputNumber = detectDevice();
    appendLog("Build complete!");
    if (outputNumber === "FAIL") {
      appendLog("Build failed on Android device!");
      document.getElementById("output").innerHTML = 
        `<span style="color: #ff0000;">Result: </span>${outputNumber}`;
    } else {
      appendLog("Output number: " + outputNumber);
      document.getElementById("output").innerHTML = 
        `<span style="color: #00ff00;">Result: </span>${outputNumber}`;
    }
    const buildTime = ((Date.now() - startTime) / 1000).toFixed(2);
    appendLog("Build time: " + buildTime + "s");
  }, delay);
}

// Simplified background video handling
function setupBackgroundVideo() {
  const video = document.getElementById("bgVideo");
  const fallbackImage = document.querySelector(".fallback-image");

  // Show fallback image if video fails to play
  video.addEventListener("error", () => {
    video.style.display = "none";
    fallbackImage.classList.add("fallback-active");
  });
}

// Start the build sequence when the page loads
window.onload = function () {
  initializeBattery();
  runBuildSequence();
  setupBackgroundVideo();
};
