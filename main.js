$(document).on('click', '[data-to-section]', e => {
    const $el = $(e.currentTarget);
    $('[data-to-section].selected').removeClass('selected');
    $el.addClass('selected');

    const to = $el.attr('data-to-section');
    $('[data-section]').hide();
    $(`[data-section="${to}"]`).show();
});
