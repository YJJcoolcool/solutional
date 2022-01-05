var quizdata={};
var getparams = new URLSearchParams(location.search.substring(1));
var uid = getparams.get("uid");
var topics = getparams.get("topics");
var random = getparams.get("random");
var numqn = getparams.get("numqn");
var qndistribution = []
var currentqn = -1;
var correctqns = 0;
var qnlist = [];
var answers;
var shortforms = ["wotf","Which of the following"]
//var audio = new Audio('/solutional/assets/danger.mp3');

$(document).ready(function() 
{
    document.getElementById('numqn').value=numqn;
    document.getElementById('uid').value=uid;
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
    document.getElementById('progress').max=numqn;
    document.getElementById('progress').value=currentqn;
    document.getElementById('correctqns').innerHTML = correctqns+"/"+numqn+" Questions Correct";
    document.getElementById('score').value=correctqns;
    nextQn()
}

function nextQn(){
    currentqn+=1
    document.querySelectorAll('.clone').forEach(e => e.remove());
    //document.getElementById('socialcredit').style.display = 'none';
    document.getElementById('nextqn').disabled=true;
    document.getElementById('nextqn').innerHTML='Waiting for answer...';
    document.getElementById('qnnum').innerHTML='Question '+(currentqn+1)+" of "+numqn;
    var question = qnlist[currentqn]['question'];
    for (var i=0; i<shortforms.length/2; i++){
        question = question.replace("@`"+shortforms[i*2],shortforms[i*2+1])
    }
    document.querySelector("#question").innerHTML = question;
    answers = qnlist[currentqn]['answers'];
    // Randomise Answers
    for (var i = answers.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = answers[i];
        answers[i] = answers[j];
        answers[j] = temp;
    }
    var answerbuttontemplate = document.querySelector('#answerbuttontemplate');
    var answerlist = document.getElementById('buttonarea');
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
    if (document.getElementById('nextqn').disabled){
        if (answers[id].startsWith('[]')){
            document.getElementById(id).classList.remove('btn-dark')
            document.getElementById(id).classList.add('btn-success')
            correctqns+=1
            document.getElementById('correctqns').innerHTML = correctqns+"/"+numqn+" Questions Correct";
            document.getElementById('score').value=correctqns;
        } else {
            document.getElementById(id).classList.remove('btn-dark')
            document.getElementById(id).classList.add('btn-danger')
            /*document.getElementById('socialcredit').style.display = 'block';
            setTimeout(()=>{document.getElementById('socialcredit').style.display = 'none';},5500)
            audio.play();*/
        }
        document.getElementById('progress').value=currentqn+1;
        if (currentqn>=numqn-1) {
            document.getElementById('nextqn').style.display = 'none';
            document.getElementById('submit').style.display = 'block';
        } else {
            document.getElementById('nextqn').innerHTML='Continue to next question';
        }
        document.getElementById('nextqn').disabled=false;
    }
}