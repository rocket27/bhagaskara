$(document).ready(function(){
    
    $(".owl-carousel").owlCarousel({
        loop:true,
        nav:false,
        dots:true,
        margin:200,
        items:1,
        smartSpeed:1250,
        autoplay:true,
        autoplayTimeout:5000,
        autoplayHoverPause:true
    });

    var owl = $('.owl-carousel');
    owl.owlCarousel();

    $('.controlPrev').click(function(e) {
        e.preventDefault();
        owl.trigger('prev.owl.carousel');
    })

    $('.controlNext').click(function(e) {
        e.preventDefault();
        owl.trigger('next.owl.carousel');
    });

});