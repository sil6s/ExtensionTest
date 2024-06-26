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
timerButton.style.float = 'right';
timerButton.addEventListener('click', function (e) {
e.preventDefault();
e.stopPropagation();
resetTimer();
});

// Create End PMS Timer button
var endPMS = document.createElement('button');
endPMS.id = 'endPMS';
endPMS.innerHTML = 'Finish Timer';
endPMS.classList.add('btn-endPMS', 'btn', 'mx-2', 'btn-primary'); // Ensure mx-2 class is added
endPMS.style.float = 'left';
endPMS.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
});

// Inject CSS for idle and hover states
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
    .btn-endPMS {
        background-color: #980000 !important;
        color: white !important;
        margin: 0 8px; /* Adjust margin as needed */
        transition: background-color 0.3s, color 0.3s; /* Add transition for smooth color change */
    }
\
`;
document.getElementsByTagName('head')[0].appendChild(style);


  // Create Start button
  var startBtn = document.createElement('button');
  startBtn.id = 'start';
  startBtn.textContent = 'Start';
  startBtn.classList.add('btn', 'btn-primary', 'mx-2');
  startBtn.style.float = 'left';
  startBtn.addEventListener('click', function (e) {
    const startTime = new Date();
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
    const pauseTime = new Date();
    e.preventDefault();
    e.stopPropagation();
    pauseTimer();
  });

  // Append buttons to the parent div
  parentDiv.appendChild(startBtn);
  parentDiv.appendChild(pauseBtn);
  parentDiv.appendChild(endPMS);
  parentDiv.appendChild(timerButton);


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
var sessionStartTime = null;
var sessionDuration = 0;

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

function startTimer() {
    isTimerActive = 1;
    isTimerPaused = 0;
    startTime = new Date(); // Capture the start time
    sessionStartTime = new Date(); // Record session start time

    // Call sendTimeToDatabase with type 'start' and startTime
    sendTimeToDatabase('start', startTime);

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

// Array to store session durations
var sessionDurations = [];

// Function to pause the timer and calculate session duration
function pauseTimer() {
    isTimerActive = 0;
    clearInterval(timer);
    var sessionDuration = Math.round((new Date() - sessionStartTime) / 1000); // Calculate session duration in seconds
    console.log('Session duration:', sessionDuration); // Check sessionDuration in console
    sessionDurations.push(sessionDuration); // Store session duration in the array

    SaveData();

    // Call sendTimeToDatabase with type 'pause' and pauseTime
    sendTimeToDatabase('pause', new Date());

    var sessionDurationMessage = `${username}'s session duration: ${sessionDuration} seconds`;
    console.log('Session duration message:', sessionDurationMessage); // Check formatted message

    // Example log data (you need to replace this with your actual log)
    const log = `
        start date: ${startTime}
        stop date: ${new Date().toISOString()}
    `;
    calculateDuration(log);

    timerCount = 0;
    startTime = null; // Reset startTime after logging
    startBtn.style.display = 'inline-block'; // Show start button
    pauseBtn.style.display = 'none'; // Hide pause button

    // Log the updated session durations array
    console.log('Session Durations:', sessionDurations);

    // Update total issue duration after pausing the timer
    updateTotalIssueDuration();

    // Call handleIssueAction with sessionDurationMessage
    handleIssueAction('pause', sessionDurationMessage);

    console.log('After handleIssueAction session duration:', sessionDuration); // Check sessionDuration after passing to handleIssueAction
}


// Function to update total issue duration based on session durations array
function updateTotalIssueDuration() {
    var totalIssueDuration = getTotalIssueDuration();
    console.log('Total Issue Duration:', totalIssueDuration, 'seconds');
}

// Function to get total issue duration from sum of session durations
function getTotalIssueDuration() {
    // Sum up all session durations in the array
    var totalDuration = sessionDurations.reduce(function (a, b) {
        return a + b;
    }, 0);

    // Return the total duration in seconds
    return totalDuration;
}

