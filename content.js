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
      // Start button logic here
      console.log('Reset button clicked');
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
      // Start button logic here
      console.log('Start button clicked');
      startBtn.style.display = 'none'; // Hide the start button
      startTimer(); // Call the startTimer function
  });

  // Create Pause button
  var pauseBtn = document.createElement('button');
  pauseBtn.id = 'pause'; 
  pauseBtn.textContent = 'Pause';
  pauseBtn.classList.add('btn', 'btn-warning', 'mx-2', 'btn-pause');
  pauseBtn.style.float = 'left'; // Set float left
  pauseBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      // Pause button logic here
      console.log('Pause button clicked');
      startBtn.style.display = 'inline-block'; // Show the start button
      pauseTimer(); // Call the pauseTimer function
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
      // Stop button logic here
      console.log('Stop button clicked');
      startBtn.style.display = 'inline-block'; // Show the start button
      resetTimer(); // Call the resetTimer function
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
  timer = true;
  isPaused = false; // Reset the pause flag
  pauseBtn.style.display = 'inline-block'; // Show the pause button
  stopWatch();
  console.log('Timer started');
}

function pauseTimer() {
  isPaused = true; // Set the pause flag
  pauseBtn.style.display = 'none'; // Hide the pause button
  console.log('Timer paused');
}

function resetTimer() {
  timer = false;
  isPaused = false; // Reset the pause flag
  hour = 0;
  minute = 0;
  second = 0;
  count = 0;
  console.log('Timer reset');

  const hrElement = document.getElementById('hr');
  const minElement = document.getElementById('min');
  const countElement = document.getElementById('count');

  if (hrElement) {
    hrElement.innerHTML = "00";
  }

  if (minElement) {
    minElement.innerHTML = "00";
  }

  if (countElement) {
    countElement.innerHTML = "00";
  }

  const timerDisplay = document.getElementById('timerDisplay');
  if (timerDisplay) {
    timerDisplay.innerHTML = '00:00:00';
  }

  startBtn.style.display = 'inline-block'; // Show the start button
  pauseBtn.style.display = 'inline-block'; // Show the pause button
}

stopBtn.addEventListener('click', function () {
  timer = false;
  console.log('Timer stopped');
  startBtn.style.display = 'inline-block'; // Show the start button
  pauseBtn.style.display = 'inline-block'; // Show the pause button
});

resetBtn.addEventListener('click', function () {
  resetTimer();
});

function stopWatch() {
  if (timer && !isPaused) {
    count++;

    if (count == 100) {
      second++;
      count = 0;
    }

    if (second == 60) {
      minute++;
      second = 0;
    }

    if (minute == 60) {
      hour++;
      minute = 0;
    }

    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
      timerDisplay.innerHTML = `${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute}:${second < 10 ? "0" + second : second}`;
    }

    setTimeout(stopWatch, 10); // Adjusted to run every 10 milliseconds
  }
}