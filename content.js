function injectButtons() {
    console.log("Script Injected");

    // Find the parent div where buttons will be inserted
    var parentDiv = document.querySelector('.BtnGroup.d-flex.width-full');

    // Create Timer display element
    var timerDisplay = document.createElement('div');
    timerDisplay.id = 'timerDisplay';
    timerDisplay.style.float = 'left'; // Set float left
    timerDisplay.style.marginRight = '10px'; // Add some margin for spacing
    timerDisplay.innerHTML = '00:00:00'; // Initial display

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

timerDisplay.classList.add('btn', 'btn-danger', 'mx-2');



let hour = 0;
let minute = 0;
let second = 0;
let count = 0;
let timer; // Declare timer variable

startBtn.addEventListener('click', function () {
  timer = true;
  stopWatch();
  console.log('Timer started');
});

stopBtn.addEventListener('click', function () {
  timer = false;
  console.log('Timer stopped');
});

resetBtn.addEventListener('click', function () {
  timer = false;
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
});

function stopWatch() {
    if (timer) {
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
  