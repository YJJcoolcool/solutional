var options;
$(document).ready(function() 
{
    var getparams = new URLSearchParams(location.search.substring(1));
    var uid = getparams.get("uid");
    document.querySelector("#uid").value=uid;
    $.ajax({
        type: "GET",
        url: "/solutional/data/modules/"+uid+".json",
        //url: "https://yjjcoolcool.github.io/solutional/data/modules.json",
        success: function (response) {
            document.getElementById("loading").remove();
            document.getElementById("submit").disabled=false;
            displayTopics(response);
        },
        error: function (obj, textStatus, errorThrown) {
            console.log("Error "+textStatus+": "+errorThrown);
            setTimeout(()=>{
                document.getElementById("loading").style.color="red";
                document.getElementById("loading").innerHTML="Error "+textStatus+": "+errorThrown+"<br><br>(If this problem persists, please screenshot this page (including the URL) and create an issue <a href='https://github.com/YJJcoolcool/solutional/issues/new' target='_blank'>here</a>)";
            },1000);
        }
    });
});

function displayTopics(topics){
    var checkboxtemplate = document.querySelector('#checkboxtemplate');
    var topiclist = document.querySelector('.container .row table');
    Object.keys(topics).forEach((element)=>{
        options+="0";
        var clone = checkboxtemplate.content.cloneNode(true);
        clone.querySelector("input").id = element;
        clone.querySelector("label").htmlFor = element;
        if (topics[element].description) {
            clone.querySelector(".nodesc").remove();
            clone.querySelector("summary").innerText=topics[element].name;
            clone.querySelector("details p").innerText=topics[element].description;
        } else {
            clone.querySelector("details").remove();
            clone.querySelector("p").innerText=topics[element].name;
        }
        topiclist.appendChild(clone)
    })
}

function updateOptions(){
    options="";
    var checkboxes = document.getElementsByClassName("topic");
    for (var i = 0; i < checkboxes.length; i++) {
        (checkboxes[i].checked)?options+="1":options+="0";
    }
    document.querySelector("#topics").value=options;
}

function checkForm(){
    if (!options.includes("1")){
        alert("Please select at least 1 topic to continue.")
    }
    return options.includes("1");
}