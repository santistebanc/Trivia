$(document).bind("mobileinit", function () {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.defaultPageTransition = 'slide';
    $.mobile.phonegapNavigationEnabled = true;
    if(localStorage.storedquestions && localStorage.currentquest && localStorage.globalscore && localStorage.correctnum && localStorage.wrongnum){
        var data = JSON.parse(localStorage.storedquestions);
        //shuffle(data);
        sessionStorage.questions = JSON.stringify(data);
    }else{
        $('#info').innerHTML = 'Loading Questions';
        $('#play').addClass("ui-disabled");
    $.getJSON("http://cors.io/spreadsheets.google.com/feeds/list/0Ahrn8W_r85_odDJ1a0hnLUZOa05vSVNzemtPOXN1MXc/od6/public/values?alt=json", function (data) {
        var data = loadquestdata(data);
        localStorage.storedquestions = JSON.stringify(data);
        shuffle(data);
        sessionStorage.questions = JSON.stringify(data);
        localStorage.currentquest = 0;
        localStorage.globalscore = 0;
        localStorage.correctnum = 0;
        localStorage.wrongnum = 0;
        $('#info').innerHTML = '';
        $('#play').removeClass("ui-disabled");
    });

    }
})

function loadquestdata(data){
    var questdata = [];
    var tam = data.feed.entry.length;
    for(i=0;i<tam;i++){
        questdata[i]=new Object();
        questdata[i].id = data.feed.entry[i]['gsx$id']['$t'];
        questdata[i].question = data.feed.entry[i]['gsx$question']['$t'];
        questdata[i].choice1 = data.feed.entry[i]['gsx$choice1']['$t'];
        questdata[i].choice2 = data.feed.entry[i]['gsx$choice2']['$t'];
        questdata[i].choice3 = data.feed.entry[i]['gsx$choice3']['$t'];
        questdata[i].choice4 = data.feed.entry[i]['gsx$choice4']['$t'];
        questdata[i].answer = data.feed.entry[i]['gsx$answer']['$t'];
        questdata[i].difficulty = data.feed.entry[i]['gsx$difficulty']['$t'];
        questdata[i].category = data.feed.entry[i]['gsx$category']['$t'];
        questdata[i].date = data.feed.entry[i]['gsx$date']['$t'];
        questdata[i].source = data.feed.entry[i]['gsx$source']['$t'];

        questdata[i].score = 0;
    }
    return questdata;
}

function shuffle(array) {
    var currentIndex = array.length
        , temporaryValue
        , randomIndex
        ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function delstorage() {
    localStorage.removeItem('storedquestions');
}