let highscoreLink = document.querySelector("#highscore-link");
let headerRight = document.querySelector("#header-right");
let timeText = document.querySelector("#time");
let startButton = document.querySelector("#start");
let contentHeader = document.querySelector("#content-header");
let contentBody = document.querySelector("#content-body");
let buttonContainer = document.querySelector("#button-container");
let feedbackText = document.querySelector("#feedback");

// initialize the timer text to 100
let startingTimer = 100;
timeText.textContent = startingTimer;

let quizQuestions = [{
    header : "Which data type can hold a value of either true or false?",
    answer1 : "string",
    answer2 : "boolean",
    answer3 : "number",
    answer4 : "array",
    correctAnswer : 2
}, {
    header : "Which statement will increment the variable <em>i</em>?",
    answer1 : "i = i + 1;",
    answer2 : "i += 1;",
    answer3 : "i++;",
    answer4 : "all of the above",
    correctAnswer : 4
}, {
    header : "In JavaScript, arrays are denoted by:",
    answer1 : "square brackets",
    answer2 : "curly brackets",
    answer3 : "angle brackets",
    answer4 : "parentheses",
    correctAnswer : 1
} , {
    header : "If <em>a</em> is true, and <em>b</em> is false, which statement returns true?",
    answer1 : "a && b",
    answer2 : "b || !a",
    answer3 : "!b && !a",
    answer4 : "!b || !a",
    correctAnswer : 4
} , {
    header : "How many times will the following loop run?<br><code>for (let i = 1; i < 6; i++) {<br>&nbsp;&nbsp;&nbsp;&nbsp;console.log(i);<br>}</code>",
    answer1 : "0",
    answer2 : "1",
    answer3 : "5",
    answer4 : "6",
    correctAnswer : 3
} , {
    header : "What will the following code output to the console?<br><code>let i = \"24\";<br>console.log(i + 1);</code></pre>",
    answer1 : "241",
    answer2 : "25",
    answer3 : "24",
    answer4 : "1",
    correctAnswer : 1
} , {
    header : "Which code will generate a random integer from 1 to 10?",
    answer1 : "Math.random() * 10",
    answer2 : "Math.floor(Math.random() * (10 + 1))",
    answer3 : "Math.floor(Math.random() * 10 + 1)",
    answer4 : "Math.floor(Math.random() * 9 + 1)",
    correctAnswer : 3
} , {
    header : "The condition for an if statement is enclosed in:",
    answer1 : "nothing",
    answer2 : "square brackets",
    answer3 : "curly brackets",
    answer4 : "none of the above",
    correctAnswer : 4
} , {
    header : "The following is <em>not</em> a valid data type in JavaScript:",
    answer1 : "number",
    answer2 : "string",
    answer3 : "jumbotron",
    answer4 : "boolean",
    correctAnswer : 3
} , {
    header : "Which of the following is a valid way to retrieve the value of the <em>name</em> property of the <em>person</em> object?",
    answer1 : "person.name",
    answer2 : "person[\"name\"]",
    answer3 : "both of the above",
    answer4 : "none of the above",
    correctAnswer : 3
} , {
    header : "Choose the array with a <em>length</em> of 3:",
    answer1 : "[0, 1, 2]",
    answer2 : "[\"cow\", \"pig\", \"horse\", \"sheep\"]",
    answer3 : "[3]",
    answer4 : "[\"abc\"]",
    correctAnswer : 1
} , {
    header : "Strings are enclosed within:",
    answer1 : "strings",
    answer2 : "square brackets",
    answer3 : "parentheses",
    answer4 : "quotes",
    correctAnswer : 4
}];

let score = 0;
//load highscores
let highscores = [];
if (localStorage.getItem("highscores")) {
    highscores = JSON.parse(localStorage.getItem("highscores"));
}
let timerInterval; // prepping global quiz timer

function startQuiz() {
    //initialize the timer
    let timer = startingTimer;
    flashElement(headerRight, 0, 123, 255); //for fun

    timeText.textContent = timer;
    timerInterval = setInterval(function() {
        timer--;
        timeText.textContent = timer;
        if (timer <= 10) {
            flashElement(headerRight, 255, 0, 0);
        }
        if (timer === 0) {
            //game over!
            // show results screen
            storeHighscore();
            contentHeader.textContent = "Time's up!"; //make sure the user knows why they got booted
        }
    }, 1000);

    //start the quiz by loading the first question
    loadQuestion();
}

