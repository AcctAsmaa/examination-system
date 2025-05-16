
document.addEventListener("DOMContentLoaded", function () {
    const switchTheme = document.getElementById("switch");
    const themeIcon = document.querySelector(".theme-toggle label");
  
    const currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
  
    if (currentTheme === "dark") {
      switchTheme.checked = true;
      themeIcon.textContent = "🌙";
    } else {
      themeIcon.textContent = "☀️";
    }
  
    switchTheme.addEventListener("change", function () {
      if (this.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        themeIcon.textContent = "🌙";
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
        themeIcon.textContent = "☀️";
      }
    });
  });
  
  
  
  const questionCard = document.getElementById('questionCard');
  const userNameSpan = document.getElementById('userName');
  const timerDisplay = document.getElementById('timer');
  const prevButton = document.getElementById('prevQuestion');
  const nextButton = document.getElementById('nextQuestion');
  const submitButton = document.getElementById('submitExam');
  const markReviewBtn = document.getElementById('markReview');
  const markedPopup = document.getElementById('markedPopup');
  const markedQuestionsDiv = document.getElementById('markedQuestions');
  const progressBar = document.getElementById('progressBar');
  const examHeader = document.querySelector('.exam-header');
  
  
  const user = JSON.parse(localStorage.getItem('examUser'));
  if (user) userNameSpan.textContent = user.firstName;
  
  let questions = [];
  let currentQuestion = 0;
  let score = 0;
  let selectedAnswers = {};
  let timerSeconds = 600;
  let timerInterval;
  let markedQuestions = [];
  
  fetch('../questions.json')
    .then(response => response.json())
    .then(data => {
      questions = shuffleArray(data);
      startExam();
    })
    .catch(error => {
        console.error('Error loading questions:', error);
        questionCard.innerHTML = "<h3>⚠️ Failed to load questions.</h3>";
    });
      


  function startExam() {
    currentQuestion = 0;
    score = 0;
    selectedAnswers = {};
    markedQuestions = [];
    timerSeconds = 600;
    markedQuestionsDiv.innerHTML = '';
    markedPopup.classList.add('hidden');
    progressBar.style.width = '0%';
    timerDisplay.textContent = '10:00';
  
    startTimer();
    showQuestion();
  }
  
  nextButton.addEventListener('click', nextQuestion);
  prevButton.addEventListener('click', prevQuestion);
  markReviewBtn.addEventListener('click', toggleMarkReview);
  
  
  function showQuestion() {
    const q = questions[currentQuestion];
    questionCard.innerHTML = `
      <h3>${q.question}</h3>
      <div class="choices">
        ${q.choices.map((choice, index) => `
          <label>
            <input type="radio" name="choice" value="${index}" ${selectedAnswers[currentQuestion] == index ? 'checked' : ''}>
            ${choice}
          </label><br>
        `).join('')}
      </div>
    `;
  
    document.querySelectorAll('input[name="choice"]').forEach(input => {
      input.addEventListener('change', saveSelectedAnswer);
    });
    updateButtons();
    updateMarkButton();
    update_numberOfQuestion();
  
  }
  
  function updateButtons() {
    prevButton.disabled = currentQuestion === 0;
    if (currentQuestion === questions.length - 1) {
      nextButton.classList.add('hidden');
      submitButton.classList.remove('hidden');
    } else {
      nextButton.classList.remove('hidden');
      submitButton.classList.add('hidden');
    }
  }
  
  function nextQuestion() {
    saveSelectedAnswer();
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      showQuestion();
    }
  }
  
  function prevQuestion() {
    saveSelectedAnswer();
    if (currentQuestion > 0) {
      currentQuestion--;
      showQuestion();
    }
  }
  
  function saveSelectedAnswer() {
    const selected = document.querySelector('input[name="choice"]:checked');
    if (selected) {
      selectedAnswers[currentQuestion] = parseInt(selected.value);
      updateProgressBar();
    }
  }
  
  function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerSeconds--;
    let minutes = Math.floor(timerSeconds / 60);
    let seconds = timerSeconds % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);

      timerDisplay.style.display = 'none';
      markedPopup.style.display = 'none';
      examHeader.style.display = 'none';

      calculateScore();

      localStorage.setItem('userScore', score); 
      localStorage.setItem('totalQuestions', questions.length); 
      localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers)); 

      location.replace('timeout.html');
    }
  }, 1000);
}

  
  function endExam() {
   
    clearInterval(timerInterval);
    timerDisplay.style.display = 'none';
    markedPopup.style.display = 'none';
    examHeader.style.display = 'none';
    calculateScore();
    localStorage.setItem('examResult', JSON.stringify({ name: user.firstName, score }));
    showResult();
  }
  
  function calculateScore() {
    score = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) score++;
    });
  }
  
  function showResult() {
    const questionText = document.getElementById('questionProgressText');
    questionText.style.display = "none";
    document.querySelector('.exam-actions').style.display = "none";
    questionCard.innerHTML = "<h3>Calculating your result...⏳</h3>";
  
    setTimeout(() => {
      const percentage = (score / questions.length) * 100;
      localStorage.setItem("finalScore", percentage + "%");
  
      if (percentage >= 50) {
        location.replace(`../pages/success-result.html`);
      } else {
        location.replace('../pages/fail_result.html');
      }
    }, 3000);
  }
  
  function retryExam() {
    clearInterval(timerInterval);
    currentQuestion = 0;
    score = 0;
    selectedAnswers = {};
    markedQuestions = [];
    questions = shuffleArray(questions);
    timerSeconds = 600;
    markedQuestionsDiv.innerHTML = '';
    markedPopup.classList.add('hidden');
    document.querySelector('.exam-actions').style.display = "block";
    timerDisplay.style.display = 'block';
    timerDisplay.textContent = '10:00';
    progressBar.style.width = `0%`;
    startTimer();
    showQuestion();
  }
  
  function shuffleArray(arr) {
    let shuffled = arr.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  function toggleMarkReview() {
    const index = markedQuestions.indexOf(currentQuestion);
    if (index === -1) {
      markedQuestions.push(currentQuestion);
    } else {
      markedQuestions.splice(index, 1);
    }
    updateMarkedPopup();
    updateMarkButton();
  }
  
  function updateMarkButton() {
    if (markedQuestions.includes(currentQuestion)) {
      markReviewBtn.textContent = '❌ Remove Mark';
    } else {
      markReviewBtn.textContent = '⭐ Mark for Review';
    }
  }
  
  function updateMarkedPopup() {
    markedQuestionsDiv.innerHTML = '';
    if (markedQuestions.length === 0) {
      markedPopup.classList.add('hidden');
      return;
    }
    markedPopup.classList.remove('hidden');
    markedQuestions.forEach(qIndex => {
      const btn = document.createElement('button');
      btn.innerText = `Q${qIndex + 1}`;
      btn.onclick = () => jumpToMarked(qIndex);
      markedQuestionsDiv.appendChild(btn);
    });
  }
  
  function jumpToMarked(qIndex) {
    currentQuestion = qIndex;
    showQuestion();
  }
  
  function updateProgressBar() {
    const answeredCount = Object.keys(selectedAnswers).length;
    const percentage = (answeredCount / questions.length) * 100;
    progressBar.style.width = `${percentage}%`;
  }
  
  function update_numberOfQuestion() {
    const progressBar2 = document.getElementById('progressBar2');
    const questionText = document.getElementById('questionProgressText');
  
    const current = currentQuestion + 1;
    const total = questions.length;
    questionText.textContent = `Question ${current} from ${total}`;
  }
  
  
  
  submitButton.addEventListener("click", function() {
  if (Object.keys(selectedAnswers).length === questions.length) {
    endExam();}
    else{
 alert("⚠️ Please answer all questions before submitting the exam.");
    }
   
  return;

});    


  
  
  


  
  
  
  
  