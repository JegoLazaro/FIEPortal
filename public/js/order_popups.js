$(document).ready(function() {

    $('#confirmpopup').hide();
    $('#removepopup').hide();
    $('.backdrop').hide();

    $('#btn-checkout').on('click', function() {
        $('#confirmpopup').show();
        $('.backdrop').show();

        $('.main-container').click(function(e) {
            e.preventDefault();
        });
    });

    $('#confirm-right-button').on('click', function() {
        
        $('#confirmpopup').hide();
        $('.backdrop').hide();

        $('.main-container').click(function(e) {
            e.preventDefault();
        });
    })
})
