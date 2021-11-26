(function () {
    const quizForm = document.getElementById("quiz-form");
    const button = document.querySelector(".begin-btn");
    const alertBox = document.querySelector(".alert");

    if(navigator.onLine){
        button.disabled = false;
        alertBox.classList.add("close");
        quizForm.addEventListener("submit", (e) => {
            const inputEl = document.getElementById("amount");
    
            if (inputEl.value == "") {
                e.preventDefault();
                inputEl.classList.add("error");
            } else {
                inputEl.classList.remove("error");
            }
        });
    }else{
        button.disabled = true;
        alertBox.classList.remove("close");
    }
}());


// fetch("https://opentdb.com/api.php?amount=30").then(response => {
//     return response.json();
// }).then(data => {
//     console.log(data);
// }).catch(error => {
//     console.log(error);
// });