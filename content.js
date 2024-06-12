
// Function to inject buttons

var additionalButtonsContainer = document.createElement('div');

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

  // Container for additional buttons (Initially hidden)
  additionalButtonsContainer.id = 'additionalButtons';
  additionalButtonsContainer.style.display = 'none'; // Initially hidden

    // ITSC PMS LAUNCH
    var pmsLaunch = document.createElement('button');
    pmsLaunch.id = 'PMSLaunch';
    pmsLaunch.innerHTML = 'Start ITSC Project Management';
    pmsLaunch.classList.add('btn', 'mx-2'); // Add the 'btn-warning' class
    pmsLaunch.style.float = 'left'; // Set float left
    pmsLaunch.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      // Show additional buttons when PMS launch is clicked
      additionalButtonsContainer.style.display = 'inline-block';
      // Hide the PMS launch button
      pmsLaunch.style.display = 'none';
      // Leave a comment with the specified text
    });
  
    // Check if a comment containing "ITSC Project Management System" is found
    if (!isITSCCommentFound()) {
      parentDiv.appendChild(pmsLaunch);
    }

  // Create Restart/Timer button
  var timerButton = document.createElement('button');
  timerButton.id ='reset';
  timerButton.innerHTML = '↺'+ '&#9200;';
  timerButton.classList.add('btn', 'mx-2', 'btn-warning'); // Add the 'btn-warning' class
  timerButton.style.float = 'left'; // Set float left
  timerButton.addEventListener('click', function(e) {
    pmsLaunch.style.display = 'inline-block';
    additionalButtonsContainer.style.display = 'none';

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

  // Append buttons to the additional buttons container
  additionalButtonsContainer.appendChild(timerButton);
  additionalButtonsContainer.appendChild(startBtn);
  additionalButtonsContainer.appendChild(pauseBtn);

  // Append PMS launch button and additional buttons container to the parent div
  parentDiv.appendChild(pmsLaunch);
  parentDiv.appendChild(additionalButtonsContainer);
}

// Call the function to inject buttons
injectButtons();

// Rest of your timer functions and comment submission function...


window.addEventListener('load', hideLaunchPMS);

// Variable Declarations
let startBtn = document.getElementById('start');
let resetBtn = document.getElementById('reset');
let pauseBtn = document.getElementById('pause');
let hour = 0;
let minute = 0;
let second = 0;
let count = 0;
let timer; // Declare timer variable
let isStarted = true;
let isPaused = false; // Flag to track if the timer is paused

function hideLaunchPMS() {
  const pmsLaunch = document.getElementById('PMSLaunch');
  const pmsButtonClicked = localStorage.getItem('pmsButtonClicked');

  if (pmsLaunch && pmsButtonClicked) {
    pmsLaunch.style.display = 'none'; // Hide button
    additionalButtonsContainer.style.display = 'inline-block'; // Initially hidden

    console.log('PMS Launch Button Hidden');
  }
}



function startTimer() {
  const startBtn = document.getElementById('start');
  const pauseBtn = document.getElementById('pause');
  // Add null check to ensure buttons are available in the DOM
  if (startBtn && pauseBtn) {
    if (!isPaused) {
      localStorage.setItem('startTime', new Date().getTime()); // Save the start time in localStorage
    } else {
      const pausedTime = parseInt(localStorage.getItem('pausedTime'), 10);
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - pausedTime;
      const startTime = parseInt(localStorage.getItem('startTime'), 10);
      localStorage.setItem('startTime', startTime + timeDifference);
    }
    timer = setInterval(stopWatch, 10); // Start the timer
    startBtn.style.display = 'none'; // Hide the start button
    pauseBtn.style.display = 'inline-block'; // Show the pause button
    isStarted = true; // Update the global flag
    isPaused = false;
    console.log('Timer started');
    saveState(); // Save state when timer starts
  }
}

function sendDataToDatabase(startTime) {
  // Make a POST request to your server endpoint
  fetch('http://localhost:3000/recordStartTime', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ startTime: startTime }),
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

// Function to pause the timer
function pauseTimer() {
  const startBtn = document.getElementById('start');
  const pauseBtn = document.getElementById('pause');
  // Add null check to ensure buttons are available in the DOM
  if (startBtn && pauseBtn && timer) {
    clearInterval(timer); // Stop the timer
    timer = null; // Reset the timer variable
    isPaused = true; // Set the paused flag
    isStarted = false;
    localStorage.setItem('pausedTime', new Date().getTime());
    pauseBtn.style.display = 'none'; // Hide the pause button
    startBtn.textContent = 'Resume'; // Change the start button text to "Resume"
    startBtn.style.display = 'inline-block'; // Show the start button
    console.log('Timer paused');
    saveState(); // Save state when timer pauses
  }
}

// Function to reset the timer
function resetTimer() {
  const startBtn = document.getElementById('start');
  const pauseBtn = document.getElementById('pause');
  // Add null check to ensure buttons are available in the DOM
  if (startBtn && pauseBtn) {
    clearInterval(timer); // Stop the timer
    timer = null; // Reset the timer variable
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
window.addEventListener('load', () => {
  const savedState = JSON.parse(localStorage.getItem('stopwatchState'));

  document.getElementById("new_comment_field").value = "";


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
                  fetch('http://localhost:3100/username', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: 'exampleUser', time: 4352542345 })
                  })
                  .then(response => {
                    if (!response.ok) {
                      throw new Error('Failed to send username to server');
                    }
                    return response.json();
                  })
                  .then(data => {
                    console.log('Username sent to server successfully');
                  })
                  .catch(error => {
                    console.error('Error sending username to server:', error);
                  });
                  

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
