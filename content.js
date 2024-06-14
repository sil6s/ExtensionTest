// Inject buttons function
var results;
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
var startBtn = document.getElementById("start");
var pauseBtn = document.getElementById("pause");
var resetBtn = document.getElementById("reset");
var timerDisplay = document.getElementById("timerDisplay");
var sec = 0;
var totalSeconds = 0; // Deprecated
var startTime;
var secondsString = "00";
var minutesString = "00";
var hoursString = "00";
var daysString = "00";
var totalTimeString = "00:00:00:00";
var timer;
var isTimerActive = 0;
var isTimerPaused = 0;
var lastDate;
var currentDate;
var commentNumber = 0;
var commentIdentifier = "";
var username;
var timerCount = 0;

// Initialize Timer
InitializeTimer();
timerCount++;
navigation.addEventListener("navigate", function () {
    console.log("Location changed");
    InitializeTimer();
    timerCount++;
});

// On initialization
function InitializeTimer() {
    username = document.getElementsByName("user-login")[0].content;
    console.log("Username: " + username);
    if (localStorage.getItem(username + window.location.href) == null) {
        SaveData();
    }
    LoadData();
    if (results == 0) {
        console.log("Initialization failed");
        CreateUserTimerLog(username);
    }
    if (results == 1) {
        console.log("Initialization successful");
    }
    startBtn.scrollIntoView({ behavior: 'instant' });
    console.log("Timer initialized");
    if (sec == null) {
        sec = 0;
    }
    totalTimeString = ConvertTimeToFormat(Number(sec));
    timerDisplay.textContent = totalTimeString;
    if (isTimerActive == 1) {
        if (timerCount == 0) {
            console.log("Timer was active before reset");
            if (lastDate != null) {
                currentDate = Date();
                var difference = new Date(currentDate).getTime() - new Date(lastDate).getTime();
                console.log("Time difference: " + (Number(difference) / 1000));
                sec = Number(sec) + Number(Math.round(difference / 1000));
                console.log("Updated seconds: " + sec)
                if (Number(sec) < 0 || Number(sec) == null) {
                    sec = 0;
                }
            }
            else {
                console.log("Last logged time for continuing timer is null")
            }
            startTimer();
        }
    }
}

// Function to start the timer
function startTimer() {
    isTimerActive = 1;
    isTimerPaused = 0;
    startTime = Date(); // Capture the start time
    sendDataToDatabase(startTime); // Call sendDataToDatabase function
    timer = setInterval(function () {
        sec = Number(sec) + 1;
        totalSeconds += parseInt(1);
        lastDate = Date();
        SaveData();
        totalTimeString = ConvertTimeToFormat(Number(sec));
        timerDisplay.textContent = totalTimeString;
  
        // Show pause button and hide start button
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
    }, 1000);
  }
  

// Function to convert time to the desired format
function ConvertTimeToFormat(seconds) {
    var minutes = 0;
    var hours = 0;
    var days = 0;
    if (seconds == NaN) {
        console.log("Seconds is null, resetting");
        seconds = 0;
    }
    Number(seconds);
    days = Math.floor(Number(seconds) / (3600 * 24));
    hours = Math.floor(Number(seconds) % (3600 * 24) / 3600);
    minutes = Math.floor(Number(seconds) % 3600 / 60);
    seconds = Math.floor(Number(seconds) % 60);
    secondsString = seconds;
    if (Number(seconds) < 10) {
        secondsString = "0" + String(seconds);
    }
    minutesString = minutes
    if (Number(minutes) < 10) {
        minutesString = "0" + minutes;
    }
    hoursString = hours;
    if (Number(hours) < 10) {
        hoursString = "0" + hours;
    }
    if (Number(days) >= 99) {
        pauseTimer();
        timerDisplay.textContent = "Max Value Reached";
    }
    daysString = days;
    if (Number(days) < 10) {
        daysString = "0" + days;
    }
    return daysString + ":" + hoursString + ':' + minutesString + ':' + secondsString;
}

// Function to stop the timer
function pauseTimer() {
    isTimerActive = 0;
    clearInterval(timer);
    SaveData();
    timerCount = 0;
}

function resetTimer() {
    clearInterval(timer); // Clear the interval
    sec = 0;
    totalSeconds = 0;
    timerDisplay.textContent = '00:00:00';
    isTimerActive = 0;
    isTimerPaused = 0;
    lastDate = null;
    SaveData();

    // Show start button and hide pause button
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
}


// Function to save the timer state to local storage
function SaveData() {
    const state = {
        sec,
        isTimerActive,
        isTimerPaused,
        lastDate,
        commentNumber,
        commentIdentifier
    };
    localStorage.setItem(username + window.location.href, JSON.stringify(state));
}

// Function to load the timer state from local storage
function LoadData() {
    console.log("Loading data from: " + username + window.location.href);
    const state = JSON.parse(localStorage.getItem(username + window.location.href));
    sec = state.sec;
    if (sec == null) {
        sec = 0;
    }
    console.log("Starting Seconds" + sec);
    isTimerActive = state.isTimerActive;
    if (isTimerActive == null) {
        isTimerActive = 0;
    }
    console.log("isTimerActive: " + isTimerActive);
    isTimerPaused = state.isTimerPaused;
    if (isTimerPaused == null) {
        isTimerPaused = 0;
    }
    console.log("isTimerPaused: " + isTimerPaused);
    lastDate = state.lastDate;
    console.log("Last saved Date: " + lastDate);
    commentNumber = state.commentNumber;
    commentIdentifier = state.commentIdentifier;
    console.log("Comment Number: " + commentNumber);
    console.log("Comment Identifier: " + commentIdentifier);
}

// Event Listeners
startBtn.addEventListener('click', function () {
    console.log("Start Button Clicked");
    if (isTimerActive == 0) {
        isTimerActive = 1;
        SaveData();
        startTimer();
        LogTime();
    }
});

pauseBtn.addEventListener('click', function () {
    console.log("Pause Button Clicked");
    if (isTimerActive == 1 && isTimerPaused == 0) {
        isTimerPaused = 1;
        pauseTimer();
        SaveData();
        LogEndOfTimer();
    }
});

resetBtn.addEventListener('click', function () {
    console.log("Stop Button Clicked");
    pauseTimer();
    resetTimer();
});


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
  
    // Grab the issue title
    const issueTitleElement = document.querySelector('.js-issue-title.markdown-title');
    const issueName = issueTitleElement ? issueTitleElement.textContent.trim() : '';
    console.log('Issue Name:', issueName);
  
    fetch('http://localhost:3100/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, startTime, issueName }), // Sending username, startTime, and issueName
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
  