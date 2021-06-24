$(document).on('click', '[data-to-section]', e => {
    const $el = $(e.currentTarget);
    $('[data-to-section].selected').removeClass('selected');
    $el.addClass('selected');

    const to = $el.attr('data-to-section');
    $('[data-section]').addClass('hidden');
    $(`[data-section="${to}"]`).removeClass('hidden');
});

$(document).on('click', '[data-to-tab]', e => {
    const $el = $(e.currentTarget);
    $('[data-to-tab].selected').removeClass('selected');
    $el.addClass('selected');

    const to = $el.attr('data-to-tab');
    $('[data-tab]').addClass('hidden');
    $(`[data-tab="${to}"]`).removeClass('hidden');
});

$(document).on('click', '[data-to-project]', () => {
    $('[data-section]').addClass('hidden');
    $(`[data-section="project"]`).removeClass('hidden');
});


$(document).on('click', '.dropdown', () => {
    $('.dropdown-menu').toggleClass('open');
});

$(document).on('click', '[data-service]', e => {
    $('.dropdown-menu').toggleClass('open');
    const $el = $(e.currentTarget);
    // $('[data-service].selected').removeClass('selected');
    // $el.addClass('selected');

    const html = `${$el.html()}<i class="fas fa-caret-down"></i>`;
    $('.dropdown').html(html);
});
