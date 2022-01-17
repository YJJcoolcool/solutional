var getparams = new URLSearchParams(location.search.substring(1));
var uid = getparams.get("uid");
var score = getparams.get("score");
var numqn = getparams.get("numqn");
var timeelapsed = getparams.get("timeelapsed");

$(document).ready(function() 
{
    $.ajax({
        type: "GET",
        url: "/solutional/data/modules.json",
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
    var modulename = Object.keys(data).find(key => data[key]['uid'] === uid);
    document.getElementById('module').innerHTML = "Module: "+modulename;
    document.getElementById('score').innerHTML = "Score: "+score+"/"+numqn;
    document.getElementById('timeelapsed').innerHTML = "Time Taken: "+timeelapsed;
}