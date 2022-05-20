$(document).ready(function() {
    let duplicateItemNameFlag = false;
    $(':input[type="number"]').on('input', function(e) {
        const validNumber = new RegExp(/^\d*\.?\d*$/);
        if (validNumber.test(this.value)) {
            this.value = this.value;
        }
    });

    $('.name_input').on('change', function() {
        const itemName = $(this).val().trim();
        const _id = $(this).parents('tr').find('._id').text().trim();
        console.log(itemName);
        if (!isFieldEmpty(itemName)) {
            jQuery.get('/checkItemName', {itemName: itemName}, function(res) {
                const isTaken = res.itemName === itemName;
                const isSelf = res._id == _id;
                console.log(res._id);
                console.log(_id);
                console.log(isSelf);
                toggleValidityBorder($(this), !(isTaken&&!isSelf));
                if (isTaken && !isSelf) {
                    alert('Duplicate Item Name !');
                    duplicateItemNameFlag = true;
                } else duplicateItemNameFlag = false;
            });
        }
    });

    $('.table-edit').click(function() {
        // console.log(branchNames);
        const currentTR = $(this).parents('tr');
        const currentTD = currentTR.find('td');
        const skip = [0, 6, 7, 9, 11, 12, 13];
        if ($(this).html() == 'Edit') {
            let i = 0;
            // availability, total start, total release, end, difference, match


            $.each(currentTD, function() {
                // eslint-disable-next-line max-len
                if (skip.includes(i) || i === currentTD.length-1 || i === currentTD.length-2 || i === currentTD.length) {

                } else if (i == 2) {
                    $(this).find('select').prop('disabled', false);
                } else {
                    $(this).find('input').prop('readonly', false);
                    $(this).find('input').css('border', '1px solid black');
                }

                i++;
            });
            $(this).html($(this).html() == 'Edit' ? 'Save' : 'Edit');
        } else { // save
            const branchNames = [];
            let i = 0;
            $('.branch').each(function() {
                branchNames[i] = $(this).text().trim();
                i++;
            });

            let valid = true;
            const itemDetails = [];

            i = 0;
            $.each(currentTD, function() {
                if (i > 0 && i < currentTD.length - 2) {
                    let input;
                    if (i == 2) {
                        itemDetails[i] = $(this).find('select').val();
                        input = $(this).find('select');
                    } else {
                        itemDetails[i] = $(this).find('input').val();
                        input = $(this).find('input');
                    }

                    if (skip.includes(i)) {

                    } else {
                        let validity = !isFieldEmpty(itemDetails[i]);
                        // eslint-disable-next-line max-len
                        if (i == 1) validity = validity && !duplicateItemNameFlag;
                        // eslint-disable-next-line max-len
                        valid = (toggleValidityBorder(input, validity)) && valid;
                        console.log('i:' + i + ':' + itemDetails[i] +
                                ':' + !isFieldEmpty(itemDetails[i]));
                    }
                }

                i++;
            });
            console.log('---');
            console.log(itemDetails);
            const beginningValue = itemDetails[4].trim();
            const delivery = itemDetails[5].trim();
            const totalStart = parseInt(beginningValue) + parseInt(delivery);
            const pullout = itemDetails[8].trim();
            const physicalCount = itemDetails[10].trim();
            let _id;
            if (itemDetails[13] !== undefined) {
                _id = itemDetails[13].trim();
            } else {
                _id = null;
            }
            const orderquantity = itemDetails.slice(14, -1);
            let totalReleased = orderquantity.reduce(function(a, b) {
                return (parseInt(a)+parseInt(b));
            }, 0);
            if (isNaN(totalReleased)) totalReleased = 0;
            const totalEnd = totalStart - totalReleased - parseInt(pullout);
            const difference = totalEnd - parseInt(physicalCount);
            const match = difference == 0;
            const notes = itemDetails[itemDetails.length-1].trim();
            // console.log(notes);
            body = {
                itemName: itemDetails[1].trim(),
                itemType: itemDetails[2],
                itemPrice: Number(itemDetails[3].trim()).toFixed(2),
                beginningValue: beginningValue,
                delivery: delivery,
                totalStart: totalStart,
                totalReleased: totalReleased, // sum of branches
                pullout: pullout,
                totalEnd: totalEnd,
                physicalCount: physicalCount,
                difference: difference,
                match: match,
                notes: notes,
                _id: _id,
                orderquantity: orderquantity,
                branches: (branchNames),
            };


            if (valid) {
                jQuery.post('/editInventoryItem', body, function(result) {
                    console.log(result);
                    if (result.flag && result._id) {
                        // console.log(result.flag);
                        // console.log(result._id);
                        currentTR.find('._id').text(result._id);
                        // console.log('Z');
                    }
                    if (result.flag) location.reload(true);
                });
                $(this).find('input').prop('readonly', true);
                $(currentTD).find('select').prop('disabled', true);
                $(this).html($(this).html() == 'Edit' ? 'Save' : 'Edit');
            } else {

            }


            // console.log(body);
        }
    });

    $(function() {
        const TABLE = $('table');

        $('.table-add').click(function() {
            // console.log('adding');
            const clone = TABLE
                .find('tr.hide')
                .clone(true)
                .removeClass('hide table-line');

            TABLE.append(clone);
            clone.find('.table-edit').trigger('click');
        });

        $('.table-remove').click(function() {
            const currentTR = $(this).parents('tr');
            const boolDel = confirm('Do you want to delete?');
            if (boolDel) {
                const _id = currentTR.find('._id').text().trim();
                console.log(_id);
                jQuery.post('/deleteItem', {_id: _id}, function(flag) {
                    // alert(flag);
                });
                $(this)
                    .parents('tr')
                    .detach();
            }
        });
    });

    $('.availability').click(function() {
        const currentTR = $(this).parents('tr');
        // console.log('object');
        const _id = currentTR.find('._id').text().trim();
        console.log(_id);
        if (_id === '') {
            alert('Make sure to edit and save the item first.');
        } else {
            if ($(this).hasClass('fas fa-eye')) {
                $(this).removeClass('fas fa-eye');
                $(this).addClass('far fa-eye-slash');
                jQuery.post('/changeAvailability',
                    {availability: false, _id: _id}, function(flag) {
                        // console.log(flag);
                        currentTR.find('._id').html(_id);
                    });
            } else if ($(this).hasClass('far fa-eye-slash')) {
                $(this).removeClass('far fa-eye-slash');
                $(this).addClass('fas fa-eye');
                jQuery.post('/changeAvailability',
                    {availability: true, _id: _id}, function(flag) {
                        // console.log(flag);
                        currentTR.find('._id').html(_id);
                    });
            }
        }
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
 * @param {element} name name of element
 * @param {boolean} valid false if red border ; true otherwise
 * @return {boolean} return the boolean value
 */
    function toggleValidityBorder(name, valid) {
        if (valid) {
            $(name).css('border', 'none');
            return true;
        } else {
            $(name).css('border', '2px solid red');
            return false;
        }
    }
});

