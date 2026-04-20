// Select Elements
let countSpan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area")
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".result");
let countdownElement = document.querySelector(".countdown");
let backButton = document.querySelector(".back-button");

let currentIndex = 0;
let rightAnswer = 0;
let countDowninterval;
let reviewResults = [];


function getQuestions() {


    myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
    let questionObject = JSON.parse(this.responseText);
    let questionsCount = questionObject.length;

    // تصفير كل شيء لضمان بداية نظيفة من Q1
    currentIndex = 0;
    rightAnswer = 0;
    reviewResults = [];
    bulletsSpanContainer.innerHTML = ""; // مسح الدوائر القديمة لو موجودة

    createBullets(questionsCount);
    addQuestionData(questionObject[currentIndex], questionsCount);
    countdown(10, questionsCount);

    // برمجة الزرار
    submitButton.onclick = () => {
        if (currentIndex < questionsCount) {
            let currentQ = questionObject[currentIndex];
            let answers = document.getElementsByName("question");
            let chosen = "No Answer Selected";

            answers.forEach(radio => {
                if (radio.checked) chosen = radio.dataset.answer;
            });

            // تسجيل البيانات دايماً قبل الانتقال للسؤال التالي
            reviewResults[currentIndex] = {
                title: currentQ.title,
                right: currentQ.right_answer,
                chosen: chosen,
                isCorrect: chosen === currentQ.right_answer
            };

            if (chosen === currentQ.right_answer) {
                rightAnswer++;
            }

            clearInterval(countDowninterval);
            currentIndex++;
            
            quizArea.innerHTML = "";
            answersArea.innerHTML = "";

            if (currentIndex < questionsCount) {
                addQuestionData(questionObject[currentIndex], questionsCount);
                handleBullets();
                countdown(10, questionsCount);
            } else {
                showResults(questionsCount);
            }
        }
    };


        }
    };

   const params = new URLSearchParams(window.location.search);
const type = params.get("type");

let file = "";

if (type === "html") {
  file = "html_question.json";
} 
else if (type === "css") {
  file = "css_question.json";
} 
else if (type === "js") {
  file = "js_question.json";
} 
else if (type === "react") {
  file = "react_question.json";
} 
else {
  file = "html_question.json"; 
}

myRequest.open("GET", file, true);
    
    myRequest.send();
}

   

getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;
    //create spans 

    for (let i = 0; i < num; i++) {
        //create bullet
        let theBullet = document.createElement("span");


        // if it first span
        if (i === 0) {
            theBullet.className = "onclick";
        }

        // append bullets to main bullet container

        bulletsSpanContainer.appendChild(theBullet);


    }
}
function addQuestionData(obj, count) {
    if (currentIndex < count) {
        // Create H2 Question Title
        let questionTitle = document.createElement("h2");

        // Create Question Text
        let questionText = document.createTextNode(obj['title']);

        // Append text to H2
        questionTitle.appendChild(questionText);

        // Append H2 to quiz area

        quizArea.appendChild(questionTitle);

        // Create The Answers
        for (let i = 1; i <= 4; i++) {

            // Create Main Answer Div
            let mainDiv = document.createElement("div");

            // Add Class To Main Div
            mainDiv.className = "answer";

            // Create Radio Input
            let radioInput = document.createElement("input");

            // Add Type + Name + Id + Data-Attribute
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];

            //make first option selected
            if (i === 1) {
                radioInput.checked = true;
            }

            //create label
            let theLabel = document.createElement("label");

            // add for attribute

            theLabel.htmlFor = `answer_${i}`;

            //create text label
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);

            // add text to label
            theLabel.appendChild(theLabelText);

            // add input + label to main div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            // append all Divs to answers area
            answersArea.appendChild(mainDiv);


        }
    }
}
function checkAnswer(rAnswer, count, questionTitle) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            // هنا بنجيب النص اللي متخزن في الـ dataset
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    // التسجيل في مصفوفة المراجعة
    reviewResults.push({
        title: questionTitle, // النص اللي كان بيطلع undefined
        right: rAnswer,
        chosen: theChoosenAnswer,
        isCorrect: rAnswer === theChoosenAnswer
    });

    if (rAnswer === theChoosenAnswer) {
        rightAnswer++;
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "onclick";
        }
    });
}

function showResults(count) {
    if (currentIndex === count) {
        // حذف عناصر الاختبار لإظهار النتيجة
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        backButton.style.display = "block";

        let resultText = "";
        if (rightAnswer > count / 2 && rightAnswer < count) {
            resultText = `<span class="good">Good</span>, ${rightAnswer} From ${count}`;
        } else if (rightAnswer === count) {
            resultText = `<span class="perfect">Perfect</span>, All Answers Correct!`;
        } else {
            resultText = `<span class="bad">Bad</span>, ${rightAnswer} From ${count}`;
        }

        // إضافة النتيجة وزر المراجعة بتصميم منسق
      resultsContainer.innerHTML = `
    <div class="result-message">${resultText}</div>
    <button id="review-btn" class="review-btn">Review Your Answers</button>
    <div id="review-details" class="review-details"></div>
`;

        // منطق زر المراجعة
        document.getElementById("review-btn").onclick = function () {
            let reviewDetails = document.getElementById("review-details");
            reviewDetails.style.display = "block";
            this.style.display = "none"; // إخفاء الزر بعد الضغط عليه

            // مسح أي محتوى قديم والتأكد من عرض كل إجابة في سطر
            reviewDetails.innerHTML = '<h3 style="margin-bottom: 20px; text-align: center; color: #333;">Detailed Review</h3>';

            reviewResults.forEach((res, index) => {
                let questionDiv = document.createElement("div");
                questionDiv.style.marginBottom = "20px";
                questionDiv.style.padding = "15px";
                questionDiv.style.backgroundColor = "white";
                questionDiv.style.borderRadius = "5px";
                questionDiv.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
                questionDiv.style.borderLeft = res.isCorrect ? "5px solid green" : "5px solid red";

                questionDiv.innerHTML = `
                    <div style="font-weight: bold; font-size: 18px; margin-bottom: 8px;">Q${index + 1}: ${res.title}</div>
                    <div style="margin-bottom: 5px;">
                        <span style="font-weight: 600;">Your Answer:</span> 
                        <span style="color: ${res.isCorrect ? 'green' : 'red'}; font-weight: bold;">${res.chosen || "No Answer Selected"}</span>
                    </div>
                    ${!res.isCorrect ? `
                    <div>
                        <span style="font-weight: 600; color: green;">Right Answer:</span> 
                        <span style="color: green; font-weight: bold;">${res.right}</span>
                    </div>` : ""}
                `;
                reviewDetails.appendChild(questionDiv);
            });
        };
    }
}

function countdown(duration, count) {
    if (currentIndex < count) {
        // نضمن إن مفيش تايمر قديم شغال نهائياً
        clearInterval(countDowninterval); 
        
        countDowninterval = setInterval(function () {
            let minutes = Math.floor(duration / 60);
            let seconds = duration % 60;

            countdownElement.innerHTML = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (--duration < 0) {
                clearInterval(countDowninterval); // وقف فوراً
                submitButton.click(); // ابعت الإجابة
            }
        }, 1000);
    }
}
backButton.onclick = function () {
    window.location.href = "index.html";
};