function injectButtons() {
  console.log("Script Injected");

  // Find the parent div where buttons will be inserted
  var parentDiv = document.querySelector('.BtnGroup.d-flex.width-full');

  // Create Timer display element
  var timerDisplay = document.createElement('div');
  timerDisplay.id = 'timerDisplay';
  timerDisplay.style.float = 'left';
  timerDisplay.classList.add('btn', 'mx-2');
  timerDisplay.style.marginRight = '10px';
  timerDisplay.style.cursor = 'default';
  timerDisplay.style.pointerEvents = 'none';
  timerDisplay.innerHTML = '00:00:00';

  // Append Timer display to the parent div
  parentDiv.appendChild(timerDisplay);

  // Create Restart/Timer button
  var timerButton = document.createElement('button');
  timerButton.id = 'reset';
  timerButton.innerHTML = '↺ ' + '&#9200;';
  timerButton.classList.add('btn', 'mx-2');
  timerButton.style.float = 'left'; // Set float left
  timerButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      resetTimer();
  });

  // Create Start button
  var startBtn = document.createElement('button');
  startBtn.id = 'start';
  startBtn.textContent = 'Start';
  startBtn.classList.add('btn', 'btn-primary', 'mx-2');
  startBtn.style.float = 'left'; // Set float left
  startBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      startTimer();
  });

  // Create Pause button
  var pauseBtn = document.createElement('button');
  pauseBtn.id = 'pause';
  pauseBtn.textContent = 'Pause';
  pauseBtn.classList.add('btn', 'btn-warning', 'mx-2', 'btn-pause');
  pauseBtn.style.float = 'left'; // Set float left
  pauseBtn.style.display = 'none'; // Initially hide the pause button
  pauseBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      pauseTimer();
  });

  // Create Stop button
  var stopBtn = document.createElement('button');
  stopBtn.id = 'stop';
  stopBtn.textContent = 'Stop';
  stopBtn.classList.add('btn', 'btn-danger', 'mx-2');
  stopBtn.style.float = 'left'; // Set float left
  stopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      stopTimer();
  });

  // Append buttons to the parent div
  parentDiv.appendChild(timerButton);
  parentDiv.appendChild(startBtn);
  parentDiv.appendChild(pauseBtn);
  parentDiv.appendChild(stopBtn);
}

// Call the function to inject buttons
injectButtons();

let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let resetBtn = document.getElementById('reset');
let pauseBtn = document.getElementById('pause');

let hour = 0;
let minute = 0;
let second = 0;
let count = 0;
let timer; // Declare timer variable
let isPaused = false; // Flag to track if the timer is paused

function startTimer() {
  timer = setInterval(stopWatch, 10); // Start the timer
  startBtn.style.display = 'none'; // Hide the start button
  pauseBtn.style.display = 'inline-block'; // Show the pause button
  console.log('Timer started');
}

function pauseTimer() {
  clearInterval(timer); // Stop the timer
  isPaused = true; // Set the paused flag
  pauseBtn.style.display = 'none'; // Hide the pause button
  startBtn.textContent = 'Resume'; // Change the start button text to "Resume"
  startBtn.style.display = 'inline-block'; // Show the start button
  console.log('Timer paused');
}

function stopTimer() {
  clearInterval(timer); // Stop the timer
  isPaused = false; // Reset the paused flag
  startBtn.textContent = 'Start'; // Reset the start button text
  startBtn.style.display = 'inline-block'; // Show the start button
  pauseBtn.style.display = 'none'; // Hide the pause button
  console.log('Timer stopped');
}

function resetTimer() {
  clearInterval(timer); // Stop the timer
  isPaused = false; // Reset the paused flag
  hour = 0;
  minute = 0;
  second = 0;
  count = 0;
  const timerDisplay = document.getElementById('timerDisplay');
  if (timerDisplay) {
      timerDisplay.innerHTML = '00:00:00';
  }
  startBtn.textContent = 'Start'; // Reset the start button text
  startBtn.style.display = 'inline-block'; // Show the start button
  pauseBtn.style.display = 'none'; // Hide the pause button
  console.log('Timer reset');
}

function stopWatch() {
  if (!isPaused) {
      count++;

      if (count === 100) {
          second++;
          count = 0;
      }

      if (second === 60) {
          minute++;
          second = 0;
      }

      if (minute === 60) {
          hour++;
          minute = 0;
      }

      const timerDisplay = document.getElementById('timerDisplay');
      if (timerDisplay) {
          timerDisplay.innerHTML = `${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute}:${second < 10 ? "0" + second : second}`;
      }
  }
}