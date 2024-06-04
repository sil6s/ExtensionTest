function injectButtons() {
    // Find the parent div where buttons will be inserted
    var parentDiv = document.querySelector('.BtnGroup.d-flex.width-full');

    // Create Timer button
    var timerButton = document.createElement('button');
    timerButton.innerHTML = '&#9200;';
    timerButton.classList.add('btn', 'mx-2');
    timerButton.style.float = 'left'; // Set float left
    timerButton.disabled = true; // Disable the button

    // Create Start button
    var startBtn = document.createElement('button');
    startBtn.textContent = 'Start';
    startBtn.classList.add('btn', 'btn-primary', 'mx-2');
    startBtn.style.float = 'left'; // Set float left
    startBtn.addEventListener('click', function() {
        // Start button logic here
        console.log('Start button clicked');
    });

    // Create Pause button
    var pauseBtn = document.createElement('button');
    pauseBtn.textContent = 'Pause';
    pauseBtn.classList.add('btn', 'btn-warning', 'mx-2', 'btn-pause');
    pauseBtn.style.float = 'left'; // Set float left
    pauseBtn.addEventListener('click', function() {
        // Pause button logic here
        console.log('Pause button clicked');
    });

    // Create Stop button
    var stopBtn = document.createElement('button');
    stopBtn.textContent = 'Stop';
    stopBtn.classList.add('btn', 'btn-danger', 'mx-2');
    stopBtn.style.float = 'left'; // Set float left
    stopBtn.addEventListener('click', function() {
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
