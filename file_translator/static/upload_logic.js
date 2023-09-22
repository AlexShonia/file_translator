// Wrap your code in a DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {
    
// prevent the default behavior of web browser
['dragleave', 'drop', 'dragenter', 'dragover'].forEach(function (evt) {
    document.addEventListener(evt, function (e) {
        e.preventDefault();
    }, false);
});

var drop_area = document.getElementById('drop_area');
var loader = document.querySelector(".loader");
var tick = document.querySelector(".tick");
var download = document.getElementById("download");

tick.classList.add("tick-hidden")
loader.classList.add("loader-hidden");

drop_area.addEventListener('drop', function (e) {
    e.preventDefault();
    var file = e.dataTransfer.files[0]; // the file to be uploaded
    if (!file){
        return false;
    }

    dropaera_text = document.getElementById("drop_area");

    if (!file["name"].includes(".docx")){
        dropaera_text.textContent = "Not a word file!";
        return false;
    }
    
    dropaera_text.textContent = "Uploaded✔️";


    loader.classList.remove("loader-hidden");

    var xhr = new XMLHttpRequest();
    xhr.open('post', '/', true); // aussume that the url / handles uploading.
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // uploading is successful

            loader.classList.add("loader-hidden");
            tick.classList.remove("tick-hidden")
            download.textContent = "Download";
            download.setAttribute("href", "/download")
            download.setAttribute("download", "output.txt")

            // alert('Successfully translated!');  // please replace with your own logic
        }
    };


    // send file to server
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    var fd = new FormData();
    fd.append('file', file);
    xhr.send(fd);
}, false);});


