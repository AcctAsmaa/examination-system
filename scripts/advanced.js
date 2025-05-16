        const switchTheme = document.getElementById("switch");
        switchTheme.addEventListener("change", function () {
            document.documentElement.setAttribute("data-theme", this.checked ? "dark" : "light");
        });

        let quizData = [];
        let currentQuestion = 0;
        let score = 0;
        let totalTime = 120;
        let globalTimer;

        const questionNumberEl = document.getElementById("question-number");
        const questionEl = document.getElementById("question");
        const optionsContainer = document.getElementById("options-container");
        const timerEl = document.getElementById("timer");
        const nextBtn = document.getElementById("next-btn");
        const prevBtn = document.getElementById("prev-btn");
        const submitBtn = document.getElementById("submit-btn");
        const resultEl = document.getElementById("result");
        const scoreEl = document.getElementById("score");
        let selectedAnswers = {};
        let markedQuestion = null;
        function startGlobalTimer() {
            timerEl.textContent = `Time left: ${totalTime}s`;
            globalTimer = setInterval(() => {
                totalTime--;
                timerEl.textContent = `Time left: ${totalTime}s`;
                if (totalTime <= 0) {
                    clearInterval(globalTimer);
                    localStorage.setItem("userScore", score);
                    localStorage.setItem("totalQuestions", quizData.length);
                    localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
                    window.location.href = "timeout.html";
                }
            }
                , 1000);
        }
        function updateProgressBar() {
            const answeredCount = Object.keys(selectedAnswers).length;
            const percentage = (answeredCount / quizData.length) * 100;
            document.getElementById("progress-bar").style.width = `${percentage}%`;
            document.getElementById("progress-text").textContent = `${answeredCount} / ${quizData.length} answered`;

        }
        function loadQuestion() {
            clearInterval(globalTimer);
            const { question, options } = quizData[currentQuestion];

            questionNumberEl.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
            questionEl.textContent = question;

            optionsContainer.innerHTML = "";
            options.forEach(optionText => {
                const label = document.createElement("label");
                label.style.display = "block";

                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = "option";
                radio.value = optionText;
                radio.classList.add("option");
                radio.onclick = handleOptionChange;


                if (selectedAnswers[currentQuestion] === optionText) {
                    radio.checked = true;
                }

                label.appendChild(radio);


                label.appendChild(document.createTextNode(" " + optionText));
                optionsContainer.appendChild(label);
            });

            if (currentQuestion === markedQuestion) {
                markBtn.textContent = "Marked ✅";
                markBtn.disabled = true;
                questionNumberEl.style.backgroundColor = "#ffc107";
                questionNumberEl.classList.add("marked-question");
            } else {
                markBtn.textContent = "Mark for Review";
                markBtn.disabled = false;
                questionNumberEl.style.backgroundColor = "transparent";
                questionNumberEl.classList.remove("marked-question");
            }

            nextBtn.disabled = true;

            prevBtn.classList.toggle("hide", currentQuestion === 0);
            submitBtn.classList.toggle("hide", currentQuestion !== quizData.length - 1);
            nextBtn.classList.toggle("hide", currentQuestion === quizData.length - 1);

            updateProgressBar();
            startGlobalTimer();
        }
        const markBtn = document.getElementById("mark-btn");


        markBtn.addEventListener("click", () => {
            markedQuestion = currentQuestion;   
            renderMarkedFlags();              
            loadNextQuestion();            
        });

        function renderMarkedFlags() {
            const container = document.getElementById("flags-panel");
            container.innerHTML = "";

            if (markedQuestion !== null) {
                const flagBtn = document.createElement("button");
                flagBtn.textContent = `🚩 Q${markedQuestion + 1}`;
                flagBtn.style.margin = "5px";
                flagBtn.style.padding = "5px 10px";
                flagBtn.style.borderRadius = "5px";
                flagBtn.style.backgroundColor = "#ffc107";
                flagBtn.style.border = "none";
                flagBtn.style.cursor = "pointer";

                flagBtn.addEventListener("click", () => {
                    currentQuestion = markedQuestion;
                    loadQuestion();
                });

                container.appendChild(flagBtn);
            }
        }


        function handleOptionChange(event) {
            selectedAnswers[currentQuestion] = event.target.value;
            nextBtn.disabled = false;
            updateProgressBar();
        }

        function checkAnswer() {
            const selected = Array.from(document.querySelectorAll(".option:checked")).map(el => el.value);
            const correctAnswer = quizData[currentQuestion].answer;

            const isCorrect = selected.length === 1 && selected[0] === correctAnswer;

            if (isCorrect) {
                score++;
            }
        }
        function loadNextQuestion() {
            if (currentQuestion === markedQuestion) {
                markBtn.textContent = "Marked ✅";
                markBtn.disabled = true;
                questionNumberEl.style.backgroundColor = "#ffc107";
                questionNumberEl.classList.add("marked-question");
            } else {
                markBtn.textContent = "Mark for Review";
                markBtn.disabled = false;
                questionNumberEl.style.backgroundColor = "transparent";
                questionNumberEl.classList.remove("marked-question");
            }

            checkAnswer();
            currentQuestion++;
            if (currentQuestion < quizData.length) {
                loadQuestion();
            } else {
                showResult();
            }
        }

        function loadPreviousQuestion() {
            if (currentQuestion > 0) {
                currentQuestion--;
                loadQuestion();
            }
        }


        function showResult() {
            checkAnswer();
            clearInterval(globalTimer);

            if (markedQuestion !== null && !selectedAnswers[markedQuestion]) {
                currentQuestion = markedQuestion;
                alert("You must answer the marked question before submitting.");
                loadQuestion();
                return;
            }

            if (!confirm("Are you sure you want to submit the quiz?")) {
                return;
            }

            document.getElementById('quiz').innerHTML = "<h3>Calculating your result...⏳</h3>";

            setTimeout(() => {
                const percentage = (score / quizData.length) * 100;
                localStorage.setItem("finalScore", percentage + "%");
                localStorage.setItem("userScore", score);
                localStorage.setItem("totalQuestions", quizData.length);

                if (percentage >= 50) {
                    location.replace("success-result.html");
                } else {
                    location.replace("fail_result.html");
                }
            }, 3000);
        }



        nextBtn.addEventListener("click", loadNextQuestion);
        prevBtn.addEventListener("click", loadPreviousQuestion);
        submitBtn.addEventListener("click", showResult);


        fetch("../advanced.json")
            .then(response => response.json())
            .then(data => {
                quizData = data;
                loadQuestion();
            })
            .catch(error => {
                questionEl.textContent = "Failed to load questions.";
                console.error("Failed to load JSON:", error);
            });
