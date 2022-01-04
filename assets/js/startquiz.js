var quizdata={};
var getparams = new URLSearchParams(location.search.substring(1));
var uid = getparams.get("uid");
var topics = getparams.get("topics");
var random = getparams.get("random");
var numqn = getparams.get("numqn");
var qndistribution = []
var currentqn = -1;
var qnlist = [];
var answers;

$(document).ready(function() 
{
    $.ajax({
        type: "GET",
        url: "/solutional/data/moduledata/"+uid+".json",
        success: function (response) {
            process(response);
        },
        error: function (obj, textStatus, errorThrown) {
            console.log("Error "+textStatus+": "+errorThrown);
        }
    });
});

function process(data){
    console.log(data)
    // Distribute the number of questions for each section
    var numsec = (topics.match(/1/g) || []).length;
    var remainderqns = numqn%numsec;
    for (var i=0; i < numsec; i++){
        qndistribution.push(Math.floor(numqn/numsec))
        if (remainderqns>0){
            qndistribution[qndistribution.length-1]+=1
            remainderqns-=1
        }
    }
    console.log(qndistribution)
    var j=0;
    // Pick questions
    for (var i=0; i < topics.length; i++){
        if (topics[i]==="1"){
            for (var k=0; k < qndistribution[j]; k++){
                var qn = data[i]['questions'][Math.floor(Math.random()*data[i]['questions'].length)]
                while (qnlist.length>=1 && qnlist[qnlist.length-1]['question']===qn['question'] && data[i]['questions'].length>1){
                    qn = data[i]['questions'][Math.floor(Math.random()*data[i]['questions'].length)]
                }
                qnlist.push(qn)
            }
            j+=1;
        }
    }
    nextQn()
}

function nextQn(){
    currentqn+=1
    document.querySelectorAll('.clone').forEach(e => e.remove());
    document.getElementById('nextqn').disabled=true;
    document.getElementById('nextqn').innerHTML='Waiting for answer...';
    document.getElementById('qnnum').innerHTML='Question '+(currentqn+1)+" of "+numqn;
    document.querySelector("#question").innerHTML = qnlist[currentqn]['question'];
    answers = qnlist[currentqn]['answers'];
    // Randomise Answers
    for (var i = answers.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = answers[i];
        answers[i] = answers[j];
        answers[j] = temp;
    }
    var answerbuttontemplate = document.querySelector('#answerbuttontemplate');
    var answerlist = document.querySelector('.container .row');
    var count = 0;
    answers.forEach((element)=>{
        element = element.replace('[]','')
        var clone = answerbuttontemplate.content.cloneNode(true);
        clone.querySelector("button").innerText=element;
        clone.querySelector("button").id=count;
        clone.querySelector("div").classList.add('clone');
        answerlist.appendChild(clone)
        count+=1;
    })
}

function checkAnswer(id){
    if (answers[id].startsWith('[]')){
        document.getElementById(id).classList.remove('btn-dark')
        document.getElementById(id).classList.add('btn-success')
    } else {
        document.getElementById(id).classList.remove('btn-dark')
        document.getElementById(id).classList.add('btn-danger')
    }
    document.getElementById('nextqn').innerHTML='Continue to next question';
    document.getElementById('nextqn').disabled=false;
}