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
var options;
var enteredanswer = []; // Only used for non-type 1 questions
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
    // Distribute the number of questions for each section
    var numsec = (topics.match(/1/g) || []).length;
    var remainderqns = numqn%numsec;
    for (var i=0; i < numsec; i++){
        qndistribution.push(Math.floor(numqn/numsec))
        if (remainderqns>0){
            qndistribution[qndistribution.length-1]++;
            remainderqns--;
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
            j++;
        }
    }
    document.getElementById('progress').max=numqn;
    document.getElementById('progress').value=currentqn;
    document.getElementById('correctqns').innerHTML = correctqns+"/"+numqn+" Questions Correct";
    document.getElementById('score').value=correctqns;
    nextQn()
}

function nextQn(){
    currentqn++
    document.querySelectorAll('.clone').forEach(e => e.remove());
    document.getElementById('additionalnotes').innerHTML="";
    //document.getElementById('socialcredit').style.display = 'none';

    // Disable next question button
    document.getElementById('nextqn').disabled=true;
    document.getElementById('nextqn').innerHTML='Waiting for answer...';
    document.getElementById('qnnum').innerHTML='Question '+(currentqn+1)+" of "+numqn;
    var question = qnlist[currentqn]['question'];
    for (var i=0; i<shortforms.length/2; i++){
        question = question.replace("@`"+shortforms[i*2],shortforms[i*2+1])
    }
    document.querySelector("#question").innerHTML = question;
    options = qnlist[currentqn]['options'];
    // Randomise options
    for (var i = options.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = options[i];
        options[i] = options[j];
        options[j] = temp;
    }

    // Different types of questions
    /*
    1 - Single Choice Question (MCQ)
    2 - Multiple Choice Question (MCQ)
    */
    var type = qnlist[currentqn]['type']
    if (type===1 || type===2) {
        // Single choice template
        var answerbuttontemplate
        (type===1) ? answerbuttontemplate = document.querySelector('#answerbuttontemplate') : answerbuttontemplate = document.querySelector('#multianswerbuttontemplate');
        var answerlist = document.getElementById('buttonarea');
        var count = 0;
        // Create a button for each option, replace the correct ans brackets [] with empty string
        options.forEach((element)=>{
            element = element.replace('[]','')
            var clone = answerbuttontemplate.content.cloneNode(true);
            clone.querySelector("button").innerText=element;
            clone.querySelector("button").id=count;
            clone.querySelector("div").classList.add('clone');
            answerlist.appendChild(clone)
            count++;
        })
        if (type===2) {
            document.getElementById('nextqn').onclick = function() {multiCheckAnswer()};
            document.getElementById('additionalnotes').innerHTML="You may select 1 or more answers.";
        }
    }
}

// For single select
function checkAnswer(id){
    if (document.getElementById('nextqn').disabled) {
        // Check if answer is correct
        if (options[id].startsWith('[]')) {
            document.getElementById(id).classList.remove('btn-dark');
            document.getElementById(id).classList.add('btn-success');
            correctqns++;
        } else {
            document.getElementById(id).classList.remove('btn-dark');
            document.getElementById(id).classList.add('btn-danger');
            /*document.getElementById('socialcredit').style.display = 'block';
            setTimeout(()=>{document.getElementById('socialcredit').style.display = 'none';},5500)
            audio.play();*/
        }
        finishQn();
    }
}

function finishQn(){
    document.getElementById('correctqns').innerHTML = correctqns+"/"+numqn+" Questions Correct";
    document.getElementById('score').value=correctqns;
    // Increase progress bar
    document.getElementById('progress').value=currentqn+1;
    // Check if last question
    if (currentqn>=numqn-1) {
        document.getElementById('nextqn').style.display = 'none';
        document.getElementById('submit').style.display = 'block';
    } else {
        document.getElementById('nextqn').onclick = function() {nextQn()};
        document.getElementById('nextqn').innerHTML='Continue to next question';
        document.getElementById('nextqn').disabled=false;
    }
    // Clear selected options
    enteredanswer = [];
}

// For multi select
function selectAnswer(id){
    if (document.getElementById('nextqn').disabled || document.getElementById('nextqn').innerText==="Submit Answers") {
        if (enteredanswer.includes(id)){
            enteredanswer.splice(enteredanswer.indexOf(id),1)
            document.getElementById(id).classList.remove('btn-info');
            document.getElementById(id).classList.add('btn-dark');
        } else {
            enteredanswer.push(id)
            document.getElementById(id).classList.remove('btn-dark');
            document.getElementById(id).classList.add('btn-info');
        }
        if (enteredanswer.length>0){
            document.getElementById('nextqn').innerHTML='Submit Answers';
            document.getElementById('nextqn').disabled=false;
        } else {
            document.getElementById('nextqn').innerHTML='Waiting for answer...';
            document.getElementById('nextqn').disabled=true;
        }
    }
}

function multiCheckAnswer(){
    var correctanswers=[0,0,false];
    for (var i=0; i<options.length; i++) {
        if (enteredanswer.includes(i.toString())){
            if (options[i].startsWith('[]')) {
                correctanswers[0]++;
                correctanswers[1]++;
                document.getElementById(i).classList.remove('btn-info');
                document.getElementById(i).classList.add('btn-success');
            } else {
                correctanswers[2]=true;
                document.getElementById(i).classList.remove("btn-info");
                document.getElementById(i).classList.add('btn-danger');
            }  
        } else if (options[i].startsWith('[]')) {
            correctanswers[1]++;
        }
    }
    if (correctanswers[0]===correctanswers[1] && !correctanswers[2]){
        correctqns++;
    }
    finishQn();
    if (!(correctanswers[0]===correctanswers[1] && correctanswers[2])){
        document.getElementById('nextqn').innerHTML+=' ('+correctanswers[0]+'/'+correctanswers[1]+' answers correct)'; 
    }
}