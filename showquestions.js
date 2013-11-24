$(document).bind("pagebeforechange", function (e, data) {
        // Handle URLs that request chapter page
    if (typeof data.toPage === "string") {

        var url = $.mobile.path.parseUrl(data.toPage);
        var questions = JSON.parse(localStorage.storedquestions);

        if(url.hash.search(/^#question\?num=/) !== -1){
            //decide to load page1 or page2
            var pagenum = '1';
            if ($.mobile.activePage.attr("id") == "question1") {
                pagenum = '2';
            }
            data.toPage =  '#question'+pagenum;
            var num = Number(url.hash.replace(/.*num=/, ""));
            loadQuestion(questions[num-1],pagenum);
            data.options.dataUrl = 'question?num='+num;

        }
        if(url.hash.search(/^#browse/) !== -1){

            var markup = '<ul id="listofquestions" data-role="listview" data-filter="true">';
            for(q in questions){
                markup += '<li><h1>#Q';
                markup += questions[q].id;
                markup += '</h1><h2>';
                markup += questions[q].question;
                markup += '</h2>';
                markup += '<p>'+questions[q].choice1+'</p>';
                markup += '<p>'+questions[q].choice2+'</p>';
                markup += '<p>'+questions[q].choice3+'</p>';
                markup += '<p>'+questions[q].choice4+'</p>';
                markup += '</h2><p>';
                markup += '</li>';
            }
            markup += '</ul>';
            $("#browse").children( ":jqmData(role=content)" ).html(markup);
            $("#browse").page();
            $("#browse").children( ":jqmData(role=content)" ).find( ":jqmData(role=listview)" ).listview();

        }

        if(url.hash.search(/^#question\?restart/) !== -1){
            var list = questions;
            shuffle(list);
            sessionStorage.questions = JSON.stringify(list);
            localStorage.currentquest = 0;
            data.toPage =  '#question1';
            var num = Number(list[0].id);
            loadQuestion(questions[num-1],1);
            data.options.dataUrl = 'question?num='+num;

        }

    }

});

function goCurrentQuestion() {

    var questions = JSON.parse(sessionStorage.questions);
    if(Number(localStorage.currentquest) >= questions.length){
        $.mobile.changePage('#no-more-questions', {
            transition:'slide'
        });
    }else{
        var current = Number(questions[Number(localStorage.currentquest)].id);
        $.mobile.changePage('#question?num='+current, {
            transition:'slide'
        });
    }
}

function loadQuestion(quest,pagenum) {

    var page = $("#question"+pagenum);
    var header = page.children(":jqmData(role='header')");
    var content = page.children(":jqmData(role='content')");
    header.find("h1")[0].innerHTML = 'Q#' + quest.id;
    content.find("h3")[0].innerHTML = quest.question;

   //place shuffled choices
    var choices = content.find("a");
    var ops = [quest.choice1, quest.choice2, quest.choice3, quest.choice4]
    var ans = ops[quest.answer-1];
    shuffle(ops);
    choices[0].innerHTML = ops[0];
    choices[1].innerHTML = ops[1];
    choices[2].innerHTML = ops[2];
    choices[3].innerHTML = ops[3];

    choices[0].href = '#wrongpop'+pagenum;
    choices[1].href = '#wrongpop'+pagenum;
    choices[2].href = '#wrongpop'+pagenum;
    choices[3].href = '#wrongpop'+pagenum;

    var correctchoice;
    for(it in choices){
        if(choices[it].innerHTML == ans){
            correctchoice = choices[it];
            break;
        }
    }

    page.page();
    content.find(":jqmData(role='listview')").listview();

    $(correctchoice).bind("click", function () {
        $(correctchoice).unbind("click");
        localStorage.currentquest = Number(localStorage.currentquest)+1;
        choices[0].href = '#';
        choices[1].href = '#';
        choices[2].href = '#';
        choices[3].href = '#';

        $(correctchoice).attr('href', '#correctpop'+pagenum);

       setTimeout(function () {
           goCurrentQuestion();
        }, 500);


    });
}

$( "#wrongpop1" ).bind({
    popupafteropen: function(event, ui) {
        setTimeout(function () { $( "#wrongpop1").popup( "close" )}, 100);
    }});

$( "#wrongpop2" ).bind({
    popupafteropen: function(event, ui) {
        setTimeout(function () { $( "#wrongpop2").popup( "close" )}, 100);
    }});