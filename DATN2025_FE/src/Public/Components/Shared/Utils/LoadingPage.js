import $ from 'jquery';

function LoadingPage() {
    let layout_loading = $('#layout_loading');

    if (layout_loading.hasClass('open')) {
        layout_loading.removeClass('open');
    } else {
        layout_loading.addClass('open');
    }
}

export default LoadingPage
