$(document).ready(function() {
    $('.save').on('click', function() {
        const btn = $(this);
        const text = $(this).val();
        const td = $(this).parents('tr');
        const select = td.find('select');
        const status = select.val();
        const _id = td.find('.orderId').text();
        const statuses = ['Pending', 'Confirmed', 'Received', 'Cancelled'];
        let consent = true;
        console.log(status);
        console.log(_id);
        console.log($(this).val());
        if (status == 'Cancelled') {
            consent = confirm('Do you really want to cancel?');
        }

        if (text == 'Save' && consent) {
            // get date
            currDate = new Date();
            // eslint-disable-next-line max-len
            jQuery.post('/postCommSaveOrder', {status: status, _id: _id, date: currDate}, function(res) {
                if (res.flag) {
                    console.log(res);
                    if (status == 'Pending') {
                    // dont disable anything
                    } else if (status == 'Confirmed') {
                    // disable pending, received
                    // eslint-disable-next-line max-len
                        select.find('option[value="'+statuses[0]+'"]').attr('disabled', true);
                        // eslint-disable-next-line max-len
                        select.find('option[value="'+statuses[1]+'"]').attr('disabled', true);
                        // eslint-disable-next-line max-len
                        select.find('option[value="'+statuses[2]+'"]').attr('disabled', true);
                        // get date of confirmation
                        console.log('success');
                    } else if (status =='Received') {
                    // do nothing, received is disabled anyways
                    } else if (status =='Cancelled') {
                    // disable all other options
                    // eslint-disable-next-line max-len
                        select.find('option[value="'+statuses[0]+'"]').attr('disabled', true);
                        // eslint-disable-next-line max-len
                        select.find('option[value="'+statuses[1]+'"]').attr('disabled', true);
                        // eslint-disable-next-line max-len
                        select.find('option[value="'+statuses[2]+'"]').attr('disabled', true);
                    }
                    btn.val('Edit');
                    select.prop('disabled', true);

                    // set date confirmed
                    location.reload(true);
                }
            });
        } else { // edit
            select.prop('disabled', false);
            $(this).val('Save');
        }
    });
});

