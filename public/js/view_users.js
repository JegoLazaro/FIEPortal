$(document).ready(function() {
    $('#search').keyup(function() {
        const input = $('#search').val();
        const list = $('.user_row');
        const names = [];
        for (let i = 0; i < list.length; i++) {
            names.push($(list[i]).text());
        }

        for (let i = 0; i < names.length; i++) {
            str = names[i];
            if (str.indexOf(input) > -1) {
                list[i].style.display = '';
            } else {
                list[i].style.display ='none';
            }
        }
    });
});
