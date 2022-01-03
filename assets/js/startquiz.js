var quizdata={};
var getparams = new URLSearchParams(location.search.substring(1));
var uid = getparams.get("uid");
var topics = getparams.get("topics");
var random = getparams.get("random");

$(document).ready(function() 
{
    document.querySelector("#uid").value=uid;
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
    var datatopics = Object.keys(data)
    console.log(topics)
    for (i=0; i<datatopics.length; i++){
        if (topics[i]=="1") {
            quizdata[datatopics[i]]=data[datatopics[i]]
        }
    }
}