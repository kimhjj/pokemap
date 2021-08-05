
$('.research > a').on('click', function(event) {
    var code = $(event.target).data('code');
    search(code);
});

function search(code) {
    var form = new FormData();
    form.set('code', code);
    var queryString = new URLSearchParams(form).toString();

    $.ajax({
        url: '/research',
        data: queryString,
        type: 'GET'
    }).done(function(data) {
        $('#researchListView').html(data);
    }).fail(function(jqXHR, textStatus, errorThrown) {
        debugger
    }).always(function(data) {});
}