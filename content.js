// Inject buttons function
function injectButtons() {
  console.log("Script Injected");

  // Find the parent div where buttons will be inserted.
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
  timerButton.innerHTML = '↺' + '&#9200;';
  timerButton.classList.add('btn', 'mx-2', 'btn-warning');
  timerButton.style.float = 'left';
  timerButton.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    resetTimer();
  });

  // Create Start button
  var startBtn = document.createElement('button');
  startBtn.id = 'start';
  startBtn.textContent = 'Start';
  startBtn.classList.add('btn', 'btn-primary', 'mx-2');
  startBtn.style.float = 'left';
  startBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    startTimer();
  });

  // Create Pause button
  var pauseBtn = document.createElement('button');
  pauseBtn.id = 'pause';
  pauseBtn.textContent = 'Pause';
  pauseBtn.classList.add('btn', 'btn-warning', 'mx-2', 'btn-pause');
  pauseBtn.style.float = 'left';
  pauseBtn.style.display = 'none';
  pauseBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    pauseTimer();
  });

  // Append buttons to the parent div
  parentDiv.appendChild(timerButton);
  parentDiv.appendChild(startBtn);
  parentDiv.appendChild(pauseBtn);
}

// Call the function to inject buttons
injectButtons();

// Variable Declarations
let startTime = 0;
let elapsedTime = 0;
let timer;
let isPaused = false;

function startTimer() {
  const startBtn = document.getElementById('start');
  const pauseBtn = document.getElementById('pause');
  if (startBtn && pauseBtn) {
    if (!isPaused) {
      startTime = new Date().getTime() - elapsedTime; // Set the start time
    } else {
      startTime = new Date().getTime() - elapsedTime; // Adjust the start time
      isPaused = false;
    }
    timer = setInterval(updateTimer, 10); // Start the timer
    startBtn.style.display = 'none'; // Hide the start button
    pauseBtn.style.display = 'inline-block'; // Show the pause button
    saveState(); // Save state
  }
}

function pauseTimer() {
  const startBtn = document.getElementById('start');
  const pauseBtn = document.getElementById('pause');
  if (startBtn && pauseBtn && timer) {
    clearInterval(timer); // Stop the timer
    elapsedTime = new Date().getTime() - startTime; // Calculate elapsed time
    isPaused = true; // Set the paused flag
    pauseBtn.style.display = 'none'; // Hide the pause button
    startBtn.textContent = 'Resume'; // Change the start button text to "Resume"
    startBtn.style.display = 'inline-block'; // Show the start button
    saveState(); // Save state
  }
}

function resetTimer() {
  const startBtn = document.getElementById('start');
  const pauseBtn = document.getElementById('pause');
  if (startBtn && pauseBtn) {
    clearInterval(timer); // Stop the timer
    startTime = 0;
    elapsedTime = 0;
    isPaused = false;
    updateDisplay(0);
    startBtn.textContent = 'Start'; // Reset the start button text
    startBtn.style.display = 'inline-block'; // Show the start button
    pauseBtn.style.display = 'none'; // Hide the pause button
    localStorage.removeItem('timerState'); // Remove stored state
  }
}

function updateTimer() {
  elapsedTime = new Date().getTime() - startTime;
  updateDisplay(elapsedTime);
}

