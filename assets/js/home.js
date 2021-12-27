var schoolscoursesmodulestopics;
$(document).ready(function() 
{ 
    console.log("Hai")
    $.ajax({
        type: "GET",
        url: "/data/modules.json",
        //url: "https://yjjcoolcool.github.io/solutional/data/modules.json",
        success: function (response) {
            modules=response;
            displayModules();
        },
        error: function (obj, textStatus, errorThrown) {
            console.log("Error "+textStatus+": "+errorThrown);
        }
    });
});

function displayModules(){
    Object.keys(modules).forEach((element)=>{
        console.log(element)
    })
}
