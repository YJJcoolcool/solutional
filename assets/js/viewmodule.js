var options;
$(document).ready(function() 
{
    var getparams = new URLSearchParams(location.search.substring(1));
    var uid = getparams.get("uid");
    //document.querySelector("#uid").value=uid;
    $.ajax({
        type: "GET",
        url: "/solutional/data/moduledata/"+uid+".json",
        //url: "https://yjjcoolcool.github.io/solutional/data/modules.json",
        success: function (response) {
            document.getElementById("loading").remove();
            displayModuleData(response);
            $.ajax({
                type: "GET",
                url: "/solutional/data/modules.json",
                success: function (response) {
                    Object.keys(response).forEach(element=>{
                        if (response[element]['uid']===uid){
                            document.title="View Questions & Answers | "+element+" | Solutional"
                        }
                    })
                },
                error: function (obj, textStatus, errorThrown) {
                    console.error("Error "+textStatus+": "+errorThrown);
                }
            });
        },
        error: function (obj, textStatus, errorThrown) {
            console.error("Error "+textStatus+": "+errorThrown);
            setTimeout(()=>{
                document.getElementById("loading").style.color="red";
                document.getElementById("loading").innerHTML="Error "+textStatus+": "+errorThrown+"<br><br>(If this problem persists, please screenshot this page (including the URL) and create an issue <a href='https://github.com/YJJcoolcool/solutional/issues/new' target='_blank'>here</a>)";
            },1000);
        }
    });
});

function displayModuleData(topics){
    var topictemplate = document.querySelector('#topictemplate');
    var topiclist = document.querySelector('.row');
    for (var i=0; i<topics.length; i++) {
        var clone = topictemplate.content.cloneNode(true);
        clone.querySelector("h2").innerHTML = topics[i]['name'];
        for (var j=0; j<topics[i]['questions'].length; j++) {
            var question = topics[i]['questions'][j]['question'];
            var questionclone = document.getElementById('questiontemplate').content.cloneNode(true);
            question = question.replaceAll('@`wotf','Which of the following');
            questionclone.querySelector("h4").innerHTML = question;
            for (var k=0; k<topics[i]['questions'][j]['options'].length; k++) {
                var option = topics[i]['questions'][j]['options'][k];
                var optionclone = document.getElementById('optiontemplate').content.cloneNode(true);
                option = option.replace("[]","✔");
                optionclone.querySelector("p").innerHTML = option;
                questionclone.querySelector('div').appendChild(optionclone)
            }
            clone.querySelector('div').appendChild(questionclone)
        }
        topiclist.appendChild(clone)
    }
}