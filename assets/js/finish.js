var getparams = new URLSearchParams(location.search.substring(1));
var uid = getparams.get("uid");
var score = getparams.get("score");
var numqn = getparams.get("numqn");
var timeelapsed = getparams.get("timeelapsed");
const localfilename = sessionStorage.getItem('localfilename');
const localfile = localfilename != null;

$(document).ready(function() 
{
    if (!localfile) {
        $.ajax({
            type: "GET",
            url: "/data/modules.json",
            success: function (response) {
                process(response);
            },
            error: function (obj, textStatus, errorThrown) {
                console.log("Error "+textStatus+": "+errorThrown);
            }
        });
    } else {
        process(null);
    }
});

function process(data){
    var modulename;
    (!localfile)?modulename = Object.keys(data).find(key => data[key]['uid'] === uid):modulename=localfilename;
    document.getElementById('module').innerHTML = "Module: "+modulename;
    document.getElementById('score').innerHTML = "Score: "+score+"/"+numqn;
    document.getElementById('timeelapsed').innerHTML = "Time Taken: "+timeelapsed;
}