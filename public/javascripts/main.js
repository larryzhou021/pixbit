$(document).ready(function () {
    $('#uploadFile').hide();
    $('#uploadFile').on("change", function () {
        var fd = new FormData();
        fd.append("file", $("#uploadFile").get(0).files[0]);
        $.ajax({
            url: "/api/image",
            type: "POST",
            processData: false,
            contentType: false,
            data: fd,
            success: function (d) {
                console.log(d);
            }
        });
    });
    $('.fun-btn').on('click', function (event) {
        $('#uploadFile').click();
        $(this).toggleClass('start-fun');
        var $page = $('.page');
        $page.toggleClass('color-bg-start')
            .toggleClass('bg-animate-color');
        //change text when when button is clicked

        $(this).hasClass('start-fun') ?
            $(this).text('stop the fun') :
            $(this).text('start the fun');

    });

});
