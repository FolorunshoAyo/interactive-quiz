const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
};

function chunk(array, size) {
    let result = []
    for (let i = 0; i < array.length; i += size) {
        if (array[i] === 'True' || array[i] === 'False') {
            result.push([array[i]]);
        }
        else if (array[i + 1] === 'True' || array[i + 1] === 'False') {
            result.push([array[i + 1]]);
        } else {
            let chunk = array.slice(i, i + size)
            result.push(chunk)
        }
    }
    return result
}

function htmlDecode(str) {
    let doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent;
}


class QuizGame {
    constructor() {
        this.category = document.querySelector(".category");
        this.difficulty = document.querySelector(".difficulty");
        this.type = document.querySelector(".type");
        this.root = document.documentElement.style;
        this.userData = userQuestions;
        this.triviaContainer = document.querySelector(".question-answer-container");
        this.refinedUserData;
        this.currentQuestion = 0;
        this.answeredCorrectly = 0;
        this.totalQuestions;
        this.failed = 0;
        this.score = 0;
    }

    renderQuestions() {
        const userDatas = [];
        this.userData.forEach((data, index) => {
            data.replace(/,\s/, "");
            if (index === 3) {
                userDatas.push(chunk(data.split(/,(?=\S)/), 3));
            } else if (index === 1 || index === 4) {
                userDatas.push(data.split(/,(?=\S)/));
            } else {
                userDatas.push(data.split(","));
            }
        });

        this.refinedUserData = {
            categories: userDatas[0],
            correctAnswers: userDatas[1],
            difficulties: userDatas[2],
            incorrectAnswers: userDatas[3],
            questions: userDatas[4],
            types: userDatas[5]
        }

        this.totalQuestions = this.refinedUserData.questions.length;
    }

    moveToNext(index) {
        const initialQuestion = document.querySelector(`.question-block-${index - 1}`);

        initialQuestion.style.display = "none";
        if (index + 1 > this.totalQuestions) {
            this.endGame();
        } else {
            this.displayQuestion(index);
        }
    }

    displayQuestion(index) {
        this.renderQuestions();

        const userData = this.refinedUserData;
        const questionInfo = {
            currCategory: userData.categories[index],
            correctAnswer: userData.correctAnswers[index],
            currDifficulty: userData.difficulties[index],
            incorrectAnswers: userData.incorrectAnswers[index],
            question: userData.questions[index],
            type: userData.types[index]
        }


        const providedOptions = [questionInfo.correctAnswer, ...questionInfo.incorrectAnswers];
        shuffleArray(providedOptions);

        if (providedOptions.some(option => option === "True")) {
            this.category.textContent = htmlDecode(questionInfo.currCategory);
            this.difficulty.textContent = questionInfo.currDifficulty;
            this.type.textContent = questionInfo.type;
            this.triviaContainer.insertAdjacentHTML(`beforeend`,
                `
                <div class="question-block question-block-${index}">
                    <h2>${htmlDecode(questionInfo.question)}</h2>
                    <div class="options">
                        <div class="option option-1" data-answer="true">
                            <div class="option-alphabet">
                                A
                            </div>
                            <div class="option-content">
                                <button class="option-btn">${htmlDecode(providedOptions[0])}</button>
                            </div>
                        </div>
                        <div class="option option-2" data-answer="false">
                            <div class="option-alphabet">
                                B
                            </div>
                            <div class="option-content">
                                <button class="option-btn">${htmlDecode(providedOptions[1])}</button>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            this.addEventListeners(document.querySelectorAll(`.question-block-${index} .option-content`), questionInfo.correctAnswer, questionInfo.type);
        } else {
            this.category.textContent = questionInfo.currCategory;
            this.difficulty.textContent = questionInfo.currDifficulty;
            this.type.textContent = questionInfo.type;
            this.triviaContainer.insertAdjacentHTML(`beforeend`,
                `
                <div class="question-block question-block-${index}">
                    <h2>${htmlDecode(questionInfo.question)}</h2>
                    <div class="options">
                        <div class="option option-1" data-answer="true">
                            <div class="option-alphabet">
                                A
                            </div>
                            <div class="option-content">
                                <button class="option-btn">${htmlDecode(providedOptions[0])}</button>
                            </div>
                        </div>
                        <div class="option option-2" data-answer="false">
                            <div class="option-alphabet">
                                B
                            </div>
                            <div class="option-content">
                                <button class="option-btn">${htmlDecode(providedOptions[1])}</button>
                            </div>
                        </div>
                        <div class="option option-3" data-answer="false">
                            <div class="option-alphabet">
                                C
                            </div>
                            <div class="option-content">
                                <button class="option-btn">${htmlDecode(providedOptions[2])}</button>
                            </div>
                        </div>
                        <div class="option option-4" data-answer="false">
                            <div class="option-alphabet">
                                D
                            </div>
                            <div class="option-content">
                                <button class="option-btn">${htmlDecode(providedOptions[3])}</button>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            this.addEventListeners(document.querySelectorAll(`.question-block-${index} .option-btn`), questionInfo.correctAnswer, questionInfo.type);
        }
    }

    checkOption(e, options, correctAnswer, type) {
        options.forEach(option => {
            option.disabled = true;
        });
        setTimeout(() => {
            if (e.target.innerText === correctAnswer) {
                e.target.classList.add("correct");
                if (type === "multiple") {
                    this.updateScore(30)
                    this.answeredCorrectly++;
                    this.increaseProgress();
                } else {
                    this.updateScore(10);
                    this.answeredCorrectly++;
                    this.increaseProgress();
                }
            } else {
                e.target.classList.add("wrong");
                this.failed++;
                this.showCorrectAns(options, correctAnswer);
                this.increaseProgress();
            }

            setTimeout(() => {
                this.currentQuestion++;
                this.moveToNext(this.currentQuestion);
            }, 2000)
        }, 1000);
    }

    addEventListeners(options, correctAnswer, type) {
        options.forEach(option => {
            option.addEventListener("click", (e) => { this.checkOption(e, options, correctAnswer, type) });
        });
    }

    showCorrectAns(options, correctAnswer) {
        options.forEach(option => {
            if (option.innerText === correctAnswer) {
                setTimeout(() => {
                    option.classList.add("correct");
                }, 1000);
            }
        });
    }

    updateScore(amount) {
        this.score += amount;
        document.querySelector(".score").textContent = this.score.toString();
    }

    increaseProgress() {
        this.root.setProperty("--progress-fill", `${((this.answeredCorrectly + this.failed) / this.totalQuestions) * 100}%`)
    }

    endGame() {
        document.querySelector(".final-score").textContent = this.score.toString();
        document.querySelector(".total-questions span").textContent = this.totalQuestions.toString();
        document.querySelector(".marks .correct").textContent = this.answeredCorrectly.toString();
        document.querySelector(".marks .total").textContent = this.totalQuestions.toString();

        document.querySelector(".modal-container").classList.remove("hide");
    }
}


const game = new QuizGame();

game.displayQuestion(0);
