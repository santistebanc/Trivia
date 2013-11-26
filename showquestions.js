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
            for(q=0;q<questions.length;q++){
                markup += '<li><h1>#Q';
                markup += questions[q].id;
                markup += '</h1><div><strong>';
                markup += questions[q].question;
                markup += '</strong></div><br>';
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

        if(url.hash.search(/^#check/) !== -1){
            $.mobile.loading( 'show', {
                text: 'checking...',
                textVisible: true
            });
            $.getJSON("http://cors.io/spreadsheets.google.com/feeds/list/0Ahrn8W_r85_odDJ1a0hnLUZOa05vSVNzemtPOXN1MXc/od6/public/values?alt=json", function (data) {
                var data = loadquestdata(data);
                if(localStorage.storedquestions != JSON.stringify(data)){
                    var loc = JSON.parse(localStorage.storedquestions);
                    var num = data.length-loc.length;
                    var mes = '';
                    if(num == 0){
                        mes = 'Updated questions.';
                    }else{
                        mes = 'Added '+ num + ' new questions.';
                    }
                    localStorage.storedquestions = JSON.stringify(data);
                    sessionStorage.questions = JSON.stringify(data);
                    $("#updated h3").html(mes);
                    $("#updated").popup('open');
                 }else{
                    $("#noupdates").popup('open');
                }
                $.mobile.loading( "hide" );
            }).fail(function() {
                    console.log( "error" );
                })
                .always(function() {
                        $.mobile.loading( "hide" );
                });

        }

        if(url.hash.search(/^#question\?restart/) !== -1){
            var list = questions;
            //shuffle(list);
            sessionStorage.questions = JSON.stringify(list);
            localStorage.currentquest = 0;
            localStorage.globalscore = 0;
            localStorage.correctnum = 0;
            localStorage.wrongnum = 0;
            data.toPage =  '#question1';
            var num = Number(list[0].id);
            loadQuestion(questions[num-1],1);
            data.options.dataUrl = 'question?num='+num;

        }

    }

});

$( '#check' ).bind("pageshow", function (event) {
     alert('here');
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

    $( "#corr1").html(localStorage.correctnum);
    $( "#wro1").html(localStorage.wrongnum);
    $( "#corr2").html(localStorage.correctnum);
    $( "#wro2").html(localStorage.wrongnum);

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
            localStorage.globalscore = Number(localStorage.globalscore)+1;
        localStorage.correctnum = Number(localStorage.correctnum)+1;
        $( "#corr1").html(localStorage.correctnum);
        $( "#corr2").html(localStorage.correctnum);
        localStorage.currentquest = Number(localStorage.currentquest)+1;
        choices[0].href = '#';
        choices[1].href = '#';
        choices[2].href = '#';
        choices[3].href = '#';

        $(correctchoice).attr('href', '#correctpop'+pagenum);

       setTimeout(function () {
           $(correctchoice).attr('href', '#');
           goCurrentQuestion();
        }, 500);


    });
}

$( "#wrongpop1" ).bind({
    popupafteropen: function(event, ui) {
        localStorage.globalscore = Number(localStorage.globalscore)-1;
        localStorage.wrongnum = Number(localStorage.wrongnum)+1;
        $( "#wro1").html(localStorage.wrongnum);
        setTimeout(function () { $( "#wrongpop1").popup( "close" )}, 100);
    }});

$( "#wrongpop2" ).bind({
    popupafteropen: function(event, ui) {
        localStorage.globalscore = Number(localStorage.globalscore)-1;
        localStorage.wrongnum = Number(localStorage.wrongnum)+1;
        $( "#wro2").html(localStorage.wrongnum);
        setTimeout(function () { $( "#wrongpop2").popup( "close" )}, 100);
    }});