var quizdata={};
var getparams = new URLSearchParams(location.search.substring(1));
var uid = getparams.get("uid");
var topics = getparams.get("topics");
var random = getparams.get("random");
var numqn = getparams.get("numqn");
var qndistribution = []
var currentqn = 0;
var qnlist = [];

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
    for (var i=0; i < topics.length; i++){
        if (topics[i]==="1"){
            for (var k=0; k < qndistribution[j]; k++){
                qnlist.push(data[i]['questions'][Math.floor(Math.random()*data[i]['questions'].length)])
            }
            j+=1;
        }
    }
    nextQn()
}

function nextQn(){

}