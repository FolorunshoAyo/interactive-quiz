(function(){
    fetch("https://opentdb.com/api.php?amount=30").then(response => {
         return response.json();
    }).then(data => {
        console.log(data)
    }).catch(error => {
        console.log(error);
    });
}())