document.addEventListener('DOMContentLoaded', function () {
    
    var from = document.getElementById("from");
    var to = document.getElementById("to");

    from.addEventListener('change', function () {
        sendSelectionToServer();
    });

    to.addEventListener('change', function () {
        sendSelectionToServer();
    });

    function sendSelectionToServer() {
        var from_lang = from.value; 
        var to_lang = to.value;

        var xhr = new XMLHttpRequest();
        xhr.open('post', '/process_choice', true)
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        var data = JSON.stringify({
            selected_option1: from_lang,
            selected_option2: to_lang
        })

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Handle the server's response if needed
                console.log('Response from server:', xhr.responseText);
            }
        };

        xhr.send(data);
    }

    })

    
    
    