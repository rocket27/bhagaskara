$(document).ready(function() {
    
    $(".owl-carousel-team").owlCarousel({
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

    var owl = $('.owl-carousel-team');
    owl.owlCarousel();

    $('.teamControlPrev').click(function(e) {
        e.preventDefault();
        owl.trigger('prev.owl.carousel');
    })

    $('.teamControlNext').click(function(e) {
        e.preventDefault();
        owl.trigger('next.owl.carousel');
    });

    $(".owl-carousel-review").owlCarousel({
        loop:true,
        nav:false,
        dots:true,
        margin:100,
        items:1,
        smartSpeed:2000,
        autoplay:true,
        autoplayTimeout:10000,
    });

});