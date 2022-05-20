$(document).ready(function() {
    $('#popup').hide();
    $('#cancelpopup').hide();
    $('#deletepopup').hide();
    $('#confirmpopup').hide();

    let usernameFlag = false;
    $('#registration').on('click', function() {
        const firstName = $('#firstName').val().trim();
        const lastName = $('#lastName').val().trim();
        const email = $('#email').val().trim();
        const completeAddress = $('#completeAddress').val().trim();
        const city = $('#city').val().trim();
        const phonenumber = $('#phonenumber').val().trim();
        const postalCode = $('#postalCode').val().trim();
        const userType = $('#userType').val().trim();
        const username = $('#username').val().trim();

        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        console.log(userType);

        let valid = toggleValidityBorder('#firstName',
            !isFieldEmpty(firstName));
        valid = toggleValidityBorder('#lastName',
            !isFieldEmpty(lastName))&& valid;
        valid = toggleValidityBorder('#email',
            !isFieldEmpty(email)&&re.test(email))&& valid;
        valid = toggleValidityBorder('#completeAddress',
            !isFieldEmpty(completeAddress))&& valid;
        valid = toggleValidityBorder('#city',
            !isFieldEmpty(city))&& valid;
        valid = (toggleValidityBorder('#username',
            !isFieldEmpty(username)&& usernameFlag)&& valid);


        let branchName;
        if (userType ==='Franchisee') {
            branchName = $('#branchName').val().trim();
            valid = toggleValidityBorder('#branchName',
                !isFieldEmpty(branchName))&& valid;
        } else {
            branchName ='';
        }

        valid = toggleValidityBorder('#postalCode',
            !isFieldEmpty(postalCode) &&
            !isInvalidNumberLen(postalCode, 4) &&
            isNumeric(postalCode))&& valid;

        valid = toggleValidityBorder('#phonenumber',
            !isFieldEmpty(phonenumber) &&
            !isInvalidNumberLen(phonenumber.trim(), 11) &&
            isNumeric(phonenumber))&& valid;
        console.log('val'+valid);
        if (!valid) {
            return false;
        } else {
            jQuery.post('/registration', {
                firstName: firstName, lastName: lastName, email: email,
                completeAddress: completeAddress, branchName: branchName,
                city: city, phonenumber: phonenumber, postalCode: postalCode,
                userType: userType, username: username,
            }, function(data) {
                console.log(data._id);
                if (data.flag) {
                    $('#left-button-href').prop('href', '/user/'+data._id);
                    $('.backdrop').show();
                    $('#popup').show();
                } else {
                    alert('Failure to add to database');
                }
            });
            return false;
        }
    });
    $('#form-proper').submit(function(e) {
        e.preventDefault();
    });
    $('#cancel').on('click', function(e) {
        e.preventDefault();
        $('#cancelpopup').show();
        $('.backdrop').show();
    });
    $('#cancel-right-button').on('click', function(e) {
        $('#cancelpopup').hide();
        $('.backdrop').hide();
    });
    $('#postalCode').on('keyup paste input propertychange', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    $('#phonenumber').on('keyup paste input propertychange', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    $('#username').on('blur', function() {
        const username = $('#username').val().trim();
        if (!isFieldEmpty(username)) {
            jQuery.get('/checkUsername', {username: username}, function(res) {
                const isTaken = res.username === username;
                toggleValidityBorder('#username', !isTaken);
                if (isTaken) {
                    alert('Username is taken');
                    usernameFlag = false;
                } else usernameFlag = true;
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
/**
 *
 * @param {string} str string in question
 * @return {boolean} true if is a number otherwise false
 */
function isNumeric(str) {
    return /^-?\d+$/.test(str);
}
