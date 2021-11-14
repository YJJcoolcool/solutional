var schoolscoursesmodulestopics;
$(document).ready(function() 
{ 
    console.log("Hai")
    $.ajax({
        type: "GET",
        url: "https://yjjcoolcool.github.io/solutional/data/schoolscoursesmodulestopics.json",
        success: function (response) {
            schoolscoursesmodulestopics=response;
            displaySchools();
        },
        error: function (obj, textStatus, errorThrown) {
            console.log("Error "+textStatus+": "+errorThrown);
        }
    });
});

function displaySchools(){
    Object.keys(schoolscoursesmodulestopics['schools']).forEach((element)=>{
        console.log(element)
    })
}
