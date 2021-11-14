$(document).ready(function() 
{ 
    $.ajax({
        type: "GET",
        url: "https://yjjcoolcool.github.io/solutional/data/schoolscoursesmodulestopics.json",
        dataType: "JSON",
        success: function (response) {
            console.log(response)
        },
        error: function (obj, textStatus, errorThrown) {
            console.log("Error "+textStatus+": "+errorThrown);
        }
    });
});
