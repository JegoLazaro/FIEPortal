$(document).ready(function() {
    $('#popup').hide();
    $('#cancelpopup').hide();
    $('#deletepopup').hide();
    $('#confirmpopup').hide();

    $('#cancel').on('click', function() {
        $('#cancelpopup').show();
        $('.backdrop').show();

        $('#password-form-proper').click(function(e) {
            e.preventDefault();
        });
    });

    $('#change').on('click', function() {
        $('#confirmpopup').show();
        $('.backdrop').show();
        
    });

    $('#cancel-right-button').on('click', function() {
        $('#cancelpopup').hide();
        $('.backdrop').hide();
    });

    $('#confirm-left-button').on('click', function() {
        $('#confirmpopup').hide();
        $('.backdrop').hide();

        const new_password = $('#new_pw').val().trim();
        const confirm_password = $('#confirm_new_pw').val().trim();
        let valid;

        valid = toggleValidityBorder('#new_pw',
            !isFieldEmpty(new_password))&& valid;
        valid = toggleValidityBorder('#confirm_new_pw',
            !isFieldEmpty(confirm_password))&& valid;

        if(new_password === confirm_password && new_password !== '' && confirm_password !== '')
        {
            console.log('hi');
            valid = toggleValidityBorder('#confirm_new_pw', true);
        }
        else
        {
            valid = toggleValidityBorder('#confirm_new_pw', false);
        }

        if(!valid)
        {
            return false;
        }
        
    });

});


function isFieldEmpty(str) {
    return (!str || str.length === 0);
};

$(document).keypress(
    function(event){
      if (event.which == '13') {
        event.preventDefault();
      }
});

function toggleValidityBorder(fieldname, boolean) {
    if (!boolean) {
        $(fieldname).css('border', '2px solid red');
        return false;
    } else {
        $(fieldname).css('border', 'none');
        return true;
    }
}