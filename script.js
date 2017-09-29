$(document).ready(function () {

    /*https://stackoverflow.com/questions/3906142/how-to-save-a-png-from-javascript-variable*/

    'use strict';

    function SaveToDisk(fileURL, fileName) {
        // for non-IE
        if (!window.ActiveXObject) {
            var save = document.createElement('a');
            save.href = fileURL;
            save.target = '_blank';
            save.download = fileName || fileURL;
            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0,
                false, false, false, false, 0, null);
            save.dispatchEvent(evt);
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        }

        // for IE
        else if ( !! window.ActiveXObject && document.execCommand)     {
            var _window = window.open(fileURL, "_blank");
            _window.document.close();
            _window.document.execCommand('SaveAs', true, fileName || fileURL)
            _window.close();
        }
    }
    SaveToDisk("https://pp.userapi.com/c841133/v841133989/20e9c/dvpdD1b2gBY.jpg","im.jpg");
    SaveToDisk("https://sun9-9.userapi.com/c840220/v840220401/33b90/rTz_YZeeOdE.jpg","im1.jpg");


    // Drop One File

    var dropZone = $('#dropZone'),
        maxFileSize = 10000000; // максимальный размер файла - 10 мб.

    var fileAr = [];
    var cellAr = [];
    var cellArea = new CellArea();


    if (typeof(window.FileReader) == 'undefined') {
        dropZone.text('Не поддерживается браузером!');
        dropZone.addClass('error');
    }

    dropZone[0].ondragover = function () {
        dropZone.addClass('hover');
        return false;
    };

    dropZone[0].ondragleave = function () {
        dropZone.removeClass('hover');
        return false;
    };

    dropZone[0].ondrop = function (event) {
        event.preventDefault();
        dropZone.removeClass('hover');
        dropZone.addClass('drop');

        var file = event.dataTransfer.files[0];

        p(" ::: " + event.dataTransfer.files[0].path);

        // new FileOb(file.name, file.size, file);


        if (file.size > maxFileSize) {
            dropZone.text('Файл слишком большой!');
            dropZone.addClass('error');
            return false;
        }


        // Рисуем изображение

        var newNumber = fileAr.length;

        fileAr.push(file);
        cellAr.push(cellArea.drawCell(file, newNumber));


        p(file.name);

        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', uploadProgress, false);
        xhr.onreadystatechange = stateChange;
        xhr.open('POST', './upload.php');
        xhr.setRequestHeader('X-FILE-NAME', file.name);
        // xhr.send(file);
        var fd = new FormData
        fd.append("file", file)
        xhr.send(fd)

    };


    function uploadProgress(event) {
        var percent = parseInt(event.loaded / event.total * 100);
        dropZone.text('Загрузка: ' + percent + '%');
    }

    function stateChange(event) {
        if (event.target.readyState == 4) {
            if (event.target.status == 200) {
                // dropZone.text('Загрузка успешно завершена!'<br>);
                $(dropZone).html("Ответ сервера: " + event.target.responseText);
            } else {
                dropZone.text('Произошла ошибка!');
                dropZone.addClass('error');
            }
        }
    }

    // Controller

    $("#clear-q").click(function (e) {
        e.preventDefault();
        cellArea.clearAll();
    });

    $("#download-all").click(function (e) {
        e.preventDefault();

        all

        if (cellAr.length != 0) {
            cellAr.forEach(function (v, k) {



            })
        }

        /* ::: source: https://stackoverflow.com/questions/10473932/browser-html-force-download-of-image-from-src-dataimage-jpegbase64*/

        var img = document.getElementsByTagName("img");
        img.onclick = function() {
            // atob to base64_decode the data-URI
            var image_data = atob(img.src.split(',')[1]);
            // Use typed arrays to convert the binary data to a Blob
            var arraybuffer = new ArrayBuffer(image_data.length);
            var view = new Uint8Array(arraybuffer);
            for (var i=0; i<image_data.length; i++) {
                view[i] = image_data.charCodeAt(i) & 0xff;
            }
            try {
                // This is the recommended method:
                var blob = new Blob([arraybuffer], {type: 'application/octet-stream'});
            } catch (e) {
                // The BlobBuilder API has been deprecated in favour of Blob, but older
                // browsers don't know about the Blob constructor
                // IE10 also supports BlobBuilder, but since the `Blob` constructor
                //  also works, there's no need to add `MSBlobBuilder`.
                var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
                bb.append(arraybuffer);
                var blob = bb.getBlob('application/octet-stream'); // <-- Here's the Blob
            }

            // Use the URL object to create a temporary URL
            var url = (window.webkitURL || window.URL).createObjectURL(blob);
            location.href = url; // <-- Download!
        };

    });
    // Support Class

    function CellArea() {

        this.areaElem = document.getElementById("cellArea");
        this.cellArr = []
        this.drawCell = function (file, index) {

            var cell = new Cell(file);

            $(this.areaElem).append(cell.drawCell(index));
            this.cellArr.push(cell);
            return (cell);
        }

        this.clearAll = function () {
            $(this.areaElem).empty();
            p("clear");
        }

        function init() {

        }

        init();

        function Cell(file) {

            this.file = file;
            this.index = "0";

            this.drawCell = function (index) {

                this.index = index || this.index;

                var inner_link = document.createElement("a");
                $(inner_link).addClass("cell-link");

                var cell_content = document.createElement("div");
                $(cell_content).addClass("cell-content");

                var cell_back = document.createElement("div");
                $(cell_back).addClass("cell-back");

                var cell_name = document.createElement("div");
                $(cell_name).addClass("cell-name");

                var cell_inner = document.createElement("div");
                $(cell_inner).addClass("cell-inner");

                var cell = document.createElement("div");
                $(cell).addClass("cell");
                $(cell).data("number", this.index);

                var img = document.createElement("img");
                img.classList.add("obj");
                img.file = this.file;
                var reader = new FileReader();
                reader.onload = (function (aImg) {
                    return function (e) {
                        /*aImg.onload=function(){
                         ctx.drawImage(aImg,0,0);
                         }*/
                        // e.target.result is a dataURL for the image
                        //   aImg.src = e.target.result;
                        $(cell_content).css("background-image", "url(" + e.target.result + ")");

                    };
                })(img);
                reader.readAsDataURL(this.file);
                $(cell_name).html(file.name);


                $(cell_inner).append($(inner_link));
                $(cell_inner).append($(cell_back));
                $(cell_inner).append($(cell_content));
                $(cell_inner).append($(cell_name));
                $(cell).append($(cell_inner));

                return $(cell);
            }
        }
    }

    function FileOb(name, size, file) {

        this.name = name || "noname";
        this.size = size || "888";
        this.file = file;
        this.addToArray = function () {

            fileAr.push(this);
            console.log("Push :: " + this.name);
        }

        this.addToArray();
    }

    function p($name) {

        console.log($name);

    }
});

/*

var a = $("<a>").attr("href", "http://i.stack.imgur.com/L8rHf.png").attr("download", "img.png").appendTo("body");
a[0].click();
a.remove();*/
