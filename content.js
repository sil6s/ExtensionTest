// Function to inject buttons
function injectButtons() {
  console.log("Script Injected");

  // Find the parent div where buttons will be inserted.
  var parentDiv = document.querySelector('.BtnGroup.d-flex.width-full');

  // Create Timer display element
  var timerDisplay = document.createElement('div');
  timerDisplay.id = 'timerDisplay';
  timerDisplay.style.float = 'left';
  timerDisplay.classList.add('btn','mx-2');
  timerDisplay.style.marginRight = '10px';
  timerDisplay.style.cursor = 'default';
  timerDisplay.style.pointerEvents = 'none';
  timerDisplay.innerHTML = '00:00:00';

  // Append Timer display to the parent div
  parentDiv.appendChild(timerDisplay);

  // Create Restart/Timer button
  var timerButton = document.createElement('button');
  timerButton.id ='reset';
  timerButton.innerHTML = '↺'+ '&#9200;';
  timerButton.classList.add('btn','mx-2');
  timerButton.style.float = 'left'; // Set float left
  timerButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      resetTimer();
  });

  // Create Start button
  var startBtn = document.createElement('button');
  startBtn.id ='start';
  startBtn.textContent = 'Start';
  startBtn.classList.add('btn', 'btn-primary','mx-2');
  startBtn.style.float = 'left'; // Set float left
  startBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      startTimer();
      submitComment(); // Call submitComment function here
  });

  // Create Pause button
  var pauseBtn = document.createElement('button');
  pauseBtn.id = 'pause';
  pauseBtn.textContent = 'Pause';
  pauseBtn.classList.add('btn', 'btn-warning','mx-2', 'btn-pause');
  pauseBtn.style.float = 'left'; // Set float left
  pauseBtn.style.display = 'none'; // Initially hide the pause button
  pauseBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      pauseTimer();
  });

  // Create Stop button
  var stopBtn = document.createElement('button');
  stopBtn.id ='stop';
  stopBtn.textContent = 'Stop';
  stopBtn.classList.add('btn', 'btn-danger','mx-2');
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

// Variable Declarations
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

// Function to start the timer
function startTimer() {
  if (!timer) {
    timer = setInterval(stopWatch, 10); // Start the timer
    startBtn.style.display = 'none'; // Hide the start button
    pauseBtn.style.display = 'inline-block'; // Show the pause button
    console.log('Timer started');
    saveState(); // Save state when timer starts
  }
}

// Function to pause the timer
function pauseTimer() {
  if (timer) {
    clearInterval(timer); // Stop the timer
    timer = null; // Reset the timer variable
    isPaused = true; // Set the paused flag
    pauseBtn.style.display = 'none'; // Hide the pause button
    startBtn.textContent = 'Resume'; // Change the start button text to "Resume"
    startBtn.style.display = 'inline-block'; // Show the start button
    console.log('Timer paused');
    saveState(); // Save state when timer pauses
  }
}

// Function to stop the timer
function stopTimer() {
  if (timer) {
    clearInterval(timer); // Stop the timer
    timer = null; // Reset the timer variable
    isPaused = false; // Reset the paused flag
    startBtn.textContent = 'Start'; // Reset the start button text
    startBtn.style.display = 'inline-block'; // Show the start button
    pauseBtn.style.display = 'none'; // Hide the pause button
    console.log('Timer stopped');
    saveState(); // Save state when timer stops
  }
}

// Function to reset the timer
function resetTimer() {
  if (timer) {
    clearInterval(timer); // Stop the timer
    timer = null; // Reset the timer variable
  }
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
  saveState(); // Save state when timer resets
}

// Function to update the timer display
function updateDisplay() {
  const timerDisplay = document.getElementById('timerDisplay');
  if (timerDisplay) {
    timerDisplay.innerHTML = `${hour < 10? "0" + hour : hour}:${minute < 10? "0" + minute : minute}:${second < 10? "0" + second : second}`;
  }
}

// Function to save the current state of the timer to local storage
function saveState() {
  const state = {
    hour,
    minute,
    second,
    count,
    isPaused,
    isRunning:!!timer,
    startTime: new Date().getTime() // Save the current time in milliseconds
  };
  localStorage.setItem('stopwatchState', JSON.stringify(state));
}

// Function to load the timer state from local storage
// Function to load the timer state from local storage
window.addEventListener('load', () => {
  const savedState = JSON.parse(localStorage.getItem('stopwatchState'));
  if (savedState) {
    hour = savedState.hour;
    minute = savedState.minute;
    second = savedState.second;
    count = savedState.count;
    isPaused = savedState.isPaused;

    // Calculate the difference between the saved time and the current time
    const savedTime = savedState.startTime;
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - savedTime;

    // Update the timer values with the time difference
    const elapsedSeconds = Math.floor(timeDifference / 1000);
    second += elapsedSeconds % 60;
    minute += Math.floor(elapsedSeconds / 60) % 60;
    hour += Math.floor(elapsedSeconds / 3600);

    updateDisplay();

    if (savedState.isRunning) {
      startTimer();
    } else if (isPaused) {
      pauseTimer();
    }
  }
});

// Function to run the stopwatch
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
    updateDisplay();
    saveState(); // Save state periodically
  }
}

function submitComment(resetTimerCallback) {
  var commentParent = document.getElementById("partial-new-comment-form-actions");
  if (commentParent) {
    var commentForm = commentParent.closest('form');
    var textArea = document.getElementById("new_comment_field");
    var commentField = document.getElementById("new_comment_field");

    if (commentForm && commentField) {
      console.log("Comment form and field found");

      // Get the current time
      var currentTime = new Date().toLocaleTimeString();

      // Set the value of the comment field with the current time
      commentField.value = `ITSC PMS: User started issue at ${currentTime}`;
      document.getElementById("new_comment_field").value = `ITSC PMS: User started issue at ${currentTime}`;
      console.log("Comment field value set");

      // Submit the form programmatically
      commentForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission behavior
        console.log("Form submitted!");
        // Clear the comment field after submitting the form
        commentField.value = "";

        // Call the resetTimerCallback after the comment is submitted
        if (typeof resetTimerCallback === 'function') {
          resetTimerCallback();
        }
      }, { once: true });

      commentForm.submit();
    } else {
      console.log("Comment form or comment field not found.");
    }
  } else {
    console.log("Comment parent element not found.");
  }
}