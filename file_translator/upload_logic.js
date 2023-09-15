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
    var fileList = e.dataTransfer.files; // the files to be uploaded
    if (fileList.length == 0) {
        return false;
    }

    // we use XMLHttpRequest here instead of fetch, because with the former we can easily implement progress and speed.
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/upload', true); // aussume that the url /upload handles uploading.
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // uploading is successful
            alert('Successfully uploaded!');  // please replace with your own logic
        }
    };

    // show uploading progress
    var lastTime = Date.now();
    var lastLoad = 0;
    xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
            // update progress
            var percent = Math.floor(event.loaded / event.total * 100);
            document.getElementById('upload_progress').textContent = percent + '%';

            // update speed
            var curTime = Date.now();
            var curLoad = event.loaded;
            var speed = ((curLoad - lastLoad) / (curTime - lastTime) / 1024).toFixed(2);
            document.getElementById('speed').textContent = speed + 'MB/s'
            lastTime = curTime;
            lastLoad = curLoad;
        }
    };

    // send files to server
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    var fd = new FormData();
    for (let file of fileList) {
        fd.append('files', file);
    }
    lastTime = Date.now();
    xhr.send(fd);
}, false);});