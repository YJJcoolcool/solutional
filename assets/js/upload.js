window.addEventListener("dragover", (e) => {
    e.preventDefault();
    document.getElementById("upload").classList.add('showdragdrop');
});

window.addEventListener("drop", (e) => {
    e.preventDefault();
    document.getElementById("upload").classList.remove('showdragdrop');
    fileEvent(e);
    //if (files) {
    //}
});

window.addEventListener("dragleave", (e) => {
    document.getElementById("upload").classList.remove('showdragdrop');
});

document.getElementById("file").addEventListener('change', (e) => {
  fileEvent(e);
});

function fileEvent(e){
    var dropfile =  e.dataTransfer || (e.originalEvent && e.originalEvent.dataTransfer);
    var files = e.target.files || (dropfile && dropfile.files);
    if (files[0].type!="application/json"){
        document.getElementById("upload").classList.remove('showdragdrop');
        document.getElementById("upload").classList.add('dragdroperror');
        document.getElementById("fileuploadlabel").innerText = "Only .json files are allowed! Please try again.";
        window.setTimeout(()=>{
            document.getElementById("upload").classList.remove('dragdroperror');
            document.getElementById("fileuploadlabel").innerText = "Drag & drop a file from your computer, or upload manually:";
        },2000);
    } else {
        sessionStorage.setItem('localfilename', files[0].name);
        storeFileAndRedirect(files[0]);
    }
}

function storeFileAndRedirect(file) {
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function(){
        data = reader.result;
        parsedData = JSON.parse(data);
        console.log(parsedData)
        sessionStorage.setItem('loadedQuizData', JSON.stringify(parsedData));
        window.location = "startquiz?localfile";
    }
}