function loadQuestion(q=1) {
    //loads the questions in order
    buttonContainer.textContent = "";
    for (let i = 1; i <= 4; i++) {
        //create the answer buttons
        let question = quizQuestions[q - 1];
        let button = document.createElement("button");
        button.setAttribute("class", "btn btn-primary");
        button.textContent = question["answer" + i];
        contentHeader.textContent = "Question #" + q;
        contentBody.innerHTML = question.header;
        if (i === question.correctAnswer) {
            // button for the correct answer
            button.addEventListener("click", function() {
                score++; //add to score
                feedbackText.textContent = "Correct!";
                flashElement(feedbackText, 0, 255, 0);
                if (quizQuestions[q]) {
                    loadQuestion(q + 1);
                } else {
                    // load results screen
                    storeHighscore();
                }
            });
        } else {
            //wrong answer
            button.addEventListener("click", function() {
                feedbackText.textContent = "Incorrect :("
                flashElement(feedbackText, 255, 0, 0);
                if (quizQuestions[q]) {
                    loadQuestion(q + 1);
                } else {
                    // load results screen
                    storeHighscore();
                }
            });
        }
        buttonContainer.appendChild(button);
    }
}

function storeHighscore() {
    //freeze timer, refresh page content
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    flashElement(headerRight, 255, 255, 0); //flash yellow for feedback
    buttonContainer.textContent = "";
    feedbackText.textContent = "";
    //display score
    contentHeader.textContent = "Quiz complete!";
    contentBody.textContent = "Your score is: " + score;
    //let user input initials
    let initialsInput = document.createElement("input");
    initialsInput.setAttribute("class", "form-control");
    initialsInput.setAttribute("placeholder", "Your initials here");
    let submitButton = document.createElement("button");
    submitButton.setAttribute("class", "btn btn-primary");
    submitButton.textContent = "Submit";

    submitButton.addEventListener("click", function() {
        let initials = initialsInput.value.toUpperCase();
        if (initials) {
            highscores.push([initials, score]);
            localStorage.setItem("highscores", JSON.stringify(highscores));
            showHighscores();
        }
    });

    contentBody.appendChild(initialsInput);
    buttonContainer.appendChild(submitButton);
}

function showHighscores() {
    //clear the timer in case the user used the header link to navigate away from the quiz
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    contentHeader.textContent = "Highscores";
    contentBody.textContent = "";
    buttonContainer.textContent = "";
    feedbackText.textContent = "";
    if (highscores.length === 0) {
        contentBody.textContent = "No highscores recorded yet!";
    } else {
        highscores.sort(function(a, b) {
            //sort highscores highest to lowest
            return parseInt(b[1]) - parseInt(a[1]);
        });
        highscores.forEach(function(value) {
            let initials = value[0];
            let score = value[1];
            let highscoreDiv = document.createElement("div");
            highscoreDiv.textContent = initials + ": " + score + " points";
            contentBody.appendChild(highscoreDiv);
        });
    }
    let clearButton = document.createElement("button");
    clearButton.setAttribute("class", "btn btn-danger");
    clearButton.textContent = "Clear highscores";
    clearButton.addEventListener("click", function() {
        highscores = [];
        localStorage.setItem("highscores", JSON.stringify([]));
        showHighscores();
        feedbackText.textContent = "Cleared!";
        flashElement(feedbackText, 0, 123, 255);
    });

    let backButton = document.createElement("button");
    backButton.setAttribute("class", "btn btn-primary");
    backButton.textContent = "Go back";
    backButton.addEventListener("click", function() {
        location.reload(true);
    });

    buttonContainer.appendChild(clearButton);
    buttonContainer.appendChild(backButton);
}

highscoreLink.addEventListener("click", showHighscores);
startButton.addEventListener("click", startQuiz);

function flashElement(element, r, g, b, timer=50, factor=2) {
    //for fun, makes the element "flash" with the specified color
    element.setAttribute("style", `color: rgb(${r - r / (timer / factor)}, ${g - g / (timer / factor)}, ${b - b / (timer / factor)})`);
    let timerFlashInterval = setInterval(function() {
        timer--;
        if (timer === 0) {
            clearInterval(timerFlashInterval);
        } else {
            element.setAttribute("style", `color: rgb(${r - r / (timer / factor)}, ${g - g / (timer / factor)}, ${b - b / (timer / factor)})`);
        }
    }, 1);
}