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
var safeexit = false;
//var audio = new Audio('/solutional/assets/danger.mp3');

// Prompt user before exit/reload
window.onbeforeunload = function (e) {
    if (!safeexit) {
        alert('E')
        e = e || window.event;

        // For IE and Firefox prior to version 4
        if (e) {
            e.returnValue = '1';
        }

        // For Safari
        return '1';
    }
};

// Fetch quiz data
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
            var currenttopicqns = [];
            for (var k=0; k < qndistribution[j]; k++){
                var qn = data[i]['questions'][Math.floor(Math.random()*data[i]['questions'].length)];
                // Prevent repeated questions
                while (qnlist.length>=1 && (currenttopicqns.includes(qn['question']) && currenttopicqns.length<data[i]['questions'].length) && data[i]['questions'].length>1){
                    qn = data[i]['questions'][Math.floor(Math.random()*data[i]['questions'].length)];
                }
                console.log(currenttopicqns.length)
                console.log(data[i]['questions'].length)
                qnlist.push(qn);
                currenttopicqns.push(qn['question']);
            }
            console.log(currenttopicqns)
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

    // Image
    var imagediv = document.getElementById('imagediv');
    var imgsrc = qnlist[currentqn]['imgsrc'];
    if (imgsrc) {
        var imagetemplate = document.querySelector('#imagetemplate');
        var clone = imagetemplate.content.cloneNode(true);
        if (imgsrc.startsWith('http://') || imgsrc.startsWith('https://')){
            clone.querySelector("img").src=imgsrc;
        } else {
            clone.querySelector("img").src="/solutional/assets/images/modules/"+uid+"/"+imgsrc;
        }
        clone.getElementById("imgdiv").classList.add('clone');
        imagediv.appendChild(clone)
    }

    // Different types of questions
    /*
    1 - Single Choice Question (MCQ)
    2 - Multiple Choice Question (MCQ)
    */
    const type = qnlist[currentqn]['type']
    const answerlist = document.getElementById('buttonarea');
    if (type===1 || type===2) {
        // Randomise options
        for (var i = options.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = options[i];
            options[i] = options[j];
            options[j] = temp;
        }
        // Single choice template
        var answerbuttontemplate
        (type===1) ? answerbuttontemplate = document.getElementById('answerbuttontemplate') : answerbuttontemplate = document.getElementById('multianswerbuttontemplate');
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
    } else if (type===3) {
        var answerbuttontemplate = document.getElementById('shorttextanswertemplate');
        var clone = answerbuttontemplate.content.cloneNode(true);
        clone.querySelector("input").id=0;
        clone.querySelector("div").classList.add('clone');
        answerlist.appendChild(clone);
        document.getElementById('nextqn').onclick = function() {textCheckAnswer()};
        if (qnlist[currentqn]['strictcase']==true){
            document.getElementById('additionalnotes').innerHTML="Case sensitive.";
        }
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

// For Short Text Answer
// Enable submit button if there is text entered
function textToggleSubmit(value){
    if (value.length>0) {
        document.getElementById('nextqn').innerHTML="Submit";
        document.getElementById('nextqn').disabled=false;
    } else {
        document.getElementById('nextqn').innerHTML="Waiting for answer...";
        document.getElementById('nextqn').disabled=true;
    }
}

// Check answer
function textCheckAnswer(){
    var userinput = document.getElementById("0").value;
    var acceptedAnswers = qnlist[currentqn]['options'];
    // Convert to UPPERCASE if case-insensitive
    if (qnlist[currentqn]['strictcase']!==true){
        userinput = userinput.toUpperCase();
        acceptedAnswers = acceptedAnswers.map(function(x){ return x.toUpperCase(); })
    }
    var correct=false;
    for (var i=0; i<acceptedAnswers.length; i++) {
        if (userinput===acceptedAnswers[i]) {
            correct = true;
            break;
        }
    }
    if (correct){
        correctqns++;
        document.getElementById('nextqn').classList.remove('btn-dark');
        document.getElementById('nextqn').classList.add('btn-success');
        correctqns++;
    } else {
        document.getElementById('nextqn').classList.remove('btn-dark');
        document.getElementById('nextqn').classList.add('btn-danger');
    }
    finishQn();
}



// Time elapsed
function msToHMS(duration) {
    var seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours+":"+minutes+":"+seconds;
}
var start = Date.now(), timeelapsed;
setInterval(function() {
    timeelapsed = msToHMS(Date.now() - start);
    document.getElementById('timeelapsed').innerHTML = timeelapsed+" elapsed";
    document.getElementById('timeelapsedval').value = timeelapsed;
}, 1000)

// Function for expanding image
function expandImage(){
    const element = document.getElementById("imgdiv");
    element.classList.toggle('imgzoom');
    document.getElementsByTagName('body')[0].classList.toggle('noscroll');
    (element.classList.contains('imgzoom'))?element.setAttribute("style","top:"+window.scrollY+"px"):null;
}

// Enter to submit
document.addEventListener("keydown", function(event) {
    if (event.code === "Enter") {
        // Trigger the button element with a click
        document.getElementById("nextqn").click();
    }
});