// Function to reset the timer and clear session durations array
function resetTimer() {
    clearInterval(timer); // Clear the interval
    sec = 0;
    totalSeconds = 0;
    timerDisplay.textContent = '00:00:00';
    isTimerActive = 0;
    isTimerPaused = 0;
    lastDate = null;

    console.log('Before reset, sessionDurations:', sessionDurations);
    sessionDurations = []; // Clear session durations array
    console.log('After reset, sessionDurations:', sessionDurations);


    sessionDurations = []; // Clear session durations array

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

// Example usage:
// Assuming sessionDurations array is populated or loaded from localStorage
// Call updateTotalIssueDuration() whenever you need to update and log the total issue duration
updateTotalIssueDuration();

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

function calculateDuration(log) {
    const records = log.split("\n");
    const startRecords = [];
    const stopRecords = [];

    // Extract start and stop records
    for (const record of records) {
        if (record.includes("start date:")) {
            startRecords.push(record.replace("start date: ", "").trim());
        }
        if (record.includes("stop date:")) {
            stopRecords.push(record.replace("stop date: ", "").trim());
        }
    }

    // Ensure equal number of start and stop records
    if (startRecords.length !== stopRecords.length) {
        console.error("Mismatched start and stop records.");
        return 0;
    }

    let totalTimeSpent = 0;

    // Calculate total time spent
    for (let i = 0; i < startRecords.length; i++) {
        const startDate = new Date(startRecords[i]);
        const stopDate = new Date(stopRecords[i]);

        if (isNaN(startDate.getTime()) || isNaN(stopDate.getTime())) {
            console.error("Invalid date format in records.");
            continue;
        }

        const difference = (stopDate - startDate) / 1000; // Difference in seconds
        totalTimeSpent += difference;
    }

    return totalTimeSpent;
}

// Function to click the dropdown button, then edit, and submit
function handleIssueAction(action, sessionDurationMessage) {
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

                    // Check if the title "## ITSC Project Management:" exists
                    var title = "## ITSC Project Management:";
                    if (!textarea.value.includes(title)) {
                        textarea.value = `${title}\n### ${username} initiated issue at ${currentTime}, ${currentDate}:\n` + textarea.value;
                        console.log('Title added');
                    }

                    // Initialize variables
                    var message = '';
                    var divider = '........................................';

                    // Determine the action and update textarea accordingly
                    if (action === 'start') {
                        message = `${username} started issue`;
                    } else if (action === 'pause') {
                        // Log "user paused issue at" with a line break before it
                        textarea.value += `\n${username} paused issue at ${new Date().toLocaleString()}\n`;

                        // Append session duration message and divider
                        textarea.value += `${sessionDurationMessage}\n${divider}`;
                    } else if (action === 'reset') {
                        message = `${username} reset issue`;
                    } else if (action === 'update') {
                        message = `${username} updated comment`;
                    } else if (action === 'finish') {
                        // Log "user finished issue at" with a line break before it
                        textarea.value += `\n${username} finished working on ${new Date().toLocaleString()}\n`;

                        // Update total issue duration before appending session duration message
                        updateTotalIssueDuration();

                        // Get the updated total issue duration
                        var totalIssueDuration = getTotalIssueDuration();

                        // Append session duration message and divider
                        textarea.value += `Total Issue Duration: ${ConvertTimeToFormat(totalIssueDuration)}\n${divider}`;
                    }

                    // Append the action message to textarea only when not pausing or finishing
                    if (action !== 'pause' && action !== 'finish') {
                        textarea.value += `\n${message} at ${new Date().toLocaleString()}`;
                    }

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

document.getElementById('endPMS').addEventListener('click', function () {
    handleIssueAction('finish');
  });


  function sendTimeToDatabase(type, time, sessionDuration = null) {

    var username = document.querySelector('meta[name="octolytics-actor-login"]').getAttribute('content');
    console.log('Sending Database User' + username);

    console.log('Database User: ' + username)
  
    // Grab the issue title
    const issueTitleElement = document.querySelector('.js-issue-title.markdown-title');
    const issueName = issueTitleElement ? issueTitleElement.textContent.trim() : '';
  
    // Construct payload for POST request
    const data = {
      username,
      issueName,
      type, // 'start' or 'pause'
      time, // Date object or string representing time
      sessionDuration, // Duration of the session in seconds
    };
  
    // Send data to backend
    fetch('http://localhost:3100/record-time', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log(`${type} time recorded successfully`);
    })
    .catch(error => {
      console.error(`There was a problem recording the ${type} time:`, error);
    });
  }
  
  // Updated startTimer function
  function startTimer() {
    isTimerActive = 1;
    isTimerPaused = 0;
    startTime = new Date(); // Capture the start time
    sessionStartTime = new Date(); // Record session start time
  
    // Call sendTimeToDatabase with type 'start' and startTime
    sendTimeToDatabase('start', startTime);
  
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
  
  // Updated pauseTimer function
  function pauseTimer() {
    isTimerActive = 0;
    clearInterval(timer);
    var sessionDuration = Math.round((new Date() - sessionStartTime) / 1000); // Calculate session duration in seconds
    console.log('Session duration:', sessionDuration); // Check sessionDuration in console
    sessionDurations.push(sessionDuration); // Store session duration in the array
  
    SaveData();
  
    // Call sendTimeToDatabase with type 'pause', pauseTime and sessionDuration
    sendTimeToDatabase('pause', new Date(), sessionDuration);
  
    var sessionDurationMessage = `${username}'s session duration: ${sessionDuration} seconds`;
    console.log('Session duration message:', sessionDurationMessage); // Check formatted message
  
    // Example log data (you need to replace this with your actual log)
    const log = `
      start date: ${startTime}
      stop date: ${new Date().toISOString()}
    `;
    calculateDuration(log);
  
    timerCount = 0;
    startTime = null; // Reset startTime after logging
    startBtn.style.display = 'inline-block'; // Show start button
    pauseBtn.style.display = 'none'; // Hide pause button
  
    // Log the updated session durations array
    console.log('Session Durations:', sessionDurations);
  
    // Update total issue duration after pausing the timer
    updateTotalIssueDuration();
  
    // Call handleIssueAction with sessionDurationMessage
    handleIssueAction('pause', sessionDurationMessage);
  
    console.log('After handleIssueAction session duration:', sessionDuration); // Check sessionDuration after passing to handleIssueAction
  }
  