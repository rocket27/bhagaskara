$(document).ready(function() {

    $('tabs__controls-link').on('click', function(e) {
        
        e.preventDefault();

        var item = $(this).closest('.tabs__controls-item');
        var reqIndex = item.index();

        item.addClass('tabs__controls-item_active')
            .siblings().removeClass('tabs__controls-item_active');

        console.log(reqIndex);

    });

});