function updateDisplay(time) {
  const timerDisplay = document.getElementById('timerDisplay');
  if (timerDisplay) {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const centiseconds = Math.floor((time % 1000) / 10);
    timerDisplay.innerHTML = `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }
}

function saveState() {
  const state = {
    startTime,
    elapsedTime,
    isPaused,
    isRunning: !!timer
  };
  localStorage.setItem('timerState', JSON.stringify(state));
}

window.addEventListener('load', () => {
  const savedState = JSON.parse(localStorage.getItem('timerState'));

  if (savedState) {
    startTime = savedState.startTime;
    elapsedTime = savedState.elapsedTime;
    isPaused = savedState.isPaused;

    if (savedState.isRunning) {
      // Calculate the elapsed time
      const currentTime = new Date().getTime();
      elapsedTime = currentTime - startTime;

      startTimer(); // Resume the timer if it was running
    } else if (isPaused) {
      updateDisplay(elapsedTime); // Update display with paused time
    }
  }
});


function stopWatch() {
  if (!isPaused) {
    const startTime = parseInt(localStorage.getItem('startTime'), 10); // Get the start time from localStorage
    const now = new Date().getTime(); // Get the current time
    const elapsedTime = now - startTime; // Calculate elapsed time
    hour = Math.floor(elapsedTime / 3600000); // Convert milliseconds to hours
    minute = Math.floor((elapsedTime % 3600000) / 60000); // Convert remaining milliseconds to minutes
    second = Math.floor((elapsedTime % 60000) / 1000); // Convert remaining milliseconds to seconds
    count = Math.floor((elapsedTime % 1000) / 10); // Convert remaining milliseconds to centiseconds
    updateDisplay();
    saveState(); // Save state periodically
  }
}

// Function to check if a comment containing "ITSC Project Management System" is found
function isITSCCommentFound() {
  var comments = document.querySelectorAll('.comment-body');
  for (var i = 0; i < comments.length; i++) {
    if (comments[i].textContent.includes('ITSC Project Management System')) {
      return true;
    }
  }
  return false;
}


// Function to click the dropdown button, then edit, and submit
function handleIssueAction(action) {
  // Find the dropdown button
  var dropdownButton = document.querySelector('summary.timeline-comment-action.Link--secondary.Button--link.Button--medium.Button');

  if (dropdownButton) {
      // Click the dropdown button
      dropdownButton.click();
      console.log('Dropdown button clicked');

      // Wait for the edit button to become visible
      setTimeout(function () {
          // Find the edit button
          var editButton = document.querySelector('.dropdown-item.btn-link.js-comment-edit-button');
          if (editButton) {
              // Click the edit button
              editButton.click();
              console.log('Edit button clicked');

              // Target the textarea by its name attribute
              var textarea = document.querySelector('textarea[name="issue[body]"]');
              if (textarea) {
                  // Get the current time and date
                  var currentTime = new Date().toLocaleTimeString();
                  var currentDate = new Date().toLocaleDateString();

                  // Get the element containing the username
                  var usernameElement = document.querySelector('.lh-condensed.overflow-hidden.d-flex.flex-column.flex-justify-center.ml-2.f5.mr-auto.width-full');

                  // Extract the username from the element
                  var username = '';
                  if (usernameElement) {
                      var lines = usernameElement.innerText.trim().split('\n');
                      if (lines.length > 0) {
                          username = lines[0];
                      }
                  }
        
                  

                  console.log(username);

                  // Check if the title "##ITSC Project Management:" exists
                  var title = "## ITSC Project Management:";
                  if (!textarea.value.includes(title)) {
                      textarea.value = `${title}\n### ${username} initiated issue at ${currentTime}, ${currentDate}:\n` + textarea.value;
                      console.log('Title added');
                  }

                  // Define the message based on the action
                  var message = '';
                  if (action === 'start') {
                      message = `${username} started issue`;
                  } else if (action === 'pause') {
                      message = `${username} paused issue`;
                  } else if (action === 'reset') {
                      message = `${username} reset issue`;
                  } else if (action === 'update') { // Add handling for 'update' action
                      message = `${username} updated comment`;
                  }
                  textarea.value += `\n${message} at ${new Date().toLocaleString()}`;
                  console.log(`Added message: ${message}`);

                  // Find the submit edit button
                  var submitEditButton = document.querySelector('.js-comment-update .Button--primary.Button--medium');
                  if (submitEditButton) {
                      // Click the submit edit button
                      submitEditButton.click();
                      console.log('Submit edit button clicked');
                  } else {
                      console.log('Submit edit button not found');
                  }
              } else {
                  console.log('Textarea element not found');
              }
          } else {
              console.log('Edit button not found');
          }
      }, 500); // Adjust timeout as necessary
  } else {
      console.log('Dropdown button not found');
  }
}

// Event listener for the buttons with IDs start, pause, reset
document.getElementById('start').addEventListener('click', function () {
  handleIssueAction('start');
});

document.getElementById('pause').addEventListener('click', function () {
  handleIssueAction('pause');
});

document.getElementById('reset').addEventListener('click', function () {
  handleIssueAction('reset');
});

function sendDataToDatabase(startTime) {
  console.log(startTime);

  // Extract the username from the element
const usernameElement = document.querySelector('.lh-condensed.overflow-hidden.d-flex.flex-column.flex-justify-center.ml-2.f5.mr-auto.width-full');

// Extract username from element, or default to an empty string if element is not found
const username = usernameElement?.innerText.trim().split('\n')[0] ?? '';

  fetch('http://localhost:3100/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, startTime }), // Sending both username and startTime
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log('Start time recorded successfully');
  })
  .catch(error => {
    console.error('There was a problem recording the start time:', error);
  });
}
