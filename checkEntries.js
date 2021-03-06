function getUrl(userConfig){
    let url = "";
    let amount = userConfig.amount;

    if ((userConfig.category === "") && (userConfig.difficulty) === "" && (userConfig.type === "")){
        url = `https://opentdb.com/api.php?amount=${amount}`;
    }
    else if((userConfig.category !== "") && (userConfig.difficulty !== "") && (userConfig.type !== "")){
        url = `https://opentdb.com/api.php?amount=${amount}&category=${userConfig.category}&difficulty=${userConfig.difficulty}&type=${userConfig.type}`;
    }
    else if((userConfig.category !== "") && (userConfig.difficulty !== "")){
        url = `https://opentdb.com/api.php?amount=${amount}&category=${userConfig.category}&difficulty=${userConfig.difficulty}`;
    }
    else if((userConfig.category !== "") && (userConfig.type !== "")){
        url = `https://opentdb.com/api.php?amount=${amount}&category=${userConfig.category}&difficulty=${userConfig.difficulty}`;
    }
    else if(userConfig.category !== ""){
        url = `https://opentdb.com/api.php?amount=${amount}&category=${userConfig.category}`;
    }
    else if(userConfig.difficulty !== ""){
        url = `https://opentdb.com/api.php?amount=${amount}&difficulty=${userConfig.difficulty}`;
    }
    else if(userConfig.type !== ""){
        url = `https://opentdb.com/api.php?amount=${amount}&type=${userConfig.type}`;
    }

    console.log(url);

    return url;
}


function reFormat(response){
    const categories = [];
    const correct_answers = [];
    const difficulies = [];
    const incorrect_answers = [];
    const questions = [];
    const types = [];

    response.results.forEach(result => {
        categories.push(result.category);
        correct_answers.push(result.correct_answer);
        difficulies.push(result.difficulty);
        incorrect_answers.push(result.incorrect_answers);
        questions.push(result.question);
        types.push(result.type);
    });

    return [categories, correct_answers, difficulies, incorrect_answers, questions, types];
}


module.exports = {getUrl, reFormat};

