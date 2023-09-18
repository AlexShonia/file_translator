// Wrap your code in a DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {
    
// prevent the default behavior of web browser
['dragleave', 'drop', 'dragenter', 'dragover'].forEach(function (evt) {
    document.addEventListener(evt, function (e) {
        e.preventDefault();
    }, false);
});

var drop_area = document.getElementById('drop_area');
drop_area.addEventListener('drop', function (e) {
    e.preventDefault();
    var file = e.dataTransfer.files[0]; // the file to be uploaded
    if (!file) {
        return false;
    }

    // we use XMLHttpRequest here instead of fetch, because with the former we can easily implement progress and speed.
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/', true); // aussume that the url / handles uploading.
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // uploading is successful
            alert('Successfully translated!');  // please replace with your own logic
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