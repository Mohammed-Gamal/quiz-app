// selectors
let categorySpan = document.querySelector(".quiz-info .category span");
let qCountSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let qSpans = document.querySelector(".bullets .spans");
let countdownElement = document.querySelector(".bullets .countdown");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answers_area = document.querySelector(".quiz-app .answers_area");
let submitButton = document.querySelector("button.submit-button");

// set options
let currentIndex = 1;
let rightAnswers = 0;
let duration = 5; // duration for the timer in seconds
let countdownInterval;

function getQuestions(apiLink) {
  let req = new XMLHttpRequest();

  req.onload = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questions = JSON.parse(this.responseText);
      let qCount = questions.length;

      console.log(questions);

      questionCount(qCount);
      getData(questions, qCount);

      countdown(duration, qCount);

      // Submit button
      submitButton.onclick = () => {
        clearInterval(countdownInterval);
        countdown(duration, qCount);

        let rightAnswer = questions[currentIndex].right_answer;

        checkAnswer(rightAnswer, qCount);

        // Empty the divs
        answers_area.innerHTML = "";
        quizArea.innerHTML = "";

        handleBullets();

        currentIndex++;

        getData(questions, qCount);

        showResults(qCount);
      };
    }
  };

  req.open("GET", apiLink, true);
  req.send();
}

getQuestions("html_questions.json");

// Number of available questions + bullets
function questionCount(count) {
  qCountSpan.innerHTML = count - 1;

  for (let i = 0; i < count - 1; i++) {
    let span = document.createElement("span");
    qSpans.append(span);

    // first span
    if (i === 0) span.className = "on";
  }
}

// get all questions' data function
function getData(obj, count) {
  if (currentIndex < count) {
    // questions category
    categorySpan.innerHTML = obj[0].category;

    // h2 (question title)
    let h2 = document.createElement("h2");
    h2.textContent = obj[currentIndex].title;
    quizArea.append(h2);

    // Create the answers
    for (let i = 1; i <= 4; i++) {
      // answer div
      let answerDiv = document.createElement("div");
      answerDiv.className = "answer";

      // input
      let radioInput = document.createElement("input");
      radioInput.setAttribute("type", "radio");
      radioInput.setAttribute("name", "question");
      radioInput.setAttribute("id", `answer_${i}`);
      radioInput.dataset.answer = obj[currentIndex][`answer_${i}`];
      if (i === 1) radioInput.checked = true;
      answerDiv.append(radioInput);

      // label
      let label = document.createElement("label");
      label.setAttribute("for", `answer_${i}`);
      label.textContent = obj[currentIndex][`answer_${i}`];
      label.htmlFor = `answer_${i}`;
      answerDiv.append(label);

      answers_area.append(answerDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let chosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }

  if (chosenAnswer === rAnswer) rightAnswers++;
}

function handleBullets() {
  let bulletSpans = document.querySelectorAll(".spans span");
  let spansArray = Array.from(bulletSpans);

  spansArray.forEach((span, index) => {
    if (index === currentIndex) span.className = "on";
  });
}

function showResults(qCount) {
  let questions = qCount - 1;

  if (currentIndex === questions) {
    quizArea.remove();
    answers_area.remove();
    submitButton.remove();
    bullets.remove();

    let results = document.querySelector(".results");
    let resultsSpan = document.createElement("span");

    if (rightAnswers > questions / 2 && rightAnswers < questions) {
      resultsSpan.append("Good");
      resultsSpan.classList.add("good");
    } else if (rightAnswers === questions) {
      resultsSpan.append("Perfect");
      resultsSpan.classList.add("perfect");
    } else {
      resultsSpan.append("Bad");
      resultsSpan.classList.add("bad");
    }

    results.append(resultsSpan);
    results.append(
      `, you answered ${rightAnswers} out of ${questions} questions!`
    );
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;

    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
