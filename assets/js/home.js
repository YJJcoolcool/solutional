$(document).ready(function() 
{ 
    console.log("Hai")
    $.ajax({
        type: "GET",
        url: "https://yjjcoolcool.github.io/solutional/data/schoolscoursesmodulestopics.json",
        success: function (response) {
            console.log(response)
        },
        error: function (obj, textStatus, errorThrown) {
            console.log("Error "+textStatus+": "+errorThrown);
        }
    });
});
