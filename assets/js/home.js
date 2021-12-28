$(document).ready(function() 
{
    $.ajax({
        type: "GET",
        url: "/solutional/data/modules.json",
        //url: "https://yjjcoolcool.github.io/solutional/data/modules.json",
        success: function (response) {
            document.querySelector(".container .row p").remove();
            displayModules(response);
        },
        error: function (obj, textStatus, errorThrown) {
            console.log("Error "+textStatus+": "+errorThrown);
        }
    });
});

function displayModules(modules){
    var cardtemplate = document.querySelector('#cardtemplate');
    var modulelist = document.querySelector('.container .row');
    Object.keys(modules).forEach((element)=>{
        var clone = cardtemplate.content.cloneNode(true);
        clone.querySelector(".card-title").innerText=element;
        (modules[element].description) ? clone.querySelector(".card-text").innerText=modules[element].description : null;
        clone.querySelector("a").href="module?uid="+modules[element].uid;
        modulelist.appendChild(clone)
    })
}
