$(document).ready(function () {

    'use strict';


    // Drop One File

    var dropZone = $('#dropZone'),
        maxFileSize = 10000000; // максимальный размер файла - 10 мб.

    var fileAr = [];
    var cellArea = new CellArea;

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

        p(" ::: "+event.dataTransfer.files[0].path);

       // new FileOb(file.name, file.size, file);


        if (file.size > maxFileSize) {
            dropZone.text('Файл слишком большой!');
            dropZone.addClass('error');
            return false;
        }



        // Рисуем изображение

        cellArea.drawCell(file);

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



    function CellArea() {

        this.areaElem = document.getElementById("cellArea");
        this.cellArr = []
        this.drawCell = function (file) {

            var cell = new Cell(file).createCell();
            $(this.areaElem).append($(cell));
            this.cellArr.push(cell);

        }


        function Cell(file) {

            this.file = file;

            this.createCell = function () {

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



                var img = document.createElement("img");
                img.classList.add("obj");
                img.file = this.file;
                var reader=new FileReader();
                reader.onload=(function(aImg){
                    return function(e) {
                        /*aImg.onload=function(){
                            ctx.drawImage(aImg,0,0);
                        }*/
                        // e.target.result is a dataURL for the image
                     //   aImg.src = e.target.result;
                        $(cell_content).css("background-image","url("+ e.target.result+")");

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

        function init() {

        }

        init();
    }
    function p($name) {

        console.log($name);

    }
});

