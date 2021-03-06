let data;
let currentKpi;

$.getJSON('data.json', json => {
    data = json;

    loadService(Object.keys(data.services)[0]);
});

$(document).on('click', '[data-to-section]', e => {
    const $el = $(e.currentTarget);
    $('[data-to-section].selected').removeClass('selected');
    $el.addClass('selected');

    const to = $el.attr('data-to-section');
    $('[data-section]').addClass('hidden');
    $(`[data-section="${to}"]`).removeClass('hidden');

    if (to === 'analysis') $('[data-to-tab="new-analysis"]').click();
});

$(document).on('click', '[data-to-tab]', e => {
    const $el = $(e.currentTarget);
    $('[data-to-tab].selected').removeClass('selected');
    $el.addClass('selected');

    const to = $el.attr('data-to-tab');
    $('[data-tab]').addClass('hidden');
    $(`[data-tab="${to}"]`).removeClass('hidden');
});

$(document).on('click', '[data-to-project]', e => {
    $('[data-section]').addClass('hidden');
    const id = parseInt($(e.currentTarget).attr('data-to-project'));
    const project = data.projects.find(d => d.id === id);

    const html = `<p data-back><i class="fas fa-arrow-left"></i>${currentKpi.title}</p>
    <h2>Projet IT : ${project.title}${project.tags.map(d => `<span class="tag" data-tag="${d}"></span>`).join('')}</h2>`;
    $('#project .title').html(html);

    $('[data-to-tab="dashboard"]').click();

    $(`#project`).removeClass('hidden');
});

$(document).on('click', '.dropdown', () => {
    $('.dropdown-menu').toggleClass('open');
});

$(document).on('click', '[data-service]', e => {
    $('.dropdown-menu').toggleClass('open');
    const $el = $(e.currentTarget);
    
    const html = `${$el.html()}<i class="fas fa-caret-down"></i>`;
    $('.dropdown').html(html);
    
    const service = $el.attr('data-service');
    loadService(service);
});

$(document).on('click', '[data-kpi]', e => {
    const $el = $(e.currentTarget);
    const id = parseInt($el.attr('data-kpi'));

    $('[data-kpi]').removeClass('selected');
    $(`[data-kpi="${id}"]`).addClass('selected');

    if ($el.parent().is('ul')) {
        const top = $(`.data [data-kpi="${id}"]`).position().top - 100;
        $('.data').scrollTop(top);
    }

    openKpi(id);
});

$(document).on('click', '[data-back]', () => {
    openKpi(currentKpi.id);

    $('[data-section]').addClass('hidden');
    $(`[data-section="kpis"]`).removeClass('hidden');
});

function loadService(slug) {
    if ($('[data-to-section="kpis"]').is('.selected')) {
        $('[data-section]').addClass('hidden');
        $(`[data-section="kpis"]`).removeClass('hidden');
    }
    
    const service = data.services[slug];

    $('#kpis').empty();
    $('#list-kpis').empty();

    $('.info h2').html('');
    $('#projects').html('<div></div><div></div><div></div>');

    if (!service) {
        const html = '<p class="center dim">Aucun indicateur</p>';
        $('#kpis').append(html);
        return;
    }

    for (const id of service.kpis) {
        const kpi = data.kpis.find(d => d.id === id);

        const html = `<div class="box" data-kpi="${id}">
            <h3>${kpi.title}</h3>
            <img src="./img/chart${id}.png" alt="Chart" />
        </div>`;
        
        $('#kpis').append(html);

        const li = `<li data-kpi="${id}">${kpi.title}</li>`;
        $('#list-kpis').append(li);
    }
}

function openKpi(id) {
    if (id === -1) {
        $('.info h2').empty();
        $('.budget .chart').empty();
        $('#projects').html('<div></div><div></div><div></div>');
        return;
    }

    const kpi = data.kpis.find(d => d.id === id);
    currentKpi = kpi;

    $('.info h2').html(kpi.title);

    const html = `<div class="values">
        <div>
            <p>Budget total</p>
            <p><strong>${Math.round(kpi.budget.total / 100)}K ???</strong></p>
        </div>
        <div>
            <p>Budget d??pens??</p>
            <p><strong>${Math.round(kpi.budget.spent / 100 * kpi.budget.total / 100)}K ???</strong><span>${kpi.budget.spent}%</span></p>
        </div>
    </div>
    <div class="bar">
        ${kpi.projects.map(d => {
            d = parseInt(d);
            const share = kpi.budget.shares.find(p => p.project === d)?.share;
            const width = share * kpi.budget.spent / 100;

            return `<div style="width: ${width}%"></div>`;
        }).join('')}
    </div>
    <ul>
        ${kpi.projects.map(d => {
            d = parseInt(d);
            const project = data.projects.find(p => p.id === d);
            const share = kpi.budget.shares.find(p => p.project === d)?.share;

            return `<li>${project.title}<span>${share || 0}%</span></li>`;
        }).join('')}
    </ul>`;

    $('.budget .chart').html(html);

    $('#projects').empty();

    for (const id of kpi.projects) {
        const project = data.projects.find(d => d.id === id);

        const html = `<div class="box" data-to-project="${id}">
            <h3>${project.title}${project.tags.map(d => `<span class="tag" data-tag="${d}"></span>`).join('')}</h3>
            <i class="fas fa-chevron-right"></i>
            <p>${project.description}</p>
        </div>`;

        $('#projects').append(html);
    }
}
