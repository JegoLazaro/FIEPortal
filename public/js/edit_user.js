$(document).ready(function() {
    $('#popup').hide();
    $('#cancelpopup').hide();
    $('#deletepopup').hide();
    $('#confirmpopup').hide();

    $('#cancel').on('click', function() {
        $('#cancelpopup').show();
        $('.backdrop').show();

        $('#edit-form-proper').click(function(e) {
            e.preventDefault();
        });
    });

    $('#delete').on('click', function() {
        $('#deletepopup').show();
        $('.backdrop').show();
        $('#edit-form-proper').click(function(e) {
            e.preventDefault();
        });
    });

    $('#confirm').on('click', function() {
        $('#confirmpopup').show();
        $('.backdrop').show();
        
    });

    $('#confirm-left-button').on('click', function() {
        
        $('#confirmpopup').hide();
        $('.backdrop').hide();

        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const firstName = $('#edit_fName').val().trim();
        const lastName = $('#edit_lName').val().trim();
        const email = $('#edit_email').val().trim();
        const completeAddress = $('#edit_address').val().trim();
        const city = $('#edit_city').val().trim();
        const phonenumber = $('#edit_number').val().trim();
        const postalCode = $('#edit_postal').val().trim();
        const userType = $('#user_type').val().trim();
        const username = $('#edit_username').val().trim();

        console.log(firstName);
        let valid = toggleValidityBorder('#edit_fName',
            !isFieldEmpty(firstName));
        valid = toggleValidityBorder('#edit_lName',
            !isFieldEmpty(lastName))&& valid;
        valid = toggleValidityBorder('#edit_email',
            !isFieldEmpty(email)&&re.test(email))&& valid;
        valid = toggleValidityBorder('#edit_address',
            !isFieldEmpty(completeAddress))&& valid;
        valid = toggleValidityBorder('#edit_city',
            !isFieldEmpty(city))&& valid;
        valid = toggleValidityBorder('#edit_username',
            !isFieldEmpty(username))&& valid;

        let branchName;
        if (userType === 'Franchisee') {
            branchName = $('#edit_branch').val().trim();
            valid = toggleValidityBorder('#edit_branch',
                !isFieldEmpty(branchName))&& valid;
        } else {
            branchName = '';
        }

        valid = toggleValidityBorder('#edit_postal',
            !isFieldEmpty(postalCode) &&
            !isInvalidNumberLen(postalCode, 4) &&
            isNumeric(postalCode))&& valid;

        valid = toggleValidityBorder('#edit_number',
            !isFieldEmpty(phonenumber) &&
            !isInvalidNumberLen(phonenumber.trim(), 11) &&
            isNumeric(phonenumber))&& valid;

        if (!valid) {
            return false;
        }
       
    });

    $('#delete-right-button').on('click', function() {
        $('#deletepopup').hide();
    });

    $('#cancel-right-button').on('click', function() {
        $('#cancelpopup').hide();
        $('.backdrop').hide();

    });

    $('#edit_number').on('keyup paste input propertychange', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    $('#edit_postal').on('keyup paste input propertychange', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    $('#edit_username').on('blur', function() {
        const parser = document.createElement('a');
        const url = $(location).attr('href');
        parser.href = url;
        const _id = parser.pathname.split('/edit_user/')[1];

        const username = $('#edit_username').val().trim();
        // console.log(username);
        if (!isFieldEmpty(username)) {
            jQuery.get('/checkUsername', {username: username}, function(res) {
                const isTaken = res.username === username;
                // console.log(isTaken);
                if (isTaken) {
                    jQuery.get('/checkAccInfo', {username: username},
                        function(res) {
                            const isSameUser = res._id === _id;
                            // console.log(_id);
                            // console.log(res._id);
                            toggleValidityBorder('#edit_username', isSameUser);
                            if (!isSameUser) alert('Username is taken.');
                        });
                }
            });
        }
    });
});

/**
 *
 * @param {string} str string object
 * @return {boolean} checks if the string is empty
 */
function isFieldEmpty(str) {
    return (!str || str.length === 0);
};
/**
 *
 * @param {number} num the number
 * @param {number} len length of number
 * @return {boolean} true if the number is of len length otherwise false.
 */
function isInvalidNumberLen(num, len) {
    return (num.toString().length !== len);
}
/**
 *
 * @param {string} fieldname class id of field in question
 * @param {boolean} boolean true if red border ; false otherwise
 * @return {boolean} return the boolean value
 */
function toggleValidityBorder(fieldname, boolean) {
    if (boolean) {
        $(fieldname).css('border', '2px solid red');
        return true;
    } else {
        $(fieldname).css('border', 'none');
        return false;
    }
}
/**
 *
 * @param {string} str string in question
 * @return {boolean} true if is a number otherwise false
 */
function isNumeric(str) {
    return /^-?\d+$/.test(str);
}

/**
 *
 * @param {string} fieldname class id of field in question
 * @param {boolean} valid false if red border ; true otherwise
 * @return {boolean} return the boolean value
 */
function toggleValidityBorder(fieldname, valid) {
    if (valid) {
        $(fieldname).css('border', 'none');
        return true;
    } else {
        $(fieldname).css('border', '2px solid red');
        return false;
    }
}

$(document).keypress(
    function(event){
      if (event.which == '13') {
        event.preventDefault();
      }
});
