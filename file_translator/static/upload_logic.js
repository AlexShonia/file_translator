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
var tick = document.querySelector(".tick")
var download = document.getElementById("download");

tick.classList.add("tick-hidden")
loader.classList.add("loader-hidden");

drop_area.addEventListener('drop', function (e) {
    e.preventDefault();
    var file = e.dataTransfer.files[0]; // the file to be uploaded
    if (!file) {
        return false;
    }

    loader.classList.remove("loader-hidden");

    // we use XMLHttpRequest here instead of fetch, because with the former we can easily implement progress and speed.
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

    // show uploading progress
    var lastTime = Date.now();
    xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
            // update progress
            var percent = Math.floor(event.loaded / event.total * 100);
            document.getElementById('upload_progress').textContent = percent + '%';
        }
    };

    // send file to server
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    var fd = new FormData();
    fd.append('file', file);
    lastTime = Date.now();
    xhr.send(fd);
}, false);});



// loader logic 

// window.addEventListener("load", () => {
//     const loader = document.querySelector(".loader");
// })

