$(document).ready(function() {
    for (var i = 0; i < m.length; i++) {
        $('<div class="item"><img src="' + m[i] + '"><div class="carousel slide"></div>   </div>').appendTo('.carousel-inner');
        $('<li data-target="#myCarousel" data-slide-to="' + i + '"></li>').appendTo('.carousel-indicators')

    }
    $('.item').first().addClass('active');
    $('.carousel-indicators > li').first().addClass('active');
    $('#myCarousel').carousel();
});