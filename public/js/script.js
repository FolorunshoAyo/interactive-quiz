(function () {
    const quizForm = document.getElementById("quiz-form");
    const button = document.querySelector(".begin-btn");
    const closeAlertBtn = document.querySelector(".alert-close");
    let alertInView;

    closeAlertBtn.removeEventListener("click", closeAlert);
    closeAlertBtn.addEventListener("click", closeAlert);

    if(closeAlertBtn.parentElement.classList.contains("alert-warning")){
        alertInView = document.querySelector(".alert-warning");
    }else{
        alertInView = document.querySelector(".alert-danger");
    }

    if(navigator.onLine){
        button.disabled = false;

        if(alertInView.classList.contains("alert-warning")){
            alertInView.classList.add("close");
        }

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
    }

    function closeAlert (e){
        e.target.parentElement.classList.add("close");
    }
}());


// fetch("https://opentdb.com/api.php?amount=30").then(response => {
//     return response.json();
// }).then(data => {
//     console.log(data);
// }).catch(error => {
//     console.log(error);
